import secrets
import hashlib
from datetime import datetime
from typing import Optional, List

from sqlalchemy.orm import Session

from .models import Workspace, Environment, ApiKey
from .schemas import WorkspaceCreate, WorkspaceUpdate, EnvironmentCreate, ApiKeyCreate


# = Workspace
def create_workspace(db: Session, data: WorkspaceCreate) -> Workspace:
    workspace = Workspace(name=data.name)
    db.add(workspace)
    db.commit()
    db.refresh(workspace)
    
    # Create default environments
    for env_name in ["development", "staging", "production"]:
        env = Environment(workspace_id=workspace.id, name=env_name)
        db.add(env)
    db.commit()
    
    return workspace


def get_workspace(db: Session, workspace_id: int) -> Optional[Workspace]:
    return db.query(Workspace).filter(
        Workspace.id == workspace_id,
        Workspace.is_deleted == False
    ).first()


def get_workspaces(db: Session, skip: int = 0, limit: int = 100) -> List[Workspace]:
    return db.query(Workspace).filter(
        Workspace.is_deleted == False
    ).offset(skip).limit(limit).all()


def update_workspace(db: Session, workspace_id: int, data: WorkspaceUpdate) -> Optional[Workspace]:
    workspace = get_workspace(db, workspace_id)
    if not workspace:
        return None
    
    if data.name is not None:
        workspace.name = data.name
    if data.is_active is not None:
        workspace.is_active = data.is_active
    
    db.commit()
    db.refresh(workspace)
    return workspace


def delete_workspace(db: Session, workspace_id: int) -> bool:
    workspace = get_workspace(db, workspace_id)
    if not workspace:
        return False
    
    workspace.is_deleted = True
    workspace.deleted_at = datetime.utcnow()
    db.commit()
    return True


# == Environment 
def create_environment(db: Session, workspace_id: int, data: EnvironmentCreate) -> Optional[Environment]:
    workspace = get_workspace(db, workspace_id)
    if not workspace:
        return None
    
    env = Environment(workspace_id=workspace_id, name=data.name)
    db.add(env)
    db.commit()
    db.refresh(env)
    return env


def get_environments(db: Session, workspace_id: int) -> List[Environment]:
    return db.query(Environment).filter(
        Environment.workspace_id == workspace_id,
        Environment.is_deleted == False
    ).all()


# == API Key 

def generate_api_key(environment_name: str) -> tuple[str, str, str]:
    """Generate API key, returns (full_key, key_hash, key_prefix)."""
    prefix = "auc_live_" if environment_name == "production" else "auc_test_"
    random_part = secrets.token_hex(24)
    full_key = f"{prefix}{random_part}"
    
    key_hash = hashlib.sha256(full_key.encode()).hexdigest()
    key_prefix = full_key[:16]
    
    return full_key, key_hash, key_prefix


def create_api_key(db: Session, workspace_id: int, data: ApiKeyCreate) -> Optional[tuple[ApiKey, str]]:
    """Create API key, returns (api_key_object, full_key)."""
    workspace = get_workspace(db, workspace_id)
    if not workspace:
        return None
    
    environment = db.query(Environment).filter(
        Environment.id == data.environment_id,
        Environment.workspace_id == workspace_id,
        Environment.is_deleted == False
    ).first()
    if not environment:
        return None
    
    full_key, key_hash, key_prefix = generate_api_key(environment.name)
    
    api_key = ApiKey(
        workspace_id=workspace_id,
        environment_id=data.environment_id,
        name=data.name,
        key_hash=key_hash,
        key_prefix=key_prefix
    )
    db.add(api_key)
    db.commit()
    db.refresh(api_key)
    
    return api_key, full_key


def get_api_keys(db: Session, workspace_id: int) -> List[ApiKey]:
    return db.query(ApiKey).filter(
        ApiKey.workspace_id == workspace_id,
        ApiKey.is_deleted == False
    ).all()


def verify_api_key(db: Session, key: str) -> Optional[ApiKey]:
    """Verify API key and return the ApiKey object if valid."""
    key_hash = hashlib.sha256(key.encode()).hexdigest()
    
    api_key = db.query(ApiKey).filter(
        ApiKey.key_hash == key_hash,
        ApiKey.is_active == True,
        ApiKey.is_deleted == False
    ).first()
    
    if api_key:
        api_key.last_used_at = datetime.utcnow()
        db.commit()
    
    return api_key


def revoke_api_key(db: Session, workspace_id: int, api_key_id: int) -> bool:
    api_key = db.query(ApiKey).filter(
        ApiKey.id == api_key_id,
        ApiKey.workspace_id == workspace_id,
        ApiKey.is_deleted == False
    ).first()
    
    if not api_key:
        return False
    
    api_key.is_active = False
    db.commit()
    return True