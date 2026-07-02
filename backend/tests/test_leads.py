"""
Backend tests for ClearRun Records API
Covers: /api/health, /api/leads (POST), /api/leads/count (GET), /api/admin/leads (GET/PATCH)
"""
import os
import uuid
import pytest
import requests
from datetime import datetime, UTC
from pymongo import MongoClient

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "clearrun_records")
ADMIN_ACCESS_KEY = os.environ.get("ADMIN_ACCESS_KEY")
ADMIN_HEADERS = {"X-Admin-Key": ADMIN_ACCESS_KEY}


@pytest.fixture
def api_client():
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


@pytest.fixture
def mongo_leads_collection():
    client = MongoClient(MONGO_URL)
    yield client[DB_NAME].leads
    client.close()


class TestHealth:
    def test_health_check(self, api_client):
        resp = api_client.get(f"{BASE_URL}/api/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data.get("status") == "ok"


class TestLeads:
    def _payload(self, lead_type, suffix):
        return {
            "lead_type": lead_type,
            "name": f"TEST_Lead {suffix}",
            "business_name": "TEST_Riverside Bistro",
            "email": f"test_lead_{suffix}@example.com",
            "phone": "555-0100",
            "service_type": "grease-trap",
            "message": "Automated test submission",
        }

    def test_create_lead_trial_and_verify_count_increment(self, api_client):
        before = api_client.get(f"{BASE_URL}/api/leads/count").json()["total_leads"]

        payload = self._payload("trial", uuid.uuid4().hex[:8])
        resp = api_client.post(f"{BASE_URL}/api/leads", json=payload)
        assert resp.status_code == 201
        data = resp.json()
        assert data["lead_type"] == "trial"
        assert data["email"] == payload["email"]
        assert data["name"] == payload["name"]
        assert "id" in data
        assert isinstance(data["id"], str)
        assert "_id" not in data  # MongoDB internal id must never leak in the API response

        after = api_client.get(f"{BASE_URL}/api/leads/count").json()["total_leads"]
        assert after == before + 1

    def test_duplicate_submission_within_24h_returns_same_lead(self, api_client):
        payload = self._payload("trial", uuid.uuid4().hex[:8])
        first = api_client.post(f"{BASE_URL}/api/leads", json=payload)
        assert first.status_code == 201
        first_id = first.json()["id"]

        before = api_client.get(f"{BASE_URL}/api/leads/count").json()["total_leads"]
        second = api_client.post(f"{BASE_URL}/api/leads", json=payload)
        assert second.status_code == 201
        assert second.json()["id"] == first_id
        assert "_id" not in second.json()

        after = api_client.get(f"{BASE_URL}/api/leads/count").json()["total_leads"]
        assert after == before  # no new document created for the duplicate

    def test_create_lead_mockup(self, api_client):
        payload = self._payload("mockup", uuid.uuid4().hex[:8])
        resp = api_client.post(f"{BASE_URL}/api/leads", json=payload)
        assert resp.status_code == 201
        assert resp.json()["lead_type"] == "mockup"

    def test_create_lead_pilot(self, api_client):
        payload = self._payload("pilot", uuid.uuid4().hex[:8])
        resp = api_client.post(f"{BASE_URL}/api/leads", json=payload)
        assert resp.status_code == 201
        assert resp.json()["lead_type"] == "pilot"

    def test_create_lead_partner(self, api_client):
        payload = self._payload("partner", uuid.uuid4().hex[:8])
        resp = api_client.post(f"{BASE_URL}/api/leads", json=payload)
        assert resp.status_code == 201
        assert resp.json()["lead_type"] == "partner"

    def test_create_lead_trial_saves_qualification_fields(self, api_client):
        payload = self._payload("trial", uuid.uuid4().hex[:8])
        payload.update({
            "current_workflow": "Spreadsheet",
            "number_of_trucks": "4",
            "active_customer_accounts": "32",
        })
        resp = api_client.post(f"{BASE_URL}/api/leads", json=payload)
        assert resp.status_code == 201
        data = resp.json()
        assert data["service_type"] == "grease-trap"
        assert data["current_workflow"] == "Spreadsheet"
        assert data["number_of_trucks"] == "4"
        assert data["active_customer_accounts"] == "32"

    def test_create_lead_mockup_saves_service_and_workflow(self, api_client):
        payload = self._payload("mockup", uuid.uuid4().hex[:8])
        payload.update({"service_type": "FOG Interceptor Service", "current_workflow": "QuickBooks"})
        resp = api_client.post(f"{BASE_URL}/api/leads", json=payload)
        assert resp.status_code == 201
        data = resp.json()
        assert data["service_type"] == "FOG Interceptor Service"
        assert data["current_workflow"] == "QuickBooks"

    def test_create_lead_partner_saves_partner_type_and_service_area(self, api_client):
        payload = self._payload("partner", uuid.uuid4().hex[:8])
        payload.update({"partner_type": "Hood cleaning company", "service_area": "Central Georgia"})
        resp = api_client.post(f"{BASE_URL}/api/leads", json=payload)
        assert resp.status_code == 201
        data = resp.json()
        assert data["partner_type"] == "Hood cleaning company"
        assert data["service_area"] == "Central Georgia"

    def test_create_lead_invalid_type_rejected(self, api_client):
        payload = self._payload("bogus_type", uuid.uuid4().hex[:8])
        resp = api_client.post(f"{BASE_URL}/api/leads", json=payload)
        assert resp.status_code == 400

    def test_create_lead_missing_email_rejected(self, api_client):
        payload = self._payload("trial", uuid.uuid4().hex[:8])
        payload.pop("email")
        resp = api_client.post(f"{BASE_URL}/api/leads", json=payload)
        assert resp.status_code == 422

    def test_create_lead_invalid_email_rejected(self, api_client):
        payload = self._payload("trial", uuid.uuid4().hex[:8])
        payload["email"] = "not-an-email"
        resp = api_client.post(f"{BASE_URL}/api/leads", json=payload)
        assert resp.status_code == 422

    def test_leads_count_endpoint_returns_int(self, api_client):
        resp = api_client.get(f"{BASE_URL}/api/leads/count")
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data["total_leads"], int)


