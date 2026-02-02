"""
Alembic migration environment.

This is like Django's migration framework, but more explicit.
Alembic detects model changes and generates migration files.

Django equivalent commands:
- alembic revision --autogenerate -m "message" = python manage.py makemigrations
- alembic upgrade head = python manage.py migrate
- alembic downgrade -1 = python manage.py migrate <app> <previous_migration>
"""

from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# Import your models' Base and settings
import sys
from pathlib import Path

# Add parent directory to path so we can import app modules
sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.core.config import settings
from app.db.session import Base

# Import all models here so Alembic can detect them
# (Like Django's INSTALLED_APPS discovers models)
from app.models import *  # noqa

# this is the Alembic Config object
config = context.config

# Override sqlalchemy.url from settings
config.set_main_option("sqlalchemy.url", settings.database_url)

# Interpret the config file for Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Add your model's MetaData object here for 'autogenerate' support
# This tells Alembic what the "target" schema should look like
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """
    Run migrations in 'offline' mode.
    
    Generates SQL without connecting to database.
    Useful for generating migration scripts to run later.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """
    Run migrations in 'online' mode.
    
    Connects to database and runs migrations directly.
    This is the normal mode when running `alembic upgrade head`.
    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
