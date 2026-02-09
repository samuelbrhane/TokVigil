from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from app.core.pagination import PaginatedResponse

class PolicyCreate(BaseModel):
    name: str
    plan: Optional[str] = None
    feature: Optional[str] = None
    user_id: Optional[str] = None
    requests_per_day: Optional[int] = None
    requests_per_month: Optional[int] = None
    tokens_per_day: Optional[int] = None
    tokens_per_month: Optional[int] = None
    budget_per_day_usd: Optional[float] = None
    budget_per_month_usd: Optional[float] = None
    max_cost_per_request_usd: Optional[float] = None
    allowed_models: Optional[List[str]] = None
    priority: int = 0


class PolicyUpdate(BaseModel):
    name: Optional[str] = None
    plan: Optional[str] = None
    feature: Optional[str] = None
    user_id: Optional[str] = None
    requests_per_day: Optional[int] = None
    requests_per_month: Optional[int] = None
    tokens_per_day: Optional[int] = None
    tokens_per_month: Optional[int] = None
    budget_per_day_usd: Optional[float] = None
    budget_per_month_usd: Optional[float] = None
    max_cost_per_request_usd: Optional[float] = None
    allowed_models: Optional[List[str]] = None
    priority: Optional[int] = None
    is_active: Optional[bool] = None


class PolicyResponse(BaseModel):
    id: int
    workspace_id: int
    name: str
    plan: Optional[str]
    feature: Optional[str]
    user_id: Optional[str]
    requests_per_day: Optional[int]
    requests_per_month: Optional[int]
    tokens_per_day: Optional[int]
    tokens_per_month: Optional[int]
    budget_per_day_usd: Optional[float]
    budget_per_month_usd: Optional[float]
    max_cost_per_request_usd: Optional[float]
    allowed_models: Optional[List[str]]
    priority: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
    

class PaginatedPolicyResponse(PaginatedResponse[PolicyResponse]):
    pass