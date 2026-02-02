from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.db.mixins import TimestampMixin, SoftDeleteMixin


class Policy(Base, TimestampMixin, SoftDeleteMixin):
    """Rules for AI usage limits, budgets, and allowed models."""
    __tablename__ = "policies"
    
    id = Column(Integer, primary_key=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"), nullable=False)
    name = Column(String(255), nullable=False)
    
    # Scope
    plan = Column(String(50), nullable=True)  
    feature = Column(String(50), nullable=True)  
    user_id = Column(String(255), nullable=True)  
    
    # Request limits
    requests_per_day = Column(Integer, nullable=True)
    requests_per_month = Column(Integer, nullable=True)
    
    # Token limits
    tokens_per_day = Column(Integer, nullable=True)
    tokens_per_month = Column(Integer, nullable=True)
    
    # Budget limits (USD)
    budget_per_day_usd = Column(Float, nullable=True)
    budget_per_month_usd = Column(Float, nullable=True)
    max_cost_per_request_usd = Column(Float, nullable=True)
    
    # Model restrictions
    allowed_models = Column(JSON, nullable=True) 
    
    # Priority - higher wins when multiple policies match
    priority = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    workspace = relationship("Workspace")