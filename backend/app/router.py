"""
API v1 Router.
"""

from fastapi import APIRouter

from app.api.v1.endpoints import health, workspaces, policies, evaluate, usage

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(
    health.router,
    prefix="/health",
    tags=["Health"],
)

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
