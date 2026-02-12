# UsageSentinel Backend

FastAPI backend for the UsageSentinel platform.

## Tech

- FastAPI
- SQLAlchemy
- PostgreSQL
- Redis
- Alembic (migrations)

## Setup

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

API runs at [http://localhost:8000](http://localhost:8000).

## Environment Variables

```
DATABASE_URL=postgresql://user:pass@localhost:5432/tokenfence
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key
```

## Scripts

```bash
uvicorn app.main:app --reload          # Development server
alembic revision --autogenerate -m ""  # Generate migration
alembic upgrade head                   # Run migrations
```
