# TokVigil

## Application-Layer AI Usage Control Platform

TokVigil is a production-ready application-layer control plane that enforces limits, budgets, and governance policies for AI usage directly inside application code.

It ensures consistent enforcement of business rules across users, features, plans, and environments without relying on infrastructure-level proxies.

---

## Why TokVigil Exists

When AI is embedded inside real products, teams quickly face:

- Free-tier abuse and uncontrolled cost spikes
- No per-user or per-feature visibility
- Duplicated “guardrail” logic across services
- Inconsistent enforcement between dev, staging, and production
- No audit trail for AI usage decisions

Infrastructure-level tools (gateways, proxies, rate limiters) cannot reliably enforce business logic.

TokVigil solves this at the application layer.

---

## How Developers Use It

Developers integrate via SDK:

```python
response = client.chat(
    user_id="user_123",
    feature="chat",
    model="gpt-4o-mini",
    messages=[...]
)
```

Behind the scenes:

1. `POST /evaluate` → Policy resolution and enforcement
2. LLM provider call (OpenAI, etc.)
3. `POST /usage` → Usage logging and cost tracking

**1 AI request = 1 evaluate + 1 usage log**

Enforcement decisions include structured reason codes and limit states.

---

## Core Capabilities

### Enforcement & Governance

- Per-user request limits
- Per-plan budgets (Free / Pro / Enterprise)
- Per-feature enforcement (chat vs summarize vs extraction)
- Per-request cost caps
- Token limits (daily/monthly)
- Model allow/deny lists
- Environment isolation (dev / staging / prod)
- Redis-backed counters for real-time enforcement
- Deterministic reason codes for all decisions
- Audit logging of policy and API key changes
- Graceful degradation modes (fail-open or fail-closed)

### SDK Integration

- Python SDK
- TypeScript SDK
- Automatic token counting and cost estimation
- Structured enforcement exceptions (`AIUsageBlockedError`)
- Idempotent usage logging
- BYOK (Bring Your Own Key) support

### Developer Tooling (VS Code Extension)

- In-editor usage visibility
- Blocked request inspection with reason codes
- Policy viewer inside VS Code
- Usage meter (requests / tokens / budget)
- Quick config snippet generation
- Workspace and environment switching
- Real-time governance without leaving the editor

### Analytics & Visibility

- Usage tracking per user / feature / model
- Budget consumption tracking
- Limit state reporting
- Monthly plan enforcement

---

## Enforcement Philosophy

TokVigil is built around four principles:

### 1. Application-Layer Control

Enforcement happens inside application code via SDK integration not at network level.

### 2. Policy Specificity Resolution

Policies resolve in order of specificity:

```
User > Feature > Plan > Default
```

If multiple match, priority determines resolution.

### 3. Deterministic Enforcement

Every decision returns:

- allowed / blocked
- reason_code
- limit_state
- retry_after (if applicable)

## System Architecture

![Architecture Diagram](infrastructure/diagrams/architecture.gif)

### High-Level Flow

Application → SDK → TokVigil API → Policy Engine  
→ Decision → LLM Provider → Usage Logging → Redis + PostgreSQL

---

## Platform Demo

![Platform Demo](demo.gif)

---

## Repository Structure

```
.
├── backend/
│   ├── alembic/
│   ├── app/
│   ├── tests/
│   ├── Dockerfile
│   ├── Makefile
│   ├── pyproject.toml
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
│
├── sdk/
│   ├── python/
│   └── typescript/
│
├── vscode-extension/
│
├── infrastructure/
│   ├── docker/
│   │   ├── api.Dockerfile
│   │   ├── worker.Dockerfile
│   │   └── docker-compose.yml
│   │
│   ├── environments/
│   │   ├── dev.env
│   │   ├── staging.env
│   │   └── prod.env
│   │
│   ├── terraform/
│   │   ├── modules/
│   │   ├── api.tf
│   │   ├── redis.tf
│   │   ├── postgres.tf
│   │   ├── networking.tf
│   │   └── variables.tf
│   │
│   ├── k8s/
│   │   ├── api-deployment.yaml
│   │   ├── redis.yaml
│   │   └── ingress.yaml
│   │
│   └── diagrams/
│       └── architecture.gif
│
├── demo.gif
├── LICENSE
└── README.md
```

---

## Tech Stack

**Core API**

- FastAPI
- PostgreSQL
- Redis
- SQLAlchemy
- Alembic

**SDKs**

- Python
- TypeScript
- Automatic token counting
- Cost estimation
- Reason-code exceptions

**Developer Tooling**

- VS Code Extension (TypeScript)

**Frontend**

- Next.js
- Tailwind CSS

---

## Key Design Decisions

- Redis caching for real-time counters
- Idempotent usage logging
- Rate limiting per API key
- Consistent structured error codes
- Multi-tenant isolation
- Environment-scoped API keys
- Token-based cost estimation using model pricing tables

---

## License

MIT
