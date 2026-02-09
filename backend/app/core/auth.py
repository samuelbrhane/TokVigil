from fastapi import Header, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.workspaces.services import verify_api_key
from app.workspaces.models import ApiKey, Workspace, Environment
from app.auth.services import decode_token, get_user_by_id
from app.auth.models import User
from app.core.rate_limit import check_rate_limit
from app.core.exceptions import (
    InvalidAPIKeyError,
    InvalidTokenError,
    APIKeyRevokedError,
    WorkspaceNotFoundError,
    WorkspaceInactiveError,
    EnvironmentNotFoundError,
    EnvironmentInactiveError,
    UserNotFoundError,
)


# ==================== API Key Auth (for SDK) ====================

class AuthenticatedRequest:
    def __init__(self, api_key: ApiKey, rate_limit_info: dict = None):
        self.workspace_id = api_key.workspace_id
        self.environment_id = api_key.environment_id
        self.api_key_id = api_key.id
        self.rate_limit_info = rate_limit_info


async def get_api_key_auth(
    x_api_key: str = Header(..., description="API Key for authentication"),
    db: Session = Depends(get_db)
) -> AuthenticatedRequest:
    if not x_api_key:
        raise InvalidAPIKeyError(message="Missing API key")
    
    api_key = verify_api_key(db, x_api_key)
    
    if not api_key:
        raise InvalidAPIKeyError()
    
    if not api_key.is_active:
        raise APIKeyRevokedError()
    
    workspace = db.query(Workspace).filter(
        Workspace.id == api_key.workspace_id,
        Workspace.is_deleted == False
    ).first()
    
    if not workspace:
        raise WorkspaceNotFoundError()
    
    if not workspace.is_active:
        raise WorkspaceInactiveError()
    
    environment = db.query(Environment).filter(
        Environment.id == api_key.environment_id,
        Environment.is_deleted == False
    ).first()
    
    if not environment:
        raise EnvironmentNotFoundError()
    
    if not environment.is_active:
        raise EnvironmentInactiveError()
    
    owner = db.query(User).filter(User.id == workspace.owner_id).first()
    
    rate_limit_info = check_rate_limit(api_key.id, owner.plan)
    
    return AuthenticatedRequest(api_key, rate_limit_info)


# ==================== JWT Auth (for Dashboard) ====================

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    token = credentials.credentials
    
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise InvalidTokenError()
    
    user_id = int(payload.get("sub"))
    user = get_user_by_id(db, user_id)
    
    if not user:
        raise UserNotFoundError()
    
    return user