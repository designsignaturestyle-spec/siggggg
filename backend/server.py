from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import re
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Signature Style Interiors API")

# Configure logging (must be before routes that reference `logger`)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    project_type: str
    budget_range: str
    message: Optional[str] = ""
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


# ---------- Routes ----------
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


@api_router.get("/leads", response_model=List[Lead])
async def list_leads():
    leads = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    for ld in leads:
        if isinstance(ld.get("created_at"), str):
            try:
                ld["created_at"] = datetime.fromisoformat(ld["created_at"])
            except ValueError:
                ld["created_at"] = datetime.now(timezone.utc)
    return leads


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
