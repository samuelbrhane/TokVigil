from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.workspaces import services
from app.workspaces.schemas import *

router = APIRouter()


# == Workspace 
@router.post("", response_model=WorkspaceResponse, status_code=status.HTTP_201_CREATED)
def create_workspace(data: WorkspaceCreate, db: Session = Depends(get_db)):
    """Create a new workspace with default environments."""
    workspace = services.create_workspace(db, data)
    return workspace


@router.get("", response_model=List[WorkspaceResponse])
def list_workspaces(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all workspaces."""
    return services.get_workspaces(db, skip=skip, limit=limit)


@router.get("/{workspace_id}", response_model=WorkspaceDetailResponse)
def get_workspace(workspace_id: int, db: Session = Depends(get_db)):
    """Get workspace by ID with environments."""
    workspace = services.get_workspace(db, workspace_id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return workspace


@router.put("/{workspace_id}", response_model=WorkspaceResponse)
def update_workspace(workspace_id: int, data: WorkspaceUpdate, db: Session = Depends(get_db)):
    """Update workspace."""
    workspace = services.update_workspace(db, workspace_id, data)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return workspace


@router.delete("/{workspace_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_workspace(workspace_id: int, db: Session = Depends(get_db)):
    """Delete workspace (soft delete)."""
    deleted = services.delete_workspace(db, workspace_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return None


# == Environment
@router.get("/{workspace_id}/environments", response_model=List[EnvironmentResponse])
def list_environments(workspace_id: int, db: Session = Depends(get_db)):
    """List environments for a workspace."""
    workspace = services.get_workspace(db, workspace_id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return services.get_environments(db, workspace_id)


@router.post("/{workspace_id}/environments", response_model=EnvironmentResponse, status_code=status.HTTP_201_CREATED)
def create_environment(workspace_id: int, data: EnvironmentCreate, db: Session = Depends(get_db)):
    """Create a new environment."""
    environment = services.create_environment(db, workspace_id, data)
    if not environment:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return environment


# == API Key 
@router.get("/{workspace_id}/api-keys", response_model=List[ApiKeyResponse])
def list_api_keys(workspace_id: int, db: Session = Depends(get_db)):
    """List API keys for a workspace."""
    workspace = services.get_workspace(db, workspace_id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return services.get_api_keys(db, workspace_id)


@router.post("/{workspace_id}/api-keys", response_model=ApiKeyCreatedResponse, status_code=status.HTTP_201_CREATED)
def create_api_key(workspace_id: int, data: ApiKeyCreate, db: Session = Depends(get_db)):
    """Create a new API key. The full key is only shown once."""
    result = services.create_api_key(db, workspace_id, data)
    if not result:
        raise HTTPException(status_code=404, detail="Workspace or environment not found")
    
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
def revoke_api_key(workspace_id: int, api_key_id: int, db: Session = Depends(get_db)):
    """Revoke an API key."""
    revoked = services.revoke_api_key(db, workspace_id, api_key_id)
    if not revoked:
        raise HTTPException(status_code=404, detail="API key not found")
    return None