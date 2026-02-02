from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""
    
    # Application
    app_name: str = "AI Usage Control Platform"
    app_version: str = "0.1.0"
    debug: bool = False
    
    # Database
    database_url: str = "sqlite+aiosqlite:///./ai_usage_control.db"
    
    # Security
    api_key_header: str = "X-API-Key"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
