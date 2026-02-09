from typing import List

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.auth import get_current_user
from app.auth.models import User
from app.workspaces.services import get_workspace
from app.policies import services
from app.policies.schemas import PolicyCreate, PolicyUpdate, PolicyResponse
from app.policies.schemas import PaginatedPolicyResponse

router = APIRouter()


@router.post("/{workspace_id}", response_model=PolicyResponse, status_code=status.HTTP_201_CREATED)
def create_policy(
    workspace_id: int,
    data: PolicyCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new policy for a workspace."""
    workspace = get_workspace(db, workspace_id, current_user.id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return services.create_policy(db, workspace_id, data, current_user.id, current_user.email)


@router.get("/{workspace_id}", response_model=PaginatedPolicyResponse)
def list_policies(
    workspace_id: int,
    current_user: User = Depends(get_current_user),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    plan: str = Query(None),
    feature: str = Query(None),
    is_active: bool = Query(None),
    db: Session = Depends(get_db)
):
    """List all policies for a workspace."""
    workspace = get_workspace(db, workspace_id, current_user.id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return services.get_policies(db, workspace_id, page, page_size, plan, feature, is_active)


@router.get("/{workspace_id}/{policy_id}", response_model=PolicyResponse)
def get_policy(
    workspace_id: int,
    policy_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific policy."""
    workspace = get_workspace(db, workspace_id, current_user.id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    policy = services.get_policy(db, policy_id, workspace_id)
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    return policy


@router.put("/{workspace_id}/{policy_id}", response_model=PolicyResponse)
def update_policy(
    workspace_id: int,
    policy_id: int,
    data: PolicyUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a policy."""
    workspace = get_workspace(db, workspace_id, current_user.id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    policy = services.update_policy(db, policy_id, workspace_id, data, current_user.id, current_user.email)
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    return policy


@router.delete("/{workspace_id}/{policy_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_policy(
    workspace_id: int,
    policy_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a policy (soft delete)."""
    workspace = get_workspace(db, workspace_id, current_user.id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    deleted = services.delete_policy(db, policy_id, workspace_id, current_user.id, current_user.email)
    if not deleted:
        raise HTTPException(status_code=404, detail="Policy not found")
    return None