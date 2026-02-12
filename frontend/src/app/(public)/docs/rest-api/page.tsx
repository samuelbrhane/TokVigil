"use client";

import DocHeader from "@/components/docs/DocHeader";
import DocTableOfContents from "@/components/docs/DocTableOfContents";
import DocSection from "@/components/docs/DocSection";
import DocNote from "@/components/docs/DocNote";
import DocTable from "@/components/docs/DocTable";

const TOC = [
  { id: "authentication", title: "Authentication" },
  { id: "base-url", title: "Base URL" },
  { id: "evaluate", title: "Evaluate Request" },
  { id: "log-usage", title: "Log Usage" },
  { id: "usage-summary", title: "Usage Summary" },
  { id: "recent-usage", title: "Recent Usage" },
  { id: "blocked-requests", title: "Blocked Requests" },
  { id: "usage-by-user", title: "Usage by User" },
  { id: "usage-by-feature", title: "Usage by Feature" },
  { id: "errors", title: "Error Handling" },
  { id: "reason-codes", title: "Reason Codes" },
];

const CODE_AUTH = `# All SDK endpoints require your API key in the X-API-Key header
curl https://api.tokenfence.io/gateway/evaluate \\
  -H "X-API-Key: tf_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{"user_id": "user_123", "model": "gpt-4o-mini"}'`;

const CODE_EVALUATE = `# POST /gateway/evaluate
curl -X POST https://api.tokenfence.io/gateway/evaluate \\
  -H "X-API-Key: tf_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "user_id": "user_123",
    "model": "gpt-4o-mini",
    "feature": "chat",
    "input_tokens": 100
  }'

# Response (200 OK)
{
  "allowed": true,
  "reason_code": "ALLOWED",
  "message": "Request allowed",
  "estimated_cost_usd": 0.00015,
  "limit_state": {
    "requests_today": 42,
    "requests_limit_daily": 1000,
    "requests_this_month": 520,
    "requests_limit_monthly": null,
    "cost_today_usd": 0.85,
    "cost_limit_daily_usd": 10.0
  }
}`;

const CODE_LOG = `# POST /usage
curl -X POST https://api.tokenfence.io/usage \\
  -H "X-API-Key: tf_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "request_id": "req_abc123",
    "user_id": "user_123",
    "model": "gpt-4o-mini",
    "input_tokens": 100,
    "output_tokens": 50,
    "status": "allowed",
    "feature": "chat",
    "latency_ms": 350
  }'

# Response (200 OK)
{
  "id": 1,
  "request_id": "req_abc123",
  "recorded": true,
  "message": "Usage logged successfully"
}`;

const CODE_SUMMARY = `# GET /usage/summary
curl https://api.tokenfence.io/usage/summary \\
  -H "X-API-Key: tf_live_..."

# Optional query params: ?start_date=2025-01-01T00:00:00Z&end_date=2025-01-31T23:59:59Z

# Response (200 OK)
{
  "total_requests": 1250,
  "total_tokens": 485000,
  "total_cost_usd": 12.50,
  "allowed_count": 1200,
  "blocked_count": 50
}`;

const CODE_RECENT = `# GET /usage/recent
curl "https://api.tokenfence.io/usage/recent?page=1&page_size=20" \\
  -H "X-API-Key: tf_live_..."

# Optional filters: ?user_id=user_123&feature=chat&model=gpt-4o-mini&status=allowed

# Response (200 OK)
{
  "items": [
    {
      "id": 1,
      "request_id": "req_abc123",
      "user_id": "user_123",
      "model": "gpt-4o-mini",
      "feature": "chat",
      "input_tokens": 100,
      "output_tokens": 50,
      "total_tokens": 150,
      "estimated_cost_usd": 0.00023,
      "status": "allowed",
      "reason_code": null,
      "latency_ms": 350,
      "created_at": "2025-02-12T10:30:00Z"
    }
  ],
  "total": 1250,
  "page": 1,
  "page_size": 20,
  "total_pages": 63,
  "has_next": true,
  "has_prev": false
}`;

const CODE_BLOCKED = `# GET /usage/blocked
curl "https://api.tokenfence.io/usage/blocked?page=1&page_size=20" \\
  -H "X-API-Key: tf_live_..."

# Response: same structure as /usage/recent, filtered to blocked requests`;

const CODE_BY_USER = `# GET /usage/by-user
curl "https://api.tokenfence.io/usage/by-user?page=1&page_size=10" \\
  -H "X-API-Key: tf_live_..."

# Response (200 OK)
{
  "items": [
    {
      "group": "user_123",
      "requests": 450,
      "tokens": 180000,
      "cost_usd": 4.50
    },
    {
      "group": "user_456",
      "requests": 320,
      "tokens": 120000,
      "cost_usd": 3.10
    }
  ],
  "total": 25,
  "page": 1,
  "page_size": 10,
  "total_pages": 3,
  "has_next": true,
  "has_prev": false
}`;

const CODE_BY_FEATURE = `# GET /usage/by-feature
curl "https://api.tokenfence.io/usage/by-feature?page=1&page_size=10" \\
  -H "X-API-Key: tf_live_..."

# Response: same structure as /usage/by-user, grouped by feature name`;

const CODE_ERRORS = `# 401 Unauthorized — invalid or missing API key
{
  "detail": "Invalid API key",
  "error_code": "INVALID_API_KEY"
}

# 429 Too Many Requests — rate limit exceeded
{
  "detail": "Too many requests. Limit: 10000/minute",
  "error_code": "RATE_LIMIT_EXCEEDED",
  "retry_after": 45
}

# 422 Validation Error — invalid request body
{
  "detail": [
    {
      "loc": ["body", "user_id"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}

# 404 Not Found
{
  "detail": "Workspace not found",
  "error_code": "WORKSPACE_NOT_FOUND"
}

# 500 Internal Server Error
{
  "detail": "Internal server error",
  "error_code": "INTERNAL_ERROR"
}`;

