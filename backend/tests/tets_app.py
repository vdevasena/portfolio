import os
import json
from app import app

def test_health_endpoint():
    client = app.test_client()
    res = client.get("/health")
    assert res.status_code == 200
    assert res.get_json().get("ok") is True


def test_chat_endpoint_basic():
    client = app.test_client()
    payload = {"message": "What is Devasena’s portfolio about?", "history": []}
    res = client.post("/chat", data=json.dumps(payload), content_type="application/json")
    assert res.status_code == 200
    data = res.get_json()
    assert "response" in data
    assert isinstance(data["response"], str)