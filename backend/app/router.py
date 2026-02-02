from fastapi import APIRouter

from app.auth.router import router as auth_router
from app.workspaces.router import router as workspaces_router
from app.policies.router import router as policies_router
from app.usage.router import router as usage_router
from app.evaluate.router import router as evaluate_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["Auth"])
api_router.include_router(workspaces_router, prefix="/workspaces", tags=["Workspaces"])
api_router.include_router(policies_router, prefix="/policies", tags=["Policies"])
api_router.include_router(usage_router, prefix="/usage", tags=["Usage"])
api_router.include_router(evaluate_router, prefix="/evaluate", tags=["Evaluation"])