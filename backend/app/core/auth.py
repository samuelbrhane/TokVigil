from fastapi import Header, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.workspaces.services import verify_api_key
from app.workspaces.models import ApiKey
from app.auth.services import decode_token, get_user_by_id
from app.auth.models import User


# == API Key Auth (for SDK) 
class AuthenticatedRequest:
    """Contains workspace and environment info from API key."""
    def __init__(self, api_key: ApiKey):
        self.workspace_id = api_key.workspace_id
        self.environment_id = api_key.environment_id
        self.api_key_id = api_key.id


async def get_api_key_auth(
    x_api_key: str = Header(..., description="API Key for authentication"),
    db: Session = Depends(get_db)
) -> AuthenticatedRequest:
    """Validates API key from header. Used by SDK endpoints."""
    if not x_api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing API key"
        )
    
    api_key = verify_api_key(db, x_api_key)
    
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key"
        )
    
    return AuthenticatedRequest(api_key)


# == JWT Auth (for Dashboard) 

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Validates JWT token from Authorization header. Used by dashboard endpoints."""
    token = credentials.credentials
    
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    user_id = int(payload.get("sub"))
    user = get_user_by_id(db, user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return user