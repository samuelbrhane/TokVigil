"""
Evaluate endpoint.

This is the CORE endpoint that SDKs call before making LLM requests.
It evaluates policies and returns allow/block decisions.

Flow:
1. SDK calls POST /evaluate with request details
2. API finds matching policy
3. API checks limits, budgets, model rules
4. API returns decision (allow/block) with reason code
"""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session

from app.db.session import get_db

router = APIRouter()


# Request schema (Pydantic = like Django serializers)
class EvaluateRequest(BaseModel):
    """
    Request body for policy evaluation.
    
    SDK sends this before making an LLM call.
    """
    user_id: str
    feature: str
    plan: Optional[str] = None
    model: str
    input_text: Optional[str] = None
    input_tokens: Optional[int] = None
    estimated_output_tokens: Optional[int] = None
    metadata: Optional[Dict[str, Any]] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user_123",
                "feature": "chat",
                "plan": "free",
                "model": "gpt-4o-mini",
                "input_text": "Hello, how are you?",
                "estimated_output_tokens": 500,
            }
        }


# Response schema
class LimitState(BaseModel):
    """Current usage vs limits."""
    requests_today: int = 0
    requests_limit_daily: Optional[int] = None
    requests_this_month: int = 0
    requests_limit_monthly: Optional[int] = None
    cost_today_usd: float = 0.0
    cost_limit_daily_usd: Optional[float] = None
    cost_this_month_usd: float = 0.0
    cost_limit_monthly_usd: Optional[float] = None


class EvaluateResponse(BaseModel):
    """
    Response from policy evaluation.
    
    SDK checks 'allowed' to decide whether to proceed.
    """
    allowed: bool
    reason_code: str
    message: str
    limit_state: LimitState
    estimated_cost_usd: Optional[float] = None
    policy_id: Optional[int] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "allowed": True,
                "reason_code": "ALLOWED",
                "message": "Request allowed",
                "limit_state": {
                    "requests_today": 12,
                    "requests_limit_daily": 50,
                    "cost_today_usd": 0.15,
                    "cost_limit_daily_usd": 1.00,
                },
                "estimated_cost_usd": 0.002,
                "policy_id": 1,
            }
        }


@router.post("", response_model=EvaluateResponse)
async def evaluate(
    request: EvaluateRequest,
    db: Session = Depends(get_db),
):
    """
    Evaluate policy for an AI request.
    
    This is the main endpoint SDKs call before making LLM requests.
    Returns whether the request is allowed or blocked.
    
    **Flow:**
    1. Resolve applicable policy (by plan, feature, user)
    2. Estimate cost if not provided
    3. Check all limits and rules
    4. Return decision with reason code
    
    **Reason codes:**
    - ALLOWED - Request is allowed
    - MODEL_NOT_ALLOWED - Model not in allowed list
    - PER_REQUEST_COST_EXCEEDED - Single request too expensive
    - DAILY_REQUEST_LIMIT_EXCEEDED - Daily cap hit
    - MONTHLY_REQUEST_LIMIT_EXCEEDED - Monthly cap hit
    - DAILY_BUDGET_EXCEEDED - Daily spend limit hit
    - MONTHLY_BUDGET_EXCEEDED - Monthly spend limit hit
    """
    # TODO: Implement actual policy evaluation
    # For now, return placeholder response
    
    return EvaluateResponse(
        allowed=True,
        reason_code="ALLOWED",
        message="Request allowed (placeholder - policy evaluation not yet implemented)",
        limit_state=LimitState(
            requests_today=0,
            requests_limit_daily=50,
            cost_today_usd=0.0,
            cost_limit_daily_usd=1.0,
        ),
        estimated_cost_usd=0.002,
        policy_id=None,
    )
