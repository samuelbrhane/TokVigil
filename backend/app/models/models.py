import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, Integer, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class Workspace(Base):
    """Workspace model for multi-tenancy."""
    
    __tablename__ = "workspaces"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False, unique=True)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    api_keys = relationship("APIKey", back_populates="workspace", cascade="all, delete-orphan")
    policies = relationship("Policy", back_populates="workspace", cascade="all, delete-orphan")
    usage_logs = relationship("UsageLog", back_populates="workspace", cascade="all, delete-orphan")


class APIKey(Base):
    """API Key model for authentication."""
    
    __tablename__ = "api_keys"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    key = Column(String, nullable=False, unique=True, index=True)
    name = Column(String, nullable=False)
    workspace_id = Column(String, ForeignKey("workspaces.id"), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_used_at = Column(DateTime, nullable=True)
    
    # Relationships
    workspace = relationship("Workspace", back_populates="api_keys")


class Policy(Base):
    """Policy model for usage control."""
    
    __tablename__ = "policies"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    workspace_id = Column(String, ForeignKey("workspaces.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    # Policy rules
    max_requests_per_hour = Column(Integer, nullable=True)
    max_tokens_per_request = Column(Integer, nullable=True)
    max_cost_per_hour = Column(Float, nullable=True)
    allowed_models = Column(JSON, nullable=True)  # List of allowed model names
    blocked_models = Column(JSON, nullable=True)  # List of blocked model names
    
    is_active = Column(Boolean, default=True)
    priority = Column(Integer, default=0)  # Higher priority policies are evaluated first
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    workspace = relationship("Workspace", back_populates="policies")


class UsageLog(Base):
    """Usage log model for tracking AI usage."""
    
    __tablename__ = "usage_logs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    workspace_id = Column(String, ForeignKey("workspaces.id"), nullable=False)
    
    # Request details
    model = Column(String, nullable=False)
    operation = Column(String, nullable=False)  # e.g., "chat.completion", "embedding"
    
    # Usage metrics
    prompt_tokens = Column(Integer, default=0)
    completion_tokens = Column(Integer, default=0)
    total_tokens = Column(Integer, default=0)
    estimated_cost = Column(Float, default=0.0)
    
    # Policy evaluation
    was_allowed = Column(Boolean, nullable=False)
    reason_code = Column(String, nullable=True)  # e.g., "rate_limit_exceeded", "model_blocked"
    policy_id = Column(String, nullable=True)  # Which policy was applied
    
    # Metadata
    request_metadata = Column(JSON, nullable=True)  # Additional request context
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    workspace = relationship("Workspace", back_populates="usage_logs")
