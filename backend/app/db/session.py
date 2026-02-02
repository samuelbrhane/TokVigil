"""
Database connection and session management.

This is similar to Django's database setup, but uses SQLAlchemy.

Django equivalent concepts:
- Engine = Django's database connection
- SessionLocal = Django's connection per request
- Base = Django's models.Model
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.core.config import settings

# Create engine (like Django's database connection)
# echo=True logs SQL queries (like Django's DEBUG SQL logging)
engine = create_engine(
    settings.database_url,
    echo=settings.debug,  # Log SQL in debug mode
    pool_pre_ping=True,   # Verify connections before using
)

# Session factory (Django handles this automatically per request)
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# Base class for models (like Django's models.Model)
Base = declarative_base()


def get_db():
    """
    Database session dependency for FastAPI.
    
    This is like Django's database connection handling,
    but explicit. FastAPI injects this into route handlers.
    
    Usage in routes:
        @router.get("/items")
        def get_items(db: Session = Depends(get_db)):
            return db.query(Item).all()
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
