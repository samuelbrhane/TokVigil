from fastapi import Header, HTTPException, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.workspaces.services import verify_api_key
from app.workspaces.models import ApiKey


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
    """
    Dependency that validates API key from header.
    """
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