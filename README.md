# AI Usage Control Platform

Application-level AI usage control platform with SDKs and policy engine to enforce budgets, limits, and audit logs per user, feature, and plan.

## 🌟 Overview

The AI Usage Control Platform provides a comprehensive solution for managing and controlling AI/LLM usage across your organization. It includes:

- **FastAPI Backend**: High-performance API with authentication and multi-tenant support
- **Policy Engine**: Flexible policy evaluation system with customizable rules
- **Python SDK**: Easy-to-use SDK that wraps LLM calls with automatic policy enforcement
- **Usage Tracking**: Detailed logging and analytics for all AI operations
- **Multi-tenant Support**: Workspace-based isolation for different teams or projects

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Applications                       │
│  (Your Code + AI Usage Control SDK)                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP + API Key Auth
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    FastAPI Backend                              │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   API Key    │  │   Policy     │  │    Usage     │         │
│  │     Auth     │  │   Engine     │  │   Logging    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            SQLite Database (Multi-tenant)                │  │
│  │  • Workspaces  • API Keys  • Policies  • Usage Logs    │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### Key Components

1. **Workspaces**: Multi-tenant isolation for different teams or projects
2. **API Keys**: Secure authentication tied to specific workspaces
3. **Policies**: Configurable rules for controlling AI usage:
   - Rate limits (requests per hour)
   - Token limits (per request)
   - Cost limits (per hour)
   - Model whitelists/blacklists
4. **Policy Engine**: Evaluates requests against policies before execution
5. **Usage Logs**: Comprehensive tracking of all AI operations

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- pip

### 1. Install Dependencies

```bash
# Install backend dependencies
cd backend
pip install -r requirements.txt

# Install SDK (for development)
cd ../sdk
pip install -e .
```

### 2. Start the Backend Server

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`. Visit `http://localhost:8000/docs` for interactive API documentation.

### 3. Initialize Your Workspace

Run the setup script to create a workspace, API key, and example policies:

```bash
cd examples
python setup_example.py
```

This will:
- Create a development workspace
- Generate an API key
- Create example policies (rate limits, token limits, cost controls, model restrictions)

**Important**: Save the API key shown in the output - you'll need it for the SDK!

### 4. Use the Python SDK

```python
from ai_usage_control import AIUsageControlClient, PolicyViolationException

# Initialize the client
client = AIUsageControlClient(
    api_key="your-api-key-here",
    base_url="http://localhost:8000"
)

# Option 1: Manual policy evaluation
try:
    # Check if request is allowed
    client.evaluate_policy(
        model="gpt-4",
        operation="chat.completion",
        estimated_tokens=1000
    )
    
    # Make your LLM call here...
    # response = openai.ChatCompletion.create(...)
    
    # Log the usage
    client.log_usage(
        model="gpt-4",
        operation="chat.completion",
        prompt_tokens=800,
        completion_tokens=200,
        total_tokens=1000,
        estimated_cost=0.03
    )
except PolicyViolationException as e:
    print(f"Request blocked: {e.reason_code}")

# Option 2: Automatic wrapping (recommended)
@client.wrap_llm_call(model="gpt-4", operation="chat.completion")
def call_openai(prompt):
    # Your LLM call here
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    return response

# This call will automatically:
# 1. Check policies before execution
# 2. Block if policies are violated
# 3. Log usage after execution
try:
    response = call_openai("What is the capital of France?")
except PolicyViolationException as e:
    print(f"Request blocked: {e.reason_code}")
```

## 📚 API Documentation

### Authentication

All API requests (except workspace/API key creation) require authentication via the `X-API-Key` header:

```bash
curl -H "X-API-Key: your-api-key-here" http://localhost:8000/api/v1/evaluate
```

### Core Endpoints

#### Policy Evaluation
```http
POST /api/v1/evaluate
```
Evaluate if a request should be allowed based on policies.

**Request Body:**
```json
{
  "model": "gpt-4",
  "operation": "chat.completion",
  "estimated_tokens": 1000,
  "metadata": {}
}
```

**Response:**
```json
{
  "allowed": true,
  "reason_code": null,
  "message": "All policies passed",
  "policy_id": null
}
```

**Reason Codes:**
- `rate_limit_exceeded`: Too many requests in the time window
- `token_limit_exceeded`: Request exceeds token limit
- `cost_limit_exceeded`: Cost limit exceeded
- `model_not_allowed`: Model not in whitelist
- `model_blocked`: Model in blacklist