class TestAdminLeads:
    def _payload(self, lead_type, suffix):
        return {
            "lead_type": lead_type,
            "name": f"TEST_Admin Lead {suffix}",
            "business_name": "TEST_Peach State Grease Services",
            "email": f"test_admin_{suffix}@example.com",
            "service_type": "grease-trap",
        }

    def test_admin_leads_list_returns_leads_no_id_leak(self, api_client):
        payload = self._payload("trial", uuid.uuid4().hex[:8])
        create_resp = api_client.post(f"{BASE_URL}/api/leads", json=payload)
        assert create_resp.status_code == 201

        resp = api_client.get(f"{BASE_URL}/api/admin/leads", headers=ADMIN_HEADERS)
        assert resp.status_code == 200
        leads = resp.json()
        assert isinstance(leads, list)
        assert len(leads) > 0
        match = next((l for l in leads if l["email"] == payload["email"]), None)
        assert match is not None
        assert "_id" not in match
        assert "id" in match
        assert match["status"] == "New"

    def test_admin_leads_missing_key_returns_401(self, api_client):
        resp = api_client.get(f"{BASE_URL}/api/admin/leads")
        assert resp.status_code == 401

    def test_admin_leads_wrong_key_returns_403(self, api_client):
        resp = api_client.get(f"{BASE_URL}/api/admin/leads", headers={"X-Admin-Key": "definitely-wrong-key"})
        assert resp.status_code == 403

    def test_admin_key_never_echoed_in_response(self, api_client):
        resp = api_client.get(f"{BASE_URL}/api/admin/leads", headers=ADMIN_HEADERS)
        assert ADMIN_ACCESS_KEY not in resp.text

    def test_admin_lead_status_update(self, api_client):
        payload = self._payload("trial", uuid.uuid4().hex[:8])
        create_resp = api_client.post(f"{BASE_URL}/api/leads", json=payload)
        lead_id = create_resp.json()["id"]

        resp = api_client.patch(f"{BASE_URL}/api/admin/leads/{lead_id}/status", json={"status": "Reviewed"}, headers=ADMIN_HEADERS)
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "Reviewed"
        assert "_id" not in data

    def test_admin_lead_status_update_missing_key_returns_401(self, api_client):
        payload = self._payload("trial", uuid.uuid4().hex[:8])
        create_resp = api_client.post(f"{BASE_URL}/api/leads", json=payload)
        lead_id = create_resp.json()["id"]

        resp = api_client.patch(f"{BASE_URL}/api/admin/leads/{lead_id}/status", json={"status": "Reviewed"})
        assert resp.status_code == 401

    def test_admin_lead_status_update_rejects_invalid_status(self, api_client):
        payload = self._payload("trial", uuid.uuid4().hex[:8])
        create_resp = api_client.post(f"{BASE_URL}/api/leads", json=payload)
        lead_id = create_resp.json()["id"]

        resp = api_client.patch(f"{BASE_URL}/api/admin/leads/{lead_id}/status", json={"status": "Bogus"}, headers=ADMIN_HEADERS)
        assert resp.status_code == 400

    def test_admin_lead_status_update_unknown_id_returns_404(self, api_client):
        resp = api_client.patch(f"{BASE_URL}/api/admin/leads/507f1f77bcf86cd799439099/status", json={"status": "Reviewed"}, headers=ADMIN_HEADERS)
        assert resp.status_code == 404

    def test_legacy_document_without_new_fields_does_not_break(self, api_client, mongo_leads_collection):
        # Simulate a pre-existing document created before this PR's schema fields existed.
        legacy_email = f"legacy_{uuid.uuid4().hex[:8]}@example.com"
        legacy_doc = {
            "lead_type": "trial",
            "name": "TEST_Legacy Lead",
            "business_name": "TEST_Legacy Business",
            "email": legacy_email,
            "phone": "555-0000",
            "service_type": "grease-trap",
            "message": "Old-style free text field",
            "created_at": datetime.now(UTC),
        }
        mongo_leads_collection.insert_one(legacy_doc)

        resp = api_client.get(f"{BASE_URL}/api/admin/leads", headers=ADMIN_HEADERS)
        assert resp.status_code == 200
        leads = resp.json()
        match = next((l for l in leads if l["email"] == legacy_email), None)
        assert match is not None
        assert "_id" not in match
        assert match["status"] == "New"  # default applied for legacy doc missing status
        assert match["current_workflow"] is None
        assert match["number_of_trucks"] is None
        assert match["partner_type"] is None


class TestHoneypot:
    def _payload(self, suffix):
        return {
            "lead_type": "trial",
            "name": "TEST_Bot Lead",
            "email": f"test_hp_{suffix}@example.com",
        }

    def test_honeypot_filled_does_not_create_real_lead(self, api_client, mongo_leads_collection):
        suffix = uuid.uuid4().hex[:8]
        payload = self._payload(suffix)
        payload["hp_website"] = "http://spam.example.com"

        resp = api_client.post(f"{BASE_URL}/api/leads", json=payload)
        assert resp.status_code == 201  # looks successful to the bot

        stored = mongo_leads_collection.find_one({"email": payload["email"]})
        assert stored is None  # never persisted

    def test_honeypot_empty_creates_real_lead(self, api_client, mongo_leads_collection):
        suffix = uuid.uuid4().hex[:8]
        payload = self._payload(suffix)
        payload["hp_website"] = ""

        resp = api_client.post(f"{BASE_URL}/api/leads", json=payload)
        assert resp.status_code == 201

        stored = mongo_leads_collection.find_one({"email": payload["email"]})
        assert stored is not None
