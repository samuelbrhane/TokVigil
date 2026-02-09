from typing import List, Optional
from datetime import datetime

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.auth import get_api_key_auth, AuthenticatedRequest
from app.usage import services
from app.usage.schemas import *

router = APIRouter()


@router.post("", response_model=UsageLogResponse)
def log_usage(
    data: UsageLogRequest,
    auth: AuthenticatedRequest = Depends(get_api_key_auth),
    db: Session = Depends(get_db)
):
    """Log an AI call. Requires X-API-Key header."""
    record = services.log_usage(db, auth.workspace_id, auth.environment_id, data)
    return UsageLogResponse(
        id=record.id,
        request_id=record.request_id,
        recorded=True,
        message="Usage logged successfully"
    )


@router.get("/recent", response_model=List[UsageRecordResponse])
def get_recent_usage(
    auth: AuthenticatedRequest = Depends(get_api_key_auth),
    limit: int = Query(50, le=100),
    offset: int = 0,
    user_id: Optional[str] = None,
    feature: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get recent usage records. Requires X-API-Key header."""
    return services.get_recent_usage(db, auth.workspace_id, auth.environment_id, limit, offset, user_id, feature)


@router.get("/blocked", response_model=List[UsageRecordResponse])
def get_blocked_requests(
    auth: AuthenticatedRequest = Depends(get_api_key_auth),
    limit: int = Query(50, le=100),
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """Get blocked requests. Requires X-API-Key header."""
    return services.get_blocked_requests(db, auth.workspace_id, auth.environment_id, limit, offset)


@router.get("/summary", response_model=UsageSummary)
def get_usage_summary(
    auth: AuthenticatedRequest = Depends(get_api_key_auth),
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db)
):
    """Get usage summary. Requires X-API-Key header."""
    return services.get_usage_summary(db, auth.workspace_id, auth.environment_id, start_date, end_date)


@router.get("/by-user", response_model=List[UsageByGroup])
def get_usage_by_user(
    auth: AuthenticatedRequest = Depends(get_api_key_auth),
    db: Session = Depends(get_db)
):
    """Get usage grouped by user. Requires X-API-Key header."""
    return services.get_usage_by_user(db, auth.workspace_id, auth.environment_id)


@router.get("/by-feature", response_model=List[UsageByGroup])
def get_usage_by_feature(
    auth: AuthenticatedRequest = Depends(get_api_key_auth),
    db: Session = Depends(get_db)
):
    """Get usage grouped by feature. Requires X-API-Key header."""
    return services.get_usage_by_feature(db, auth.workspace_id, auth.environment_id)