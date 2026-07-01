"""
Backend tests for ClearRun Records API
Covers: /api/health, /api/leads (POST), /api/leads/count (GET)
"""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")


@pytest.fixture
def api_client():
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


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

        after = api_client.get(f"{BASE_URL}/api/leads/count").json()["total_leads"]
        assert after == before + 1

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
