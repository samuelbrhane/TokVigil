from typing import Optional
from datetime import datetime

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.auth import get_current_user
from app.auth.models import User
from app.workspaces.services import get_workspace
from app.core.exceptions import WorkspaceNotFoundError
from app.usage import services
from app.usage.schemas import *

router = APIRouter()


@router.get("/{workspace_id}/{environment_id}/recent", response_model=PaginatedUsageResponse)
def get_recent_usage(
    workspace_id: int,
    environment_id: int,
    current_user: User = Depends(get_current_user),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    user_id: Optional[str] = Query(None),
    feature: Optional[str] = Query(None),
    model: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    workspace = get_workspace(db, workspace_id, current_user.id)
    if not workspace:
        raise WorkspaceNotFoundError()
    return services.get_recent_usage(
        db, workspace_id, environment_id,
        page, page_size, user_id, feature, model, status
    )


@router.get("/{workspace_id}/{environment_id}/blocked", response_model=PaginatedUsageResponse)
def get_blocked_requests(
    workspace_id: int,
    environment_id: int,
    current_user: User = Depends(get_current_user),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    workspace = get_workspace(db, workspace_id, current_user.id)
    if not workspace:
        raise WorkspaceNotFoundError()
    return services.get_blocked_requests(db, workspace_id, environment_id, page, page_size)


@router.get("/{workspace_id}/{environment_id}/by-user", response_model=PaginatedUsageByGroupResponse)
def get_usage_by_user(
    workspace_id: int,
    environment_id: int,
    current_user: User = Depends(get_current_user),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    workspace = get_workspace(db, workspace_id, current_user.id)
    if not workspace:
        raise WorkspaceNotFoundError()
    return services.get_usage_by_user(db, workspace_id, environment_id, page, page_size)


@router.get("/{workspace_id}/{environment_id}/by-feature", response_model=PaginatedUsageByGroupResponse)
def get_usage_by_feature(
    workspace_id: int,
    environment_id: int,
    current_user: User = Depends(get_current_user),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    workspace = get_workspace(db, workspace_id, current_user.id)
    if not workspace:
        raise WorkspaceNotFoundError()
    return services.get_usage_by_feature(db, workspace_id, environment_id, page, page_size)


@router.get("/{workspace_id}/{environment_id}/summary", response_model=UsageSummary)
def get_usage_summary(
    workspace_id: int,
    environment_id: int,
    current_user: User = Depends(get_current_user),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    db: Session = Depends(get_db)
):
    workspace = get_workspace(db, workspace_id, current_user.id)
    if not workspace:
        raise WorkspaceNotFoundError()
    return services.get_usage_summary(db, workspace_id, environment_id, start_date, end_date)