from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import re
import logging
import uuid
from datetime import datetime, timezone, timedelta
from typing import List, Optional

import bcrypt
import jwt
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict, EmailStr, field_validator


# ---------- Configuration ----------
JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24
ADMIN_EMAIL = os.environ["ADMIN_EMAIL"].strip().lower()
ADMIN_PASSWORD = os.environ["ADMIN_PASSWORD"]

MAX_FAILED_ATTEMPTS = 5
LOCKOUT_MINUTES = 15

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create FastAPI app
app = FastAPI(title="Signature Style Interiors API")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

api_router = APIRouter(prefix="/api")
bearer_scheme = HTTPBearer(auto_error=False)


# ---------- Auth helpers ----------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_access_token(admin_id: str, email: str) -> str:
    payload = {
        "sub": admin_id,
        "email": email,
        "role": "admin",
        "exp": datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS),
        "iat": datetime.now(timezone.utc),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_admin(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
) -> dict:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    if payload.get("type") != "access" or payload.get("role") != "admin":
        raise HTTPException(status_code=401, detail="Invalid token type")

    admin = await db.admins.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not admin:
        raise HTTPException(status_code=401, detail="Admin not found")
    return admin


# ---------- Models ----------
class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    project_type: str
    budget_range: str
    message: Optional[str] = ""
    status: str = "new"  # new | contacted
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class LeadCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=7, max_length=20)
    project_type: str = Field(..., min_length=1, max_length=80)
    budget_range: str = Field(..., min_length=1, max_length=80)
    message: Optional[str] = Field("", max_length=2000)

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        cleaned = re.sub(r"[^0-9+]", "", v)
        if len(re.sub(r"\D", "", cleaned)) < 7:
            raise ValueError("Invalid phone number")
        return cleaned


class LeadStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(new|contacted)$")


class AdminLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1, max_length=200)


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = ACCESS_TOKEN_EXPIRE_HOURS * 3600
    admin: dict


class AdminInfo(BaseModel):
    id: str
    email: str
    role: str


# ---------- Public routes ----------
@api_router.get("/")
async def root():
    return {"message": "Signature Style Interiors API"}


@api_router.post("/leads", response_model=Lead, status_code=201)
async def create_lead(payload: LeadCreate):
    lead = Lead(**payload.model_dump())
    doc = lead.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    try:
        await db.leads.insert_one(doc)
    except Exception as e:
        logger.error(f"Failed to insert lead: {e}")
        raise HTTPException(status_code=500, detail="Could not save your request. Please try again.")
    return lead


# ---------- Admin auth routes ----------
def _client_ip(request: Request) -> str:
    xff = request.headers.get("x-forwarded-for")
    if xff:
        return xff.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


@api_router.post("/admin/login", response_model=LoginResponse)
async def admin_login(payload: AdminLogin, request: Request):
    email = payload.email.strip().lower()
    ip = _client_ip(request)
    identifier = f"{ip}:{email}"
    now = datetime.now(timezone.utc)

    # Brute-force check
    attempt = await db.login_attempts.find_one({"identifier": identifier}, {"_id": 0})
    if attempt and attempt.get("count", 0) >= MAX_FAILED_ATTEMPTS:
        locked_until = attempt.get("locked_until")
        if isinstance(locked_until, str):
            try:
                locked_until_dt = datetime.fromisoformat(locked_until)
            except ValueError:
                locked_until_dt = None
        else:
            locked_until_dt = locked_until
        if locked_until_dt and locked_until_dt > now:
            raise HTTPException(
                status_code=429,
                detail=f"Too many failed attempts. Try again in {LOCKOUT_MINUTES} minutes.",
            )

    admin = await db.admins.find_one({"email": email})
    if not admin or not verify_password(payload.password, admin["password_hash"]):
        # record failed attempt
        new_count = (attempt.get("count", 0) if attempt else 0) + 1
        update = {
            "identifier": identifier,
            "email": email,
            "count": new_count,
            "last_attempt_at": now.isoformat(),
        }
        if new_count >= MAX_FAILED_ATTEMPTS:
            update["locked_until"] = (now + timedelta(minutes=LOCKOUT_MINUTES)).isoformat()
        await db.login_attempts.update_one(
            {"identifier": identifier}, {"$set": update}, upsert=True
        )
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # success: clear attempts
    await db.login_attempts.delete_one({"identifier": identifier})

    token = create_access_token(admin["id"], admin["email"])
    return LoginResponse(
        access_token=token,
        admin={"id": admin["id"], "email": admin["email"], "role": admin.get("role", "admin")},
    )


@api_router.get("/admin/me", response_model=AdminInfo)
async def admin_me(admin: dict = Depends(get_current_admin)):
    return AdminInfo(id=admin["id"], email=admin["email"], role=admin.get("role", "admin"))


@api_router.get("/admin/leads", response_model=List[Lead])
async def admin_list_leads(_: dict = Depends(get_current_admin)):
    leads = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for ld in leads:
        if "status" not in ld:
            ld["status"] = "new"
        if isinstance(ld.get("created_at"), str):
            try:
                ld["created_at"] = datetime.fromisoformat(ld["created_at"])
            except ValueError:
                ld["created_at"] = datetime.now(timezone.utc)
    return leads


@api_router.patch("/admin/leads/{lead_id}/status", response_model=Lead)
async def admin_update_lead_status(
    lead_id: str,
    payload: LeadStatusUpdate,
    _: dict = Depends(get_current_admin),
):
    result = await db.leads.update_one(
        {"id": lead_id}, {"$set": {"status": payload.status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    lead = await db.leads.find_one({"id": lead_id}, {"_id": 0})
    if isinstance(lead.get("created_at"), str):
        try:
            lead["created_at"] = datetime.fromisoformat(lead["created_at"])
        except ValueError:
            lead["created_at"] = datetime.now(timezone.utc)
    return lead


@api_router.get("/admin/stats")
async def admin_stats(_: dict = Depends(get_current_admin)):
    total = await db.leads.count_documents({})
    new = await db.leads.count_documents({"$or": [{"status": "new"}, {"status": {"$exists": False}}]})
    contacted = await db.leads.count_documents({"status": "contacted"})
    week_ago = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
    this_week = await db.leads.count_documents({"created_at": {"$gte": week_ago}})
    return {
        "total": total,
        "new": new,
        "contacted": contacted,
        "this_week": this_week,
    }


# ---------- Startup ----------
@app.on_event("startup")
async def on_startup():
    # Indexes
    try:
        await db.admins.create_index("email", unique=True)
        await db.admins.create_index("id", unique=True)
        await db.leads.create_index("id", unique=True)
        await db.leads.create_index([("created_at", -1)])
        await db.login_attempts.create_index("identifier", unique=True)
    except Exception as e:
        logger.warning(f"Index creation warning: {e}")

    # Seed admin (idempotent)
    existing = await db.admins.find_one({"email": ADMIN_EMAIL})
    if existing is None:
        await db.admins.insert_one({
            "id": str(uuid.uuid4()),
            "email": ADMIN_EMAIL,
            "password_hash": hash_password(ADMIN_PASSWORD),
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info(f"Admin seeded: {ADMIN_EMAIL}")
    elif not verify_password(ADMIN_PASSWORD, existing["password_hash"]):
        await db.admins.update_one(
            {"email": ADMIN_EMAIL},
            {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}},
        )
        logger.info(f"Admin password updated for: {ADMIN_EMAIL}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


# ---------- App wiring ----------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
