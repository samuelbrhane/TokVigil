# AI Usage Control Platform

Application-layer control plane for AI usage enforcement — limits, budgets, and policies per user/feature/plan.

## Project Structure

```
ai-usage-control/
├── backend/                 # FastAPI core API
│   ├── app/
│   │   ├── api/v1/         # API routes
│   │   ├── core/           # Config, security, dependencies
│   │   ├── db/             # Database connection, session
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   └── services/       # Business logic
│   ├── alembic/            # Database migrations
│   └── tests/
├── frontend/               # Next.js dashboard (later)
├── sdk/
│   ├── python/             # Python SDK
│   └── typescript/         # TypeScript SDK
├── vscode-extension/       # VS Code extension
├── infrastructure/
│   ├── docker/             # Docker configs
│   └── k8s/                # Kubernetes manifests (optional)
└── docs/                   # Documentation
```

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # Edit with your values
alembic upgrade head      # Run migrations
uvicorn app.main:app --reload
```

API docs: http://localhost:8000/docs

## Tech Stack

- **Backend:** FastAPI, PostgreSQL, Redis, SQLAlchemy, Alembic
- **SDKs:** Python, TypeScript
- **Frontend:** Next.js, Tailwind CSS
- **VS Code Extension:** TypeScript

## License

MIT
