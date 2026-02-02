from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.db.mixins import TimestampMixin, SoftDeleteMixin


class Workspace(Base, TimestampMixin, SoftDeleteMixin):
    """Tenant - each company/team has one workspace."""
    __tablename__ = "workspaces"
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    environments = relationship("Environment", back_populates="workspace")
    api_keys = relationship("ApiKey", back_populates="workspace")


class Environment(Base, TimestampMixin, SoftDeleteMixin):
    """Environment within a workspace - dev, staging, prod."""
    __tablename__ = "environments"
    
    id = Column(Integer, primary_key=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"), nullable=False)
    name = Column(String(50), nullable=False) 
    is_active = Column(Boolean, default=True)
    
    # Relationships
    workspace = relationship("Workspace", back_populates="environments")
    api_keys = relationship("ApiKey", back_populates="environment")


class ApiKey(Base, TimestampMixin, SoftDeleteMixin):
    """API key for SDK authentication."""
    __tablename__ = "api_keys"
    
    id = Column(Integer, primary_key=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"), nullable=False)
    environment_id = Column(Integer, ForeignKey("environments.id"), nullable=False)
    name = Column(String(255), nullable=False)  
    key_hash = Column(String(255), nullable=False, unique=True)  
    key_prefix = Column(String(20), nullable=False)  
    is_active = Column(Boolean, default=True)
    last_used_at = Column(DateTime, nullable=True)
    
    # Relationships
    workspace = relationship("Workspace", back_populates="api_keys")
    environment = relationship("Environment", back_populates="api_keys")