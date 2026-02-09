from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from app.core.pagination import PaginatedResponse

# == Workspace 
class WorkspaceCreate(BaseModel):
    name: str


class WorkspaceUpdate(BaseModel):
    name: Optional[str] = None
    is_active: Optional[bool] = None


class WorkspaceResponse(BaseModel):
    id: int
    name: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# == Environment 

class EnvironmentCreate(BaseModel):
    name: str  # dev, staging, prod


class EnvironmentResponse(BaseModel):
    id: int
    workspace_id: int
    name: str
    is_active: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# == API Key 

class ApiKeyCreate(BaseModel):
    name: str
    environment_id: int


class ApiKeyResponse(BaseModel):
    id: int
    workspace_id: int
    environment_id: int
    name: str
    key_prefix: str
    is_active: bool
    created_at: datetime
    last_used_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class ApiKeyCreatedResponse(ApiKeyResponse):
    """Response when API key is created - includes full key (shown only once)."""
    key: str 


# == Combined Responses 

class WorkspaceDetailResponse(WorkspaceResponse):
    """Workspace with environments and api keys."""
    environments: List[EnvironmentResponse] = []
    

class PaginatedWorkspaceResponse(PaginatedResponse[WorkspaceResponse]):
    pass