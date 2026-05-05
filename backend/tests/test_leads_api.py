"""Backend API tests for Signature Style Interiors leads endpoints."""
import os
import pytest
import requests
from dotenv import load_dotenv
from pathlib import Path

# Load frontend .env to get the public ingress URL
load_dotenv(Path("/app/frontend/.env"))

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Root endpoint ----------
class TestRoot:
    def test_root_returns_200_with_message(self, client):
        r = client.get(f"{API}/", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data.get("message") == "Signature Style Interiors API"


# ---------- POST /api/leads ----------
class TestCreateLead:
    def test_create_lead_valid_returns_201(self, client):
        payload = {
            "name": "TEST_John Doe",
            "phone": "+91 8748055124",
            "project_type": "Full Home Interiors",
            "budget_range": "Mid-Range",
            "message": "Looking for 2BHK design",
        }
        r = client.post(f"{API}/leads", json=payload, timeout=15)
        assert r.status_code == 201, f"Expected 201, got {r.status_code}: {r.text}"
        data = r.json()
        assert "id" in data and isinstance(data["id"], str) and len(data["id"]) > 0
        assert "created_at" in data and data["created_at"]
        assert data["name"] == payload["name"]
        # phone validator strips non-numeric except +
        assert data["phone"] == "+918748055124"
        assert data["project_type"] == payload["project_type"]
        assert data["budget_range"] == payload["budget_range"]
        assert data["message"] == payload["message"]
        # _id should NOT be leaked
        assert "_id" not in data

    def test_create_lead_minimal_message_optional(self, client):
        payload = {
            "name": "TEST_Jane",
            "phone": "9876543210",
            "project_type": "Modular Kitchen",
            "budget_range": "Premium",
        }
        r = client.post(f"{API}/leads", json=payload, timeout=15)
        assert r.status_code == 201, r.text
        data = r.json()
        assert data["message"] == ""
        assert "_id" not in data

    @pytest.mark.parametrize("missing_field", ["name", "phone", "project_type", "budget_range"])
    def test_create_lead_missing_required_returns_422(self, client, missing_field):
        payload = {
            "name": "TEST_Missing",
            "phone": "9876543210",
            "project_type": "Full Home Interiors",
            "budget_range": "Mid-Range",
            "message": "x",
        }
        payload.pop(missing_field)
        r = client.post(f"{API}/leads", json=payload, timeout=15)
        assert r.status_code == 422, f"For missing {missing_field} expected 422, got {r.status_code}: {r.text}"

    def test_create_lead_short_phone_returns_422(self, client):
        payload = {
            "name": "TEST_Short Phone",
            "phone": "12345",  # < 7 digits
            "project_type": "Full Home Interiors",
            "budget_range": "Budget",
            "message": "short phone",
        }
        r = client.post(f"{API}/leads", json=payload, timeout=15)
        assert r.status_code == 422, f"Expected 422, got {r.status_code}: {r.text}"

    def test_create_lead_short_phone_with_symbols_returns_422(self, client):
        # "(12) 345" -> only 5 digits after stripping non-numeric, should fail validator
        payload = {
            "name": "TEST_Short Phone Sym",
            "phone": "(12) 345",
            "project_type": "Full Home Interiors",
            "budget_range": "Budget",
        }
        r = client.post(f"{API}/leads", json=payload, timeout=15)
        assert r.status_code == 422, f"Expected 422, got {r.status_code}: {r.text}"

    def test_create_lead_short_name_returns_422(self, client):
        payload = {
            "name": "A",  # min_length=2
            "phone": "9876543210",
            "project_type": "Full Home Interiors",
            "budget_range": "Mid-Range",
        }
        r = client.post(f"{API}/leads", json=payload, timeout=15)
        assert r.status_code == 422


# ---------- GET /api/leads ----------
class TestListLeads:
    def test_list_leads_returns_array_no_objectid(self, client):
        # ensure at least one record exists
        client.post(f"{API}/leads", json={
            "name": "TEST_ListProbe",
            "phone": "9876501234",
            "project_type": "Living Room",
            "budget_range": "Premium",
            "message": "probe",
        }, timeout=15)

        r = client.get(f"{API}/leads", timeout=15)
        assert r.status_code == 200, r.text
        leads = r.json()
        assert isinstance(leads, list)
        assert len(leads) >= 1
        for ld in leads:
            assert "_id" not in ld, f"MongoDB _id leaked: {ld}"
            assert "id" in ld
            assert "name" in ld
            assert "phone" in ld
            assert "project_type" in ld
            assert "budget_range" in ld
            assert "created_at" in ld

    def test_list_leads_sorted_desc_by_created_at(self, client):
        # Insert two new leads sequentially
        r1 = client.post(f"{API}/leads", json={
            "name": "TEST_SortA",
            "phone": "9000000001",
            "project_type": "Bedroom",
            "budget_range": "Budget",
        }, timeout=15)
        assert r1.status_code == 201
        first_id = r1.json()["id"]

        import time
        time.sleep(1.1)

        r2 = client.post(f"{API}/leads", json={
            "name": "TEST_SortB",
            "phone": "9000000002",
            "project_type": "Bedroom",
            "budget_range": "Budget",
        }, timeout=15)
        assert r2.status_code == 201
        second_id = r2.json()["id"]

        r = client.get(f"{API}/leads", timeout=15)
        assert r.status_code == 200
        leads = r.json()
        ids = [ld["id"] for ld in leads]
        # second_id (newer) should appear before first_id
        assert second_id in ids and first_id in ids
        assert ids.index(second_id) < ids.index(first_id), \
            "Leads should be sorted desc by created_at (newest first)"

        # And created_at should be monotonically non-increasing
        timestamps = [ld["created_at"] for ld in leads[:10]]
        assert timestamps == sorted(timestamps, reverse=True), \
            f"Leads not sorted desc by created_at: {timestamps}"
