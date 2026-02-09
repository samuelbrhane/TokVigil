from typing import List

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.auth import get_current_user
from app.auth.models import User
from app.workspaces import services
from app.workspaces.schemas import *
from app.core.exceptions import WorkspaceNotFoundError, EnvironmentNotFoundError, APIKeyNotFoundError

router = APIRouter()


# == Workspace 
@router.post("", response_model=WorkspaceResponse, status_code=status.HTTP_201_CREATED)
def create_workspace(
    data: WorkspaceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new workspace with default environments."""
    return services.create_workspace(db, data, current_user.id, current_user.email)



@router.get("", response_model=PaginatedWorkspaceResponse)
def list_workspaces(
    current_user: User = Depends(get_current_user),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """List workspaces owned by current user."""
    return services.get_workspaces(db, current_user.id, page=page, page_size=page_size)


@router.get("/{workspace_id}", response_model=WorkspaceDetailResponse)
def get_workspace(
    workspace_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get workspace by ID with environments."""
    workspace = services.get_workspace(db, workspace_id, current_user.id)
    if not workspace:
        raise WorkspaceNotFoundError()
    return workspace


@router.put("/{workspace_id}", response_model=WorkspaceResponse)
def update_workspace(
    workspace_id: int,
    data: WorkspaceUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update workspace."""
    workspace = services.update_workspace(db, workspace_id, current_user.id, data, current_user.email)
    if not workspace:
        raise WorkspaceNotFoundError()
    return workspace


@router.delete("/{workspace_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_workspace(
    workspace_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete workspace (soft delete)."""
    deleted = services.delete_workspace(db, workspace_id, current_user.id, current_user.email)
    if not deleted:
        raise WorkspaceNotFoundError()
    return None


# == Environment
@router.get("/{workspace_id}/environments", response_model=List[EnvironmentResponse])
def list_environments(
    workspace_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List environments for a workspace."""
    workspace = services.get_workspace(db, workspace_id, current_user.id)
    if not workspace:
        raise WorkspaceNotFoundError()
    return services.get_environments(db, workspace_id)


@router.post("/{workspace_id}/environments", response_model=EnvironmentResponse, status_code=status.HTTP_201_CREATED)
def create_environment(
    workspace_id: int,
    data: EnvironmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new environment."""
    workspace = services.get_workspace(db, workspace_id, current_user.id)
    if not workspace:
        raise WorkspaceNotFoundError()
    return services.create_environment(db, workspace_id, data, current_user.id, current_user.email)


# == API Key 
@router.get("/{workspace_id}/api-keys", response_model=List[ApiKeyResponse])
def list_api_keys(
    workspace_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List API keys for a workspace."""
    workspace = services.get_workspace(db, workspace_id, current_user.id)
    if not workspace:
        raise WorkspaceNotFoundError()
    return services.get_api_keys(db, workspace_id)


@router.post("/{workspace_id}/api-keys", response_model=ApiKeyCreatedResponse, status_code=status.HTTP_201_CREATED)
def create_api_key(
    workspace_id: int,
    data: ApiKeyCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new API key. The full key is only shown once."""
    workspace = services.get_workspace(db, workspace_id, current_user.id)
    if not workspace:
        raise WorkspaceNotFoundError()
    
    result = services.create_api_key(db, workspace_id, data, current_user.id, current_user.email)
    if not result:
        raise EnvironmentNotFoundError()
    
    api_key, full_key = result
    return ApiKeyCreatedResponse(
        id=api_key.id,
        workspace_id=api_key.workspace_id,
        environment_id=api_key.environment_id,
        name=api_key.name,
        key_prefix=api_key.key_prefix,
        is_active=api_key.is_active,
        created_at=api_key.created_at,
        last_used_at=api_key.last_used_at,
        key=full_key
    )


@router.delete("/{workspace_id}/api-keys/{api_key_id}", status_code=status.HTTP_204_NO_CONTENT)
def revoke_api_key(
    workspace_id: int,
    api_key_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Revoke an API key."""
    workspace = services.get_workspace(db, workspace_id, current_user.id)
    if not workspace:
        raise WorkspaceNotFoundError()
    
    revoked = services.revoke_api_key(db, workspace_id, api_key_id, current_user.id, current_user.email)
    if not revoked:
        raise APIKeyNotFoundError()
    return None