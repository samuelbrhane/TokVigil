from typing import List
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.auth import get_current_user
from app.auth.models import User
from app.workspaces.services import get_workspace
from app.audit import services
from app.audit.schemas import AuditLogResponse

router = APIRouter()


@router.get("/{workspace_id}", response_model=List[AuditLogResponse])
def get_audit_logs(
    workspace_id: int,
    current_user: User = Depends(get_current_user),
    limit: int = Query(50, le=100),
    offset: int = 0,
    db: Session = Depends(get_db)
):
    workspace = get_workspace(db, workspace_id, current_user.id)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return services.get_audit_logs(db, workspace_id, limit, offset)