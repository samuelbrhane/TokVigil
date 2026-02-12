import secrets
import hashlib
from datetime import datetime
from typing import Optional, List

from sqlalchemy.orm import Session

from app.workspaces.models import Workspace, Environment, ApiKey
from app.workspaces.schemas import WorkspaceCreate, WorkspaceUpdate, EnvironmentCreate, ApiKeyCreate
from app.audit.services import create_audit_log


# == Workspace
def create_workspace(
    db: Session,
    data: WorkspaceCreate,
    owner_id: int,
    user_email: str = None
) -> Workspace:
    workspace = Workspace(name=data.name, owner_id=owner_id)
    db.add(workspace)
    db.commit()
    db.refresh(workspace)
    
    # Create default environments
    for env_name in ["development", "staging", "production"]:
        env = Environment(workspace_id=workspace.id, name=env_name)
        db.add(env)
    db.commit()
    
    create_audit_log(
        db=db,
        action="CREATED",
        resource_type="WORKSPACE",
        user_id=owner_id,
        user_email=user_email,
        workspace_id=workspace.id,
        resource_id=workspace.id,
        resource_name=workspace.name,
        new_values={"name": data.name}
    )
    
    return workspace


def get_workspace(db: Session, workspace_id: int, owner_id: int) -> Optional[Workspace]:
    return db.query(Workspace).filter(
        Workspace.id == workspace_id,
        Workspace.owner_id == owner_id,
        Workspace.is_deleted == False
    ).first()


def get_workspaces(
    db: Session,
    owner_id: int,
    page: int = 1,
    page_size: int = 20
) -> dict:
    query = db.query(Workspace).filter(
        Workspace.owner_id == owner_id,
        Workspace.is_deleted == False
    )
    
    total = query.count()
    total_pages = (total + page_size - 1) // page_size
    
    items = query.offset((page - 1) * page_size).limit(page_size).all()
    
    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "has_next": page < total_pages,
        "has_prev": page > 1
    }


def update_workspace(
    db: Session,
    workspace_id: int,
    owner_id: int,
    data: WorkspaceUpdate,
    user_email: str = None
) -> Optional[Workspace]:
    workspace = get_workspace(db, workspace_id, owner_id)
    if not workspace:
        return None
    
    old_values = {"name": workspace.name, "is_active": workspace.is_active}
    
    if data.name is not None:
        workspace.name = data.name
    if data.is_active is not None:
        workspace.is_active = data.is_active
    
    db.commit()
    db.refresh(workspace)
    
    create_audit_log(
        db=db,
        action="UPDATED",
        resource_type="WORKSPACE",
        user_id=owner_id,
        user_email=user_email,
        workspace_id=workspace_id,
        resource_id=workspace_id,
        resource_name=workspace.name,
        old_values=old_values,
        new_values=data.model_dump(exclude_unset=True)
    )
    
    return workspace


def delete_workspace(
    db: Session,
    workspace_id: int,
    owner_id: int,
    user_email: str = None
) -> bool:
    from app.policies.models import Policy
    
    workspace = get_workspace(db, workspace_id, owner_id)
    if not workspace:
        return False
    
    workspace_name = workspace.name
    
    # Soft delete all API keys
    db.query(ApiKey).filter(
        ApiKey.workspace_id == workspace_id,
        ApiKey.is_deleted == False
    ).update({
        ApiKey.is_deleted: True,
        ApiKey.is_active: False,
        ApiKey.deleted_at: datetime.utcnow()
    })
    
    # Soft delete all policies
    db.query(Policy).filter(
        Policy.workspace_id == workspace_id,
        Policy.is_deleted == False
    ).update({
        Policy.is_deleted: True,
        Policy.is_active: False,
        Policy.deleted_at: datetime.utcnow()
    })
    
    # Soft delete all environments
    db.query(Environment).filter(
        Environment.workspace_id == workspace_id,
        Environment.is_deleted == False
    ).update({
        Environment.is_deleted: True,
        Environment.is_active: False,
        Environment.deleted_at: datetime.utcnow()
    })
    
    # Soft delete workspace
    workspace.is_deleted = True
    workspace.is_active = False
    workspace.deleted_at = datetime.utcnow()
    db.commit()
    
    create_audit_log(
        db=db,
        action="DELETED",
        resource_type="WORKSPACE",
        user_id=owner_id,
        user_email=user_email,
        workspace_id=workspace_id,
        resource_id=workspace_id,
        resource_name=workspace_name
    )
    
    return True


# == Environment
def create_environment(
    db: Session,
    workspace_id: int,
    data: EnvironmentCreate,
    user_id: int = None,
    user_email: str = None
) -> Environment:
    env = Environment(workspace_id=workspace_id, name=data.name)
    db.add(env)
    db.commit()
    db.refresh(env)
    
    create_audit_log(
        db=db,
        action="CREATED",
        resource_type="ENVIRONMENT",
        user_id=user_id,
        user_email=user_email,
        workspace_id=workspace_id,
        resource_id=env.id,
        resource_name=env.name,
        new_values={"name": data.name}
    )
    
    return env


def get_environments(db: Session, workspace_id: int) -> List[Environment]:
    return db.query(Environment).filter(
        Environment.workspace_id == workspace_id,
        Environment.is_deleted == False
    ).all()


# == API Key
def generate_api_key(environment_name: str) -> tuple[str, str, str]:
    prefix = "tf_live_" if environment_name == "production" else "tf_test_"
    random_part = secrets.token_hex(24)
    full_key = f"{prefix}{random_part}"
    
    key_hash = hashlib.sha256(full_key.encode()).hexdigest()
    key_prefix = full_key[:16]
    
    return full_key, key_hash, key_prefix


def create_api_key(
    db: Session,
    workspace_id: int,
    data: ApiKeyCreate,
    user_id: int = None,
    user_email: str = None
) -> Optional[tuple[ApiKey, str]]:
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
    
    create_audit_log(
        db=db,
        action="CREATED",
        resource_type="API_KEY",
        user_id=user_id,
        user_email=user_email,
        workspace_id=workspace_id,
        resource_id=api_key.id,
        resource_name=api_key.name,
        new_values={"name": data.name, "environment_id": data.environment_id, "key_prefix": key_prefix}
    )
    
    return api_key, full_key


def get_api_keys(
    db: Session,
    workspace_id: int,
    page: int = 1,
    page_size: int = 20
) -> dict:
    query = db.query(ApiKey).filter(
        ApiKey.workspace_id == workspace_id,
        ApiKey.is_deleted == False,
        ApiKey.is_active == True
    ).order_by(ApiKey.created_at.desc())
    
    total = query.count()
    total_pages = (total + page_size - 1) // page_size
    
    items = query.offset((page - 1) * page_size).limit(page_size).all()
    
    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "has_next": page < total_pages,
        "has_prev": page > 1
    }


def verify_api_key(db: Session, key: str) -> Optional[ApiKey]:
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


def revoke_api_key(
    db: Session,
    workspace_id: int,
    api_key_id: int,
    user_id: int = None,
    user_email: str = None
) -> bool:
    api_key = db.query(ApiKey).filter(
        ApiKey.id == api_key_id,
        ApiKey.workspace_id == workspace_id,
        ApiKey.is_deleted == False
    ).first()
    
    if not api_key:
        return False
    
    api_key_name = api_key.name
    api_key.is_active = False
    db.commit()
    
    create_audit_log(
        db=db,
        action="REVOKED",
        resource_type="API_KEY",
        user_id=user_id,
        user_email=user_email,
        workspace_id=workspace_id,
        resource_id=api_key_id,
        resource_name=api_key_name
    )
    
    return True