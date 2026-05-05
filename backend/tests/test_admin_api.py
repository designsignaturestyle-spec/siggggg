"""Backend API tests for Signature Style Interiors admin auth + admin routes.

Covers:
- POST /api/admin/login (success, wrong password, brute-force lockout)
- GET /api/admin/me (with/without/invalid token)
- GET /api/admin/leads (auth required, no _id leak, sorted desc, defaults status)
- PATCH /api/admin/leads/{id}/status (toggle, invalid status -> 422, unknown id -> 404)
- GET /api/admin/stats (shape)
- POST /api/leads (public) remains functional
- GET /api/leads (old unauthenticated list) is REMOVED
"""
import os
import time
import pytest
import requests
from dotenv import load_dotenv
from pathlib import Path
from pymongo import MongoClient

load_dotenv(Path("/app/frontend/.env"))
load_dotenv(Path("/app/backend/.env"))

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = os.environ["ADMIN_EMAIL"].strip().lower()
ADMIN_PASSWORD = os.environ["ADMIN_PASSWORD"]
MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]

# Use a distinct email for brute-force tests so we don't lock out real admin
BRUTE_EMAIL = "nobody-bf@example.com"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def mongo():
    c = MongoClient(MONGO_URL)
    yield c[DB_NAME]
    c.close()


@pytest.fixture(scope="module", autouse=True)
def _cleanup_login_attempts(mongo):
    """Wipe login_attempts for our test identifiers before & after the suite."""
    mongo.login_attempts.delete_many({"email": {"$in": [ADMIN_EMAIL, BRUTE_EMAIL]}})
    yield
    mongo.login_attempts.delete_many({"email": {"$in": [ADMIN_EMAIL, BRUTE_EMAIL]}})


