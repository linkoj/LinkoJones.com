"""Backend API tests for UX Museum Portfolio.

Endpoints covered:
- GET /api/             -> service status
- GET /api/health       -> health check
- POST /api/contact     -> create contact
- GET /api/contact      -> list contacts (most-recent-first)
"""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # Fallback to frontend/.env value when env not exported in shell.
    env_path = "/app/frontend/.env"
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                if line.startswith("REACT_APP_BACKEND_URL="):
                    BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
                    break

assert BASE_URL, "REACT_APP_BACKEND_URL must be set"


@pytest.fixture(scope="module")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# -- root + health -----------------------------------------------------------
class TestServiceStatus:
    def test_root_ok(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/")
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("status") == "ok"

    def test_health(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/health")
        assert r.status_code == 200, r.text
        assert r.json().get("status") == "healthy"


# -- contact ----------------------------------------------------------------
class TestContact:
    def test_create_contact_and_persist(self, api_client):
        unique = uuid.uuid4().hex[:8]
        payload = {
            "name": f"TEST_User_{unique}",
            "email": f"test_{unique}@example.com",
            "message": f"TEST_message_{unique} - hello from pytest",
        }
        r = api_client.post(f"{BASE_URL}/api/contact", json=payload)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["name"] == payload["name"]
        assert body["email"] == payload["email"]
        assert body["message"] == payload["message"]
        assert "id" in body and isinstance(body["id"], str) and len(body["id"]) > 0
        assert "created_at" in body and isinstance(body["created_at"], str)

        # Verify persistence by listing and finding our contact.
        time.sleep(0.4)
        r2 = api_client.get(f"{BASE_URL}/api/contact")
        assert r2.status_code == 200
        items = r2.json()
        assert isinstance(items, list)
        assert any(c["id"] == body["id"] for c in items), "created contact not in list"

    def test_list_contacts_sorted_desc(self, api_client):
        # Create two contacts in order and verify ordering.
        u1 = uuid.uuid4().hex[:8]
        u2 = uuid.uuid4().hex[:8]
        a = api_client.post(
            f"{BASE_URL}/api/contact",
            json={"name": f"TEST_A_{u1}", "email": f"a_{u1}@x.com", "message": "first"},
        ).json()
        time.sleep(1.1)
        b = api_client.post(
            f"{BASE_URL}/api/contact",
            json={"name": f"TEST_B_{u2}", "email": f"b_{u2}@x.com", "message": "second"},
        ).json()
        time.sleep(0.3)

        r = api_client.get(f"{BASE_URL}/api/contact")
        assert r.status_code == 200
        items = r.json()
        ids = [c["id"] for c in items]
        # most-recent-first => b should appear before a
        assert b["id"] in ids and a["id"] in ids
        assert ids.index(b["id"]) < ids.index(a["id"]), "list is not sorted most-recent-first"

    def test_create_contact_validation_missing_fields(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/contact", json={"name": "x"})
        assert r.status_code == 422

    def test_create_contact_validation_empty_strings(self, api_client):
        r = api_client.post(
            f"{BASE_URL}/api/contact",
            json={"name": "", "email": "a@b.co", "message": ""},
        )
        assert r.status_code == 422

    def test_no_mongo_id_leak(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/contact")
        assert r.status_code == 200
        for c in r.json():
            assert "_id" not in c
