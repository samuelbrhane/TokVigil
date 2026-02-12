from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, ConfigDict
from app.core.pagination import PaginatedResponse


class UsageLogRequest(BaseModel):
    request_id: str
    user_id: str
    plan: Optional[str] = None
    feature: Optional[str] = None
    model: str
    input_tokens: int
    output_tokens: int
    estimated_cost_usd: Optional[float] = None  
    actual_cost_usd: Optional[float] = None
    status: str = "allowed"
    reason_code: Optional[str] = None
    latency_ms: Optional[int] = None
    extra_data: Optional[dict] = None


class UsageLogResponse(BaseModel):
    id: int
    request_id: str
    recorded: bool
    message: str


class UsageRecordResponse(BaseModel):
    id: int
    workspace_id: int
    environment_id: int
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
    
    model_config = ConfigDict(from_attributes=True)


class UsageSummary(BaseModel):
    total_requests: int
    total_tokens: int
    total_cost_usd: float
    allowed_count: int
    blocked_count: int
    workspace_count: int = 0
    policy_count: int = 0
    api_key_count: int = 0


class UsageByGroup(BaseModel):
    group: str
    requests: int
    tokens: int
    cost_usd: float
    
    

class PaginatedUsageResponse(PaginatedResponse[UsageRecordResponse]):
    pass

class PaginatedUsageByGroupResponse(PaginatedResponse[UsageByGroup]):
    pass