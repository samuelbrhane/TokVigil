from fastapi import Security, HTTPException, status, Depends
from fastapi.security import APIKeyHeader
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from app.core.config import settings
from app.core.database import get_db
from app.models.models import APIKey, Workspace


api_key_header = APIKeyHeader(name=settings.api_key_header, auto_error=False)


async def get_api_key(
    api_key: str = Security(api_key_header),
    db: AsyncSession = Depends(get_db),
) -> APIKey:
    """
    Validate API key and return the associated API key object.
    """
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing API key",
        )
    
    # Query for the API key
    result = await db.execute(
        select(APIKey).where(APIKey.key == api_key, APIKey.is_active == True)
    )
    db_api_key = result.scalar_one_or_none()
    
    if not db_api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or inactive API key",
        )
    
    # Update last used timestamp
    db_api_key.last_used_at = datetime.utcnow()
    await db.commit()
    
    return db_api_key


async def get_current_workspace(
    api_key: APIKey = Depends(get_api_key),
    db: AsyncSession = Depends(get_db),
) -> Workspace:
    """
    Get the workspace associated with the current API key.
    """
    result = await db.execute(
        select(Workspace).where(
            Workspace.id == api_key.workspace_id,
            Workspace.is_active == True
        )
    )
    workspace = result.scalar_one_or_none()
    
    if not workspace:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Workspace not found or inactive",
        )
    
    return workspace
