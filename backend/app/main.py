"""
Main FastAPI application.

This is like Django's:
- urls.py (routing)
- wsgi.py (application instance)
- middleware setup

Run with: uvicorn app.main:app --reload
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.redis import close_redis
from app.api.v1.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan events.
    
    Similar to Django's AppConfig.ready() for startup
    and custom signal handlers for shutdown.
    """
    # Startup
    print(f"Starting {settings.app_name}...")
    yield
    # Shutdown
    print("Shutting down...")
    await close_redis()


# Create FastAPI app (like Django's application = get_wsgi_application())
app = FastAPI(
    title=settings.app_name,
    description="Application-layer AI usage control platform",
    version="0.1.0",
    openapi_url=f"{settings.api_v1_prefix}/openapi.json",
    docs_url="/docs",      # Swagger UI (auto-generated!)
    redoc_url="/redoc",    # ReDoc (alternative docs)
    lifespan=lifespan,
)

# CORS middleware (like Django's corsheaders middleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include API router (like Django's include() in urls.py)
app.include_router(api_router, prefix=settings.api_v1_prefix)


# Root endpoint (health check)
@app.get("/", tags=["Health"])
async def root():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "app": settings.app_name,
        "version": "0.1.0",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Detailed health check."""
    return {
        "status": "healthy",
        "environment": settings.app_env,
        "debug": settings.debug,
    }
