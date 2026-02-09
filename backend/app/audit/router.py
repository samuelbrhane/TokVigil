from typing import Optional

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.auth import get_current_user
from app.auth.models import User
from app.workspaces.services import get_workspace
from app.audit import services
from app.audit.schemas import PaginatedAuditLogResponse

router = APIRouter()


@router.get("/{workspace_id}", response_model=PaginatedAuditLogResponse)
def get_audit_logs(
    workspace_id: int,
    current_user: User = Depends(get_current_user),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    action: Optional[str] = Query(None),
    resource_type: Optional[str] = Query(None),
    user_email: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get audit logs for a workspace."""
    workspace = get_workspace(db, workspace_id, current_user.id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return services.get_audit_logs(db, workspace_id, page, page_size, action, resource_type, user_email)