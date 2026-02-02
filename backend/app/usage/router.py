from typing import List, Optional
from datetime import datetime

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.usage import services
from app.usage.schemas import *

router = APIRouter()


@router.post("/{workspace_id}/{environment_id}", response_model=UsageLogResponse)
def log_usage(
    workspace_id: int,
    environment_id: int,
    data: UsageLogRequest,
    db: Session = Depends(get_db)
):
    """Log an AI call. Used by SDK after completing a request."""
    record = services.log_usage(db, workspace_id, environment_id, data)
    return UsageLogResponse(
        id=record.id,
        request_id=record.request_id,
        recorded=True,
        message="Usage logged successfully"
    )


@router.get("/{workspace_id}/recent", response_model=List[UsageRecordResponse])
def get_recent_usage(
    workspace_id: int,
    limit: int = Query(50, le=100),
    offset: int = 0,
    user_id: Optional[str] = None,
    feature: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get recent usage records."""
    return services.get_recent_usage(db, workspace_id, limit, offset, user_id, feature)


@router.get("/{workspace_id}/blocked", response_model=List[UsageRecordResponse])
def get_blocked_requests(
    workspace_id: int,
    limit: int = Query(50, le=100),
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """Get blocked requests."""
    return services.get_blocked_requests(db, workspace_id, limit, offset)


@router.get("/{workspace_id}/summary", response_model=UsageSummary)
def get_usage_summary(
    workspace_id: int,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db)
):
    """Get usage summary for a workspace."""
    return services.get_usage_summary(db, workspace_id, start_date, end_date)


@router.get("/{workspace_id}/by-user", response_model=List[UsageByGroup])
def get_usage_by_user(workspace_id: int, db: Session = Depends(get_db)):
    """Get usage grouped by user."""
    return services.get_usage_by_user(db, workspace_id)


@router.get("/{workspace_id}/by-feature", response_model=List[UsageByGroup])
def get_usage_by_feature(workspace_id: int, db: Session = Depends(get_db)):
    """Get usage grouped by feature."""
    return services.get_usage_by_feature(db, workspace_id)