"""
Workspaces endpoints.

Workspaces are like tenants - each company/team has their own workspace.
Similar to Django's multi-tenant patterns.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db

router = APIRouter()


@router.get("")
async def list_workspaces(db: Session = Depends(get_db)):
    """
    List all workspaces.
    
    TODO: Implement with actual database query.
    """
    # Placeholder - will implement with actual models
    return {
        "message": "Workspaces endpoint - to be implemented",
        "endpoints": [
            "GET /workspaces - List workspaces",
            "POST /workspaces - Create workspace",
            "GET /workspaces/{id} - Get workspace",
            "PUT /workspaces/{id} - Update workspace",
            "DELETE /workspaces/{id} - Delete workspace",
            "GET /workspaces/{id}/environments - List environments",
            "GET /workspaces/{id}/api-keys - List API keys",
        ]
    }


@router.post("")
async def create_workspace(db: Session = Depends(get_db)):
    """Create a new workspace."""
    return {"message": "Create workspace - to be implemented"}


@router.get("/{workspace_id}")
async def get_workspace(workspace_id: int, db: Session = Depends(get_db)):
    """Get workspace by ID."""
    return {"message": f"Get workspace {workspace_id} - to be implemented"}
