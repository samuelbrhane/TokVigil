from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


# Workspace schemas
class WorkspaceBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    is_active: bool = True


class WorkspaceCreate(WorkspaceBase):
    pass


class WorkspaceResponse(WorkspaceBase):
    id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# API Key schemas
class APIKeyCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    workspace_id: str


class APIKeyResponse(BaseModel):
    id: str
    key: str
    name: str
    workspace_id: str
    is_active: bool
    created_at: datetime
    last_used_at: Optional[datetime]
    
    class Config:
        from_attributes = True


# Policy schemas
class PolicyBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    max_requests_per_hour: Optional[int] = Field(None, ge=0)
    max_tokens_per_request: Optional[int] = Field(None, ge=0)
    max_cost_per_hour: Optional[float] = Field(None, ge=0.0)
    allowed_models: Optional[List[str]] = None
    blocked_models: Optional[List[str]] = None
    is_active: bool = True
    priority: int = Field(0, ge=0)


class PolicyCreate(PolicyBase):
    workspace_id: str


class PolicyUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    max_requests_per_hour: Optional[int] = Field(None, ge=0)
    max_tokens_per_request: Optional[int] = Field(None, ge=0)
    max_cost_per_hour: Optional[float] = Field(None, ge=0.0)
    allowed_models: Optional[List[str]] = None
    blocked_models: Optional[List[str]] = None
    is_active: Optional[bool] = None
    priority: Optional[int] = Field(None, ge=0)


class PolicyResponse(PolicyBase):
    id: str
    workspace_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Policy evaluation schemas
class PolicyEvaluationRequest(BaseModel):
    workspace_id: str
    model: str
    operation: str = "chat.completion"
    estimated_tokens: Optional[int] = None
    metadata: Optional[Dict[str, Any]] = None


class PolicyEvaluationResponse(BaseModel):
    allowed: bool
    reason_code: Optional[str] = None
    message: Optional[str] = None
    policy_id: Optional[str] = None


# Usage log schemas
class UsageLogCreate(BaseModel):
    workspace_id: str
    model: str
    operation: str
    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_tokens: int = 0
    estimated_cost: float = 0.0
    was_allowed: bool
    reason_code: Optional[str] = None
    policy_id: Optional[str] = None
    request_metadata: Optional[Dict[str, Any]] = None


class UsageLogResponse(BaseModel):
    id: str
    workspace_id: str
    model: str
    operation: str
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int
    estimated_cost: float
    was_allowed: bool
    reason_code: Optional[str]
    policy_id: Optional[str]
    request_metadata: Optional[Dict[str, Any]]
    created_at: datetime
    
    class Config:
        from_attributes = True
