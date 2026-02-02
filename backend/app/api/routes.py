import secrets
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_current_workspace
from app.models.models import Workspace, APIKey, Policy, UsageLog
from app.schemas.schemas import (
    WorkspaceCreate,
    WorkspaceResponse,
    APIKeyCreate,
    APIKeyResponse,
    PolicyCreate,
    PolicyUpdate,
    PolicyResponse,
    PolicyEvaluationRequest,
    PolicyEvaluationResponse,
    UsageLogCreate,
    UsageLogResponse,
)
from app.core.policy_engine import PolicyEngine


router = APIRouter()


# Workspace endpoints
@router.post("/workspaces", response_model=WorkspaceResponse, status_code=status.HTTP_201_CREATED)
async def create_workspace(
    workspace: WorkspaceCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new workspace."""
    # Check if workspace name already exists
    result = await db.execute(select(Workspace).where(Workspace.name == workspace.name))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Workspace with this name already exists",
        )
    
    db_workspace = Workspace(**workspace.model_dump())
    db.add(db_workspace)
    await db.commit()
    await db.refresh(db_workspace)
    return db_workspace


@router.get("/workspaces", response_model=List[WorkspaceResponse])
async def list_workspaces(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
):
    """List all workspaces."""
    result = await db.execute(select(Workspace).offset(skip).limit(limit))
    return result.scalars().all()


@router.get("/workspaces/{workspace_id}", response_model=WorkspaceResponse)
async def get_workspace(
    workspace_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get a specific workspace."""
    result = await db.execute(select(Workspace).where(Workspace.id == workspace_id))
    workspace = result.scalar_one_or_none()
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return workspace


# API Key endpoints
@router.post("/api-keys", response_model=APIKeyResponse, status_code=status.HTTP_201_CREATED)
async def create_api_key(
    api_key_data: APIKeyCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new API key for a workspace."""
    # Verify workspace exists
    result = await db.execute(select(Workspace).where(Workspace.id == api_key_data.workspace_id))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    # Generate a secure API key
    key = f"auc_{secrets.token_urlsafe(32)}"
    
    db_api_key = APIKey(
        key=key,
        name=api_key_data.name,
        workspace_id=api_key_data.workspace_id,
    )
    db.add(db_api_key)
    await db.commit()
    await db.refresh(db_api_key)
    return db_api_key


@router.get("/api-keys", response_model=List[APIKeyResponse])
async def list_api_keys(
    workspace_id: str = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
):
    """List API keys, optionally filtered by workspace."""
    query = select(APIKey)
    if workspace_id:
        query = query.where(APIKey.workspace_id == workspace_id)
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    return result.scalars().all()


# Policy endpoints
@router.post("/policies", response_model=PolicyResponse, status_code=status.HTTP_201_CREATED)
async def create_policy(
    policy: PolicyCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new policy."""
    # Verify workspace exists
    result = await db.execute(select(Workspace).where(Workspace.id == policy.workspace_id))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    db_policy = Policy(**policy.model_dump())
    db.add(db_policy)
    await db.commit()
    await db.refresh(db_policy)
    return db_policy


@router.get("/policies", response_model=List[PolicyResponse])
async def list_policies(
    workspace_id: str = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
):
    """List policies, optionally filtered by workspace."""
    query = select(Policy)
    if workspace_id:
        query = query.where(Policy.workspace_id == workspace_id)
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/policies/{policy_id}", response_model=PolicyResponse)
async def get_policy(
    policy_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get a specific policy."""
    result = await db.execute(select(Policy).where(Policy.id == policy_id))
    policy = result.scalar_one_or_none()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    return policy


@router.patch("/policies/{policy_id}", response_model=PolicyResponse)
async def update_policy(
    policy_id: str,
    policy_update: PolicyUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update a policy."""
    result = await db.execute(select(Policy).where(Policy.id == policy_id))
    db_policy = result.scalar_one_or_none()
    if not db_policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    
    # Update only provided fields
    update_data = policy_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_policy, field, value)
    
    await db.commit()
    await db.refresh(db_policy)
    return db_policy


@router.delete("/policies/{policy_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_policy(
    policy_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Delete a policy."""
    result = await db.execute(select(Policy).where(Policy.id == policy_id))
    db_policy = result.scalar_one_or_none()
    if not db_policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    
    await db.delete(db_policy)
    await db.commit()


# Policy evaluation endpoint
@router.post("/evaluate", response_model=PolicyEvaluationResponse)
async def evaluate_policy(
    request: PolicyEvaluationRequest,
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db),
):
    """Evaluate if a request should be allowed based on policies."""
    # Override workspace_id from authenticated workspace
    request.workspace_id = workspace.id
    
    engine = PolicyEngine(db)
    allowed, reason_code, message, policy_id = await engine.evaluate(request)
    
    return PolicyEvaluationResponse(
        allowed=allowed,
        reason_code=reason_code,
        message=message,
        policy_id=policy_id,
    )


# Usage logging endpoints
@router.post("/usage-logs", response_model=UsageLogResponse, status_code=status.HTTP_201_CREATED)
async def create_usage_log(
    log: UsageLogCreate,
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db),
):
    """Create a usage log entry."""
    # Override workspace_id from authenticated workspace
    log.workspace_id = workspace.id
    
    db_log = UsageLog(**log.model_dump())
    db.add(db_log)
    await db.commit()
    await db.refresh(db_log)
    return db_log


@router.get("/usage-logs", response_model=List[UsageLogResponse])
async def list_usage_logs(
    skip: int = 0,
    limit: int = 100,
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db),
):
    """List usage logs for the authenticated workspace."""
    result = await db.execute(
        select(UsageLog)
        .where(UsageLog.workspace_id == workspace.id)
        .order_by(UsageLog.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()