@pytest.fixture(scope="module")
def admin_token(client, mongo):
    # Ensure clean slate for real admin
    mongo.login_attempts.delete_many({"email": ADMIN_EMAIL})
    r = client.post(f"{API}/admin/login",
                    json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "access_token" in data
    return data["access_token"]


@pytest.fixture(scope="module")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


# ---------- /api/admin/login ----------
class TestAdminLogin:
    def test_login_success_returns_token_and_admin(self, client, mongo):
        mongo.login_attempts.delete_many({"email": ADMIN_EMAIL})
        r = client.post(f"{API}/admin/login",
                        json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert isinstance(data.get("access_token"), str) and len(data["access_token"]) > 20
        assert data.get("token_type") == "bearer"
        assert data.get("expires_in") == 24 * 3600
        admin = data.get("admin")
        assert admin and admin.get("email") == ADMIN_EMAIL
        assert admin.get("role") == "admin"
        assert "id" in admin
        assert "password_hash" not in admin
        assert "_id" not in admin

    def test_login_wrong_password_returns_401(self, client, mongo):
        mongo.login_attempts.delete_many({"email": ADMIN_EMAIL})
        r = client.post(f"{API}/admin/login",
                        json={"email": ADMIN_EMAIL, "password": "wrong-password-xyz"}, timeout=15)
        assert r.status_code == 401, r.text
        body = r.json()
        assert body.get("detail") == "Invalid email or password"
        # cleanup so we don't accumulate toward lockout of real admin
        mongo.login_attempts.delete_many({"email": ADMIN_EMAIL})

    def test_login_invalid_email_format_returns_422(self, client):
        r = client.post(f"{API}/admin/login",
                        json={"email": "not-an-email", "password": "x"}, timeout=15)
        assert r.status_code == 422

    def test_brute_force_lockout_after_5_attempts(self, client, mongo):
        """Use a fake email so real admin isn't locked out. 5 fails -> 6th returns 429."""
        mongo.login_attempts.delete_many({"email": BRUTE_EMAIL})
        for i in range(5):
            r = client.post(f"{API}/admin/login",
                            json={"email": BRUTE_EMAIL, "password": f"bad-{i}"}, timeout=15)
            assert r.status_code == 401, f"Attempt {i+1}: expected 401, got {r.status_code}"

        r6 = client.post(f"{API}/admin/login",
                         json={"email": BRUTE_EMAIL, "password": "bad-6"}, timeout=15)
        assert r6.status_code == 429, f"Expected lockout 429, got {r6.status_code}: {r6.text}"
        body = r6.json()
        assert "Too many failed attempts" in body.get("detail", "")
        # cleanup immediately
        mongo.login_attempts.delete_many({"email": BRUTE_EMAIL})


# ---------- /api/admin/me ----------
class TestAdminMe:
    def test_me_with_valid_token(self, client, auth_headers):
        r = client.get(f"{API}/admin/me", headers=auth_headers, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"
        assert "id" in data

    def test_me_without_token_returns_401(self, client):
        s = requests.Session()
        r = s.get(f"{API}/admin/me", timeout=15)
        assert r.status_code == 401

    def test_me_with_invalid_token_returns_401(self, client):
        r = client.get(f"{API}/admin/me",
                       headers={"Authorization": "Bearer not-a-real-jwt"}, timeout=15)
        assert r.status_code == 401


# ---------- /api/admin/leads ----------
class TestAdminLeads:
    def test_list_requires_auth(self, client):
        s = requests.Session()
        r = s.get(f"{API}/admin/leads", timeout=15)
        assert r.status_code == 401

    def test_list_returns_sorted_no_id_leak(self, client, auth_headers):
        # Seed two public leads to ensure data exists
        p1 = client.post(f"{API}/leads", json={
            "name": "TEST_AdminListA", "phone": "9000000011",
            "project_type": "Bedroom", "budget_range": "Budget",
        }, timeout=15)
        assert p1.status_code == 201
        time.sleep(1.1)
        p2 = client.post(f"{API}/leads", json={
            "name": "TEST_AdminListB", "phone": "9000000012",
            "project_type": "Bedroom", "budget_range": "Budget",
        }, timeout=15)
        assert p2.status_code == 201

        r = client.get(f"{API}/admin/leads", headers=auth_headers, timeout=15)
        assert r.status_code == 200, r.text
        leads = r.json()
        assert isinstance(leads, list) and len(leads) >= 2
        for ld in leads:
            assert "_id" not in ld
            assert "id" in ld and "name" in ld and "phone" in ld
            assert ld.get("status") in ("new", "contacted")
        ids = [ld["id"] for ld in leads]
        assert ids.index(p2.json()["id"]) < ids.index(p1.json()["id"])


# ---------- PATCH /api/admin/leads/{id}/status ----------
class TestAdminUpdateStatus:
    def test_toggle_status_flow(self, client, auth_headers):
        # Create a fresh lead
        cr = client.post(f"{API}/leads", json={
            "name": "TEST_ToggleStatus", "phone": "9000000050",
            "project_type": "Kitchen", "budget_range": "Premium",
        }, timeout=15)
        assert cr.status_code == 201
        lid = cr.json()["id"]

        r1 = client.patch(f"{API}/admin/leads/{lid}/status",
                          headers=auth_headers, json={"status": "contacted"}, timeout=15)
        assert r1.status_code == 200, r1.text
        assert r1.json()["status"] == "contacted"

        r2 = client.patch(f"{API}/admin/leads/{lid}/status",
                          headers=auth_headers, json={"status": "new"}, timeout=15)
        assert r2.status_code == 200
        assert r2.json()["status"] == "new"

    def test_invalid_status_returns_422(self, client, auth_headers):
        cr = client.post(f"{API}/leads", json={
            "name": "TEST_InvStatus", "phone": "9000000051",
            "project_type": "Kitchen", "budget_range": "Premium",
        }, timeout=15)
        lid = cr.json()["id"]
        r = client.patch(f"{API}/admin/leads/{lid}/status",
                         headers=auth_headers, json={"status": "bogus"}, timeout=15)
        assert r.status_code == 422

    def test_unknown_id_returns_404(self, client, auth_headers):
        r = client.patch(f"{API}/admin/leads/does-not-exist-uuid/status",
                         headers=auth_headers, json={"status": "contacted"}, timeout=15)
        assert r.status_code == 404

    def test_update_requires_auth(self, client):
        s = requests.Session()
        r = s.patch(f"{API}/admin/leads/whatever/status",
                    json={"status": "contacted"}, timeout=15)
        assert r.status_code == 401


# ---------- /api/admin/stats ----------
class TestAdminStats:
    def test_stats_shape(self, client, auth_headers):
        r = client.get(f"{API}/admin/stats", headers=auth_headers, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        for k in ("total", "new", "contacted", "this_week"):
            assert k in data
            assert isinstance(data[k], int)
            assert data[k] >= 0
        assert data["new"] + data["contacted"] <= data["total"] + 1  # allow legacy docs
        assert data["this_week"] <= data["total"]

    def test_stats_requires_auth(self, client):
        s = requests.Session()
        r = s.get(f"{API}/admin/stats", timeout=15)
        assert r.status_code == 401


# ---------- Public leads still work; old unauth GET removed ----------
class TestPublicLeadsAndRemovedEndpoint:
    def test_public_post_lead_still_works_and_visible_to_admin(self, client, auth_headers):
        marker = f"TEST_Marker_{int(time.time())}"
        cr = client.post(f"{API}/leads", json={
            "name": marker, "phone": "9000123456",
            "project_type": "Living Room", "budget_range": "Budget",
            "message": "visibility check",
        }, timeout=15)
        assert cr.status_code == 201

        r = client.get(f"{API}/admin/leads", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        names = [ld["name"] for ld in r.json()]
        assert marker in names

    def test_old_unauth_get_leads_removed(self, client):
        s = requests.Session()
        r = s.get(f"{API}/leads", timeout=15)
        assert r.status_code in (404, 405), f"Expected 404/405, got {r.status_code}: {r.text[:200]}"