#### Usage Logging
```http
POST /api/v1/usage-logs
```
Log usage information for an AI operation.

#### Get Usage Logs
```http
GET /api/v1/usage-logs?skip=0&limit=100
```
Retrieve usage logs for the authenticated workspace.

#### Workspace Management
```http
POST /api/v1/workspaces
GET /api/v1/workspaces
GET /api/v1/workspaces/{workspace_id}
```

#### API Key Management
```http
POST /api/v1/api-keys
GET /api/v1/api-keys?workspace_id={workspace_id}
```

#### Policy Management
```http
POST /api/v1/policies
GET /api/v1/policies?workspace_id={workspace_id}
GET /api/v1/policies/{policy_id}
PATCH /api/v1/policies/{policy_id}
DELETE /api/v1/policies/{policy_id}
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Application
APP_NAME="AI Usage Control Platform"
APP_VERSION="0.1.0"
DEBUG=False

# Database
DATABASE_URL="sqlite+aiosqlite:///./ai_usage_control.db"

# Security
API_KEY_HEADER="X-API-Key"
```

### Policy Configuration

Policies support the following rules:

- **max_requests_per_hour**: Maximum number of requests allowed per hour
- **max_tokens_per_request**: Maximum tokens allowed per request
- **max_cost_per_hour**: Maximum cost (USD) allowed per hour
- **allowed_models**: List of allowed model names (whitelist)
- **blocked_models**: List of blocked model names (blacklist)
- **priority**: Policy evaluation order (higher = evaluated first)

Policies are evaluated in order of priority (highest first). If any policy blocks a request, the request is denied.

## 📊 Usage Examples

### Example 1: Rate Limiting

```python
# Create a policy that limits to 100 requests per hour
policy = {
    "name": "Rate Limit",
    "workspace_id": "workspace-id",
    "max_requests_per_hour": 100,
    "priority": 10
}
```

### Example 2: Cost Control

```python
# Create a policy that limits hourly spend to $10
policy = {
    "name": "Cost Control",
    "workspace_id": "workspace-id",
    "max_cost_per_hour": 10.0,
    "priority": 15
}
```

### Example 3: Model Restrictions

```python
# Only allow specific models
policy = {
    "name": "Model Whitelist",
    "workspace_id": "workspace-id",
    "allowed_models": ["gpt-3.5-turbo", "gpt-4"],
    "priority": 20
}
```

## 🧪 Testing

### Running the Backend

```bash
cd backend
uvicorn app.main:app --reload
```

### Testing with Examples

```bash
# Set up a test workspace
cd examples
python setup_example.py

# Run SDK examples (update API key in the script first)
python sdk_example.py
```

### Manual API Testing

```bash
# Health check
curl http://localhost:8000/health

# Create workspace
curl -X POST http://localhost:8000/api/v1/workspaces \
  -H "Content-Type: application/json" \
  -d '{"name": "test-workspace", "description": "Test workspace"}'

# Create API key (use workspace ID from above)
curl -X POST http://localhost:8000/api/v1/api-keys \
  -H "Content-Type: application/json" \
  -d '{"name": "test-key", "workspace_id": "workspace-id-here"}'

# Evaluate policy (use API key from above)
curl -X POST http://localhost:8000/api/v1/evaluate \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key-here" \
  -d '{"model": "gpt-4", "operation": "chat.completion", "estimated_tokens": 1000}'
```

## 🔒 Security Considerations

1. **API Key Storage**: API keys are stored as plain text in the database. For production, consider hashing them.
2. **HTTPS**: Always use HTTPS in production to protect API keys in transit.
3. **Rate Limiting**: The platform provides application-level rate limiting, but consider adding infrastructure-level rate limiting as well.
4. **Database**: The default SQLite database is suitable for development. For production, use PostgreSQL or MySQL.

## 🛣️ Roadmap

- [ ] User authentication and RBAC
- [ ] Advanced policy rules (time-based, user-based)
- [ ] Real-time monitoring dashboard
- [ ] Alerting and notifications
- [ ] Support for multiple database backends
- [ ] SDKs for other languages (JavaScript, Go, etc.)
- [ ] Integration with popular LLM providers

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue on GitHub.
