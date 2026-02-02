from typing import Optional, Dict, Any, List
from pydantic import BaseModel


class EvaluateRequest(BaseModel):
    """Request from SDK before making LLM call."""
    user_id: str
    feature: Optional[str] = None
    plan: Optional[str] = None
    model: str
    input_text: Optional[str] = None
    input_tokens: Optional[int] = None
    estimated_output_tokens: Optional[int] = None
    extra_data: Optional[Dict[str, Any]] = None


class LimitState(BaseModel):
    """Current usage vs limits."""
    requests_today: int = 0
    requests_limit_daily: Optional[int] = None
    requests_this_month: int = 0
    requests_limit_monthly: Optional[int] = None
    tokens_today: int = 0
    tokens_limit_daily: Optional[int] = None
    tokens_this_month: int = 0
    tokens_limit_monthly: Optional[int] = None
    cost_today_usd: float = 0.0
    cost_limit_daily_usd: Optional[float] = None
    cost_this_month_usd: float = 0.0
    cost_limit_monthly_usd: Optional[float] = None


class EvaluateResponse(BaseModel):
    """Response telling SDK whether to proceed."""
    allowed: bool
    reason_code: str
    message: str
    limit_state: LimitState
    estimated_cost_usd: Optional[float] = None
    policy_id: Optional[int] = None