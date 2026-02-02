from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON

from app.db.session import Base
from app.db.mixins import TimestampMixin


class UsageRecord(Base, TimestampMixin):
    """Log of every AI call."""
    __tablename__ = "usage_records"
    
    id = Column(Integer, primary_key=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"), nullable=False)
    environment_id = Column(Integer, ForeignKey("environments.id"), nullable=False)
    
    # Request identification
    request_id = Column(String(255), unique=True, nullable=False)
    
    # Who made the request
    user_id = Column(String(255), nullable=False)
    plan = Column(String(50), nullable=True)
    feature = Column(String(50), nullable=True)
    
    # Model info
    model = Column(String(100), nullable=False)
    
    # Token usage
    input_tokens = Column(Integer, nullable=False)
    output_tokens = Column(Integer, nullable=False)
    total_tokens = Column(Integer, nullable=False)
    
    # Cost
    estimated_cost_usd = Column(Float, nullable=False)
    actual_cost_usd = Column(Float, nullable=True)
    
    # Status
    status = Column(String(20), nullable=False)  # allowed, blocked
    reason_code = Column(String(100), nullable=True)  
    
    # Performance
    latency_ms = Column(Integer, nullable=True)
    
    # Extra data
    extra_data = Column(JSON, nullable=True)