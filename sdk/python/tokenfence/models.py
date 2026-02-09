from typing import Optional, List, Dict, Any
from dataclasses import dataclass
from datetime import datetime


@dataclass
class LimitState:
    """Current usage state against limits."""
    requests_today: Optional[int] = None
    requests_limit_daily: Optional[int] = None
    requests_this_month: Optional[int] = None
    requests_limit_monthly: Optional[int] = None
    tokens_today: Optional[int] = None
    tokens_limit_daily: Optional[int] = None
    tokens_this_month: Optional[int] = None
    tokens_limit_monthly: Optional[int] = None
    cost_today_usd: Optional[float] = None
    cost_limit_daily_usd: Optional[float] = None
    cost_this_month_usd: Optional[float] = None
    cost_limit_monthly_usd: Optional[float] = None


@dataclass
class EvaluateResult:
    """Result from evaluate endpoint."""
    allowed: bool
    reason_code: str
    message: str
    limit_state: Optional[LimitState] = None
    estimated_cost_usd: Optional[float] = None
    policy_id: Optional[int] = None
    
    @classmethod
    def from_dict(cls, data: dict) -> "EvaluateResult":
        limit_state = None
        if data.get("limit_state"):
            limit_state = LimitState(**data["limit_state"])
        
        return cls(
            allowed=data["allowed"],
            reason_code=data["reason_code"],
            message=data["message"],
            limit_state=limit_state,
            estimated_cost_usd=data.get("estimated_cost_usd"),
            policy_id=data.get("policy_id")
        )


@dataclass
class UsageLogResult:
    """Result from logging usage."""
    id: int
    request_id: str
    recorded: bool
    message: str
    
    @classmethod
    def from_dict(cls, data: dict) -> "UsageLogResult":
        return cls(
            id=data["id"],
            request_id=data["request_id"],
            recorded=data["recorded"],
            message=data["message"]
        )


@dataclass
class UsageRecord:
    """Single usage record."""
    id: int
    request_id: str
    user_id: str
    plan: Optional[str]
    feature: Optional[str]
    model: str
    input_tokens: int
    output_tokens: int
    total_tokens: int
    estimated_cost_usd: float
    actual_cost_usd: Optional[float]
    status: str
    reason_code: Optional[str]
    latency_ms: Optional[int]
    created_at: datetime
    
    @classmethod
    def from_dict(cls, data: dict) -> "UsageRecord":
        return cls(
            id=data["id"],
            request_id=data["request_id"],
            user_id=data["user_id"],
            plan=data.get("plan"),
            feature=data.get("feature"),
            model=data["model"],
            input_tokens=data["input_tokens"],
            output_tokens=data["output_tokens"],
            total_tokens=data["total_tokens"],
            estimated_cost_usd=data["estimated_cost_usd"],
            actual_cost_usd=data.get("actual_cost_usd"),
            status=data["status"],
            reason_code=data.get("reason_code"),
            latency_ms=data.get("latency_ms"),
            created_at=datetime.fromisoformat(data["created_at"].replace("Z", "+00:00"))
        )


@dataclass
class UsageSummary:
    """Usage summary statistics."""
    total_requests: int
    total_tokens: int
    total_cost_usd: float
    allowed_count: int
    blocked_count: int
    
    @classmethod
    def from_dict(cls, data: dict) -> "UsageSummary":
        return cls(
            total_requests=data["total_requests"],
            total_tokens=data["total_tokens"],
            total_cost_usd=data["total_cost_usd"],
            allowed_count=data["allowed_count"],
            blocked_count=data["blocked_count"]
        )


@dataclass
class UsageByGroup:
    """Usage grouped by user or feature."""
    group: str
    requests: int
    tokens: int
    cost_usd: float
    
    @classmethod
    def from_dict(cls, data: dict) -> "UsageByGroup":
        return cls(
            group=data["group"],
            requests=data["requests"],
            tokens=data["tokens"],
            cost_usd=data["cost_usd"]
        )


@dataclass
class PaginatedResponse:
    """Paginated API response."""
    items: List[Any]
    total: int
    page: int
    page_size: int
    total_pages: int
    has_next: bool
    has_prev: bool