const REASON_CODE_ROWS: [string, string][] = [
  ["ALLOWED", "Request is allowed"],
  ["NO_POLICY", "No matching policy, allowed by default"],
  ["DAILY_REQUEST_LIMIT_EXCEEDED", "Daily request limit reached"],
  ["MONTHLY_REQUEST_LIMIT_EXCEEDED", "Monthly request limit reached"],
  ["DAILY_TOKEN_LIMIT_EXCEEDED", "Daily token limit reached"],
  ["MONTHLY_TOKEN_LIMIT_EXCEEDED", "Monthly token limit reached"],
  ["DAILY_BUDGET_EXCEEDED", "Daily budget reached"],
  ["MONTHLY_BUDGET_EXCEEDED", "Monthly budget reached"],
  ["MAX_COST_EXCEEDED", "Single request cost too high"],
  ["MODEL_NOT_ALLOWED", "Model blocked by policy"],
];

const EVALUATE_PARAMS: [string, string][] = [
  ["user_id (required)", "Your app's end-user ID"],
  ["model (required)", "AI model name (e.g. gpt-4o-mini)"],
  ["feature", "Feature being used (e.g. chat, search)"],
  ["input_tokens", "Estimated input token count"],
  ["plan", "End-user's plan in your app"],
];

const LOG_PARAMS: [string, string][] = [
  ["request_id (required)", "Unique request identifier"],
  ["user_id (required)", "Your app's end-user ID"],
  ["model (required)", "AI model name"],
  ["input_tokens (required)", "Actual input token count"],
  ["output_tokens (required)", "Actual output token count"],
  ["status", '"allowed" or "blocked" (default: "allowed")'],
  ["feature", "Feature used"],
  ["latency_ms", "Request latency in milliseconds"],
  ["estimated_cost_usd", "Cost (auto-calculated if omitted)"],
];

export default function RestApiPage() {
  return (
    <div>
      <DocHeader
        icon="🌐"
        title="REST API"
        description="Use TokenFence from any language by calling the REST API directly. All endpoints use JSON and authenticate via API key header."
      />

      <DocTableOfContents items={TOC} />

      <div className="space-y-16">
        <DocSection
          id="authentication"
          title="Authentication"
          description="All API requests require your API key in the X-API-Key header. Create API keys in the dashboard under Workspaces → API Keys."
          code={CODE_AUTH}
          language="bash"
        >
          <DocNote type="warning">
            Keep your API key secret. Never expose it in client-side code or
            public repositories. Each key is scoped to a specific workspace and
            environment.
          </DocNote>
        </DocSection>

        <DocSection
          id="base-url"
          title="Base URL"
          description="All API endpoints use the following base URL:"
          code="https://api.tokenfence.io"
          language="bash"
        >
          <DocNote type="info">
            The SDK endpoints (evaluate, log usage, analytics) are called with
            the API key. Dashboard endpoints use JWT tokens and are not covered
            here.
          </DocNote>
        </DocSection>

        <DocSection
          id="evaluate"
          title="Evaluate Request"
          description="Check if a request should be allowed before making an AI call. This is the core endpoint — call it before every AI request."
        >
          <DocTable
            headers={["Parameter", "Description"]}
            rows={EVALUATE_PARAMS}
            highlightFirst={false}
          />
          <div className="mt-6" />
          <DocSection id="" title="" code={CODE_EVALUATE} language="bash" />
        </DocSection>

        <DocSection
          id="log-usage"
          title="Log Usage"
          description="Log the actual usage after making an AI call. This is required for accurate analytics and budget enforcement."
        >
          <DocTable
            headers={["Parameter", "Description"]}
            rows={LOG_PARAMS}
            highlightFirst={false}
          />
          <div className="mt-6" />
          <DocSection id="" title="" code={CODE_LOG} language="bash" />
          <DocNote type="warning">
            Always log usage after each AI call — even blocked ones. Without
            logging, budget and token limits won&apos;t track correctly.
          </DocNote>
        </DocSection>

        <DocSection
          id="usage-summary"
          title="Usage Summary"
          description="Get aggregate usage stats for your workspace/environment."
          code={CODE_SUMMARY}
          language="bash"
        />

        <DocSection
          id="recent-usage"
          title="Recent Usage"
          description="Get paginated usage records with optional filters."
          code={CODE_RECENT}
          language="bash"
        />

        <DocSection
          id="blocked-requests"
          title="Blocked Requests"
          description="Get paginated list of blocked requests."
          code={CODE_BLOCKED}
          language="bash"
        />

        <DocSection
          id="usage-by-user"
          title="Usage by User"
          description="Get usage grouped by end-user ID."
          code={CODE_BY_USER}
          language="bash"
        />

        <DocSection
          id="usage-by-feature"
          title="Usage by Feature"
          description="Get usage grouped by feature name."
          code={CODE_BY_FEATURE}
          language="bash"
        />

        <DocSection
          id="errors"
          title="Error Handling"
          description="The API returns standard HTTP status codes. Error responses include a detail message and error code."
          code={CODE_ERRORS}
          language="json"
        />

        <DocSection
          id="reason-codes"
          title="Reason Codes"
          description="When evaluate returns allowed: false, the reason_code tells you exactly why the request was blocked."
        >
          <DocTable headers={["Code", "Description"]} rows={REASON_CODE_ROWS} />
        </DocSection>
      </div>
    </div>
  );
}
