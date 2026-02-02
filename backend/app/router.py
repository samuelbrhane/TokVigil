"""
API v1 Router.
"""

from fastapi import APIRouter

from app.workspaces import router as workspaces
from app.policies import router as policies
from app.evaluate import router as evaluate
from app.usage import router as usage

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(
    workspaces.router,
    prefix="/workspaces",
    tags=["Workspaces"],
)

api_router.include_router(
    policies.router,
    prefix="/policies",
    tags=["Policies"],
)

api_router.include_router(
    evaluate.router,
    prefix="/evaluate",
    tags=["Evaluation"],
)

api_router.include_router(
    usage.router,
    prefix="/usage",
    tags=["Usage"],
)
