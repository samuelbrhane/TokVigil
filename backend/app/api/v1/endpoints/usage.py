"""
Usage endpoints.

For logging AI calls and retrieving usage statistics.
SDKs call POST /usage after each LLM call to record the result.
"""

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime
from sqlalchemy.orm import Session

from app.db.session import get_db

router = APIRouter()


# Request schema for logging usage
class UsageLogRequest(BaseModel):
    """
    Request body for logging an AI call.
    
    SDK sends this after completing an LLM call.
    """
    request_id: str  # For idempotency
    user_id: str
    feature: str
    plan: Optional[str] = None
    model: str
    input_tokens: int
    output_tokens: int
    estimated_cost_usd: float
    actual_cost_usd: Optional[float] = None
    status: str  # "allowed" or "blocked"
    reason_code: Optional[str] = None
    latency_ms: Optional[int] = None
    metadata: Optional[Dict[str, Any]] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "request_id": "req_abc123",
                "user_id": "user_123",
                "feature": "chat",
                "plan": "free",
                "model": "gpt-4o-mini",
                "input_tokens": 150,
                "output_tokens": 200,
                "estimated_cost_usd": 0.002,
                "status": "allowed",
                "latency_ms": 450,
            }
        }


class UsageLogResponse(BaseModel):
    """Response after logging usage."""
    id: int
    request_id: str
    recorded: bool
    message: str


@router.post("", response_model=UsageLogResponse)
async def log_usage(
    request: UsageLogRequest,
    db: Session = Depends(get_db),
):
    """
    Log an AI call.
    
    SDKs call this after completing an LLM request to record:
    - Token usage
    - Cost
    - Latency
    - Status (allowed/blocked)
    
    Uses request_id for idempotency - duplicate requests are ignored.
    """
    # TODO: Implement actual usage logging
    # - Check for duplicate request_id
    # - Insert into usage_records table
    # - Update Redis counters
    
    return UsageLogResponse(
        id=1,
        request_id=request.request_id,
        recorded=True,
        message="Usage logged (placeholder - not yet persisted)",
    )


# Response schemas for usage queries
class UsageSummary(BaseModel):
    """Usage summary statistics."""
    total_requests: int
    total_tokens: int
    total_cost_usd: float
    period_start: datetime
    period_end: datetime


class UsageRecord(BaseModel):
    """Single usage record."""
    id: int
    request_id: str
    user_id: str
    feature: str
    model: str
    input_tokens: int
    output_tokens: int
    cost_usd: float
    status: str
    reason_code: Optional[str]
    created_at: datetime


@router.get("/summary")
async def get_usage_summary(
    group_by: Optional[str] = Query(None, description="Group by: user, feature, model, day"),
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db),
):
    """
    Get usage summary with optional grouping.
    
    Returns aggregated usage statistics.
    """
    # TODO: Implement actual aggregation query
    return {
        "message": "Usage summary - to be implemented",
        "params": {
            "group_by": group_by,
            "start_date": start_date,
            "end_date": end_date,
        }
    }


@router.get("/recent")
async def get_recent_usage(
    limit: int = Query(50, le=100),
    offset: int = 0,
    user_id: Optional[str] = None,
    feature: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """
    Get recent usage records.
    
    Returns paginated list of recent AI calls.
    """
    # TODO: Implement actual query
    return {
        "message": "Recent usage - to be implemented",
        "params": {
            "limit": limit,
            "offset": offset,
            "user_id": user_id,
            "feature": feature,
        }
    }


@router.get("/blocked")
async def get_blocked_requests(
    limit: int = Query(50, le=100),
    offset: int = 0,
    db: Session = Depends(get_db),
):
    """
    Get blocked requests with reason codes.
    
    Useful for debugging and monitoring policy enforcement.
    """
    # TODO: Implement actual query
    return {
        "message": "Blocked requests - to be implemented",
        "params": {
            "limit": limit,
            "offset": offset,
        }
    }


@router.get("/user/{user_id}")
async def get_user_usage(
    user_id: str,
    db: Session = Depends(get_db),
):
    """
    Get usage for a specific user.
    
    Returns summary and recent calls for the user.
    """
    # TODO: Implement actual query
    return {
        "message": f"User {user_id} usage - to be implemented",
    }
