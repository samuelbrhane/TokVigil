"""
Pytest configuration and fixtures.

Similar to Django's TestCase and test utilities.
"""

import pytest
from fastapi.testclient import TestClient

# Set test environment before importing app
import os
os.environ["APP_ENV"] = "test"
os.environ["DEBUG"] = "false"
os.environ["SECRET_KEY"] = "test-secret-key"
os.environ["DATABASE_URL"] = "sqlite:///./test.db"
os.environ["REDIS_URL"] = "redis://localhost:6379/1"

from app.main import app


@pytest.fixture(scope="session")
def client():
    """
    Create a test client for the FastAPI app.
    
    Similar to Django's Client() or APIClient().
    """
    with TestClient(app) as test_client:
        yield test_client
