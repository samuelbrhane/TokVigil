"""
Basic tests to verify the setup works.

Run with: pytest
"""

import pytest
from fastapi.testclient import TestClient


class TestHealthEndpoints:
    """Test health check endpoints."""
    
    def test_root_endpoint(self, client: TestClient):
        """Test root endpoint returns healthy status."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "version" in data
    
    def test_health_endpoint(self, client: TestClient):
        """Test /health endpoint."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
    
    def test_api_health_endpoint(self, client: TestClient):
        """Test /api/v1/health endpoint."""
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert data["api_version"] == "v1"


class TestEvaluateEndpoint:
    """Test the evaluate endpoint."""
    
    def test_evaluate_returns_response(self, client: TestClient):
        """Test evaluate endpoint accepts request and returns decision."""
        response = client.post(
            "/api/v1/evaluate",
            json={
                "user_id": "user_123",
                "feature": "chat",
                "model": "gpt-4o-mini",
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "allowed" in data
        assert "reason_code" in data
        assert "limit_state" in data


class TestUsageEndpoint:
    """Test the usage endpoint."""
    
    def test_log_usage(self, client: TestClient):
        """Test logging usage."""
        response = client.post(
            "/api/v1/usage",
            json={
                "request_id": "req_test123",
                "user_id": "user_123",
                "feature": "chat",
                "model": "gpt-4o-mini",
                "input_tokens": 100,
                "output_tokens": 200,
                "estimated_cost_usd": 0.001,
                "status": "allowed",
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["recorded"] == True
