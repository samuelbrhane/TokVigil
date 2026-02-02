"""
Application configuration using Pydantic Settings.
"""

from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    """
    
    # Application
    app_name: str = "AI Usage Control"
    app_env: str = "development"
    debug: bool = False
    secret_key: str
    
    # API
    api_v1_prefix: str = "/api/v1"
    
    # Database
    database_url: str
    
    # Redis 
    redis_url: str = "redis://localhost:6379/0"
    
    # CORS
    cors_origins: str = "http://localhost:3000"
    
    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]
    
    # JWT Token settings
    access_token_expire_minutes: int = 30
    algorithm: str = "HS256"
    
    # Rate limiting
    rate_limit_evaluate_per_minute: int = 1000
    rate_limit_usage_per_minute: int = 1000
    
    # Pydantic settings config
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


@lru_cache
def get_settings() -> Settings:
    """
    Get cached settings instance.
    """
    return Settings()


# Quick access
settings = get_settings()
