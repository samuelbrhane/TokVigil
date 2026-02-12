"use client";

import DocHeader from "@/components/docs/DocHeader";
import DocTableOfContents from "@/components/docs/DocTableOfContents";
import DocSection from "@/components/docs/DocSection";
import DocNote from "@/components/docs/DocNote";

const TOC = [
  { id: "installation", title: "Installation" },
  { id: "initialization", title: "Initialization" },
  { id: "evaluate", title: "Evaluate Requests" },
  { id: "log-usage", title: "Log Usage" },
  { id: "check-and-call", title: "Check and Call" },
  { id: "usage-analytics", title: "Usage Analytics" },
  { id: "error-handling", title: "Error Handling" },
  { id: "reason-codes", title: "Reason Codes" },
];

const CODE_INSTALL = `pip install usagesentinel`;

const CODE_INIT = `from usagesentinel import UsageSentinel

us =UsageSentinel(
    api_key="us_live_...",       # Required: your API key
    base_url="https://api.usagesentinel.com",  # Optional, default
    timeout=30,                  # Optional, seconds
    retry_count=3,               # Optional
    retry_delay=1,               # Optional, seconds
)`;

const CODE_EVALUATE = `result = us.evaluate(
    user_id="user_123",       # Required: your app's user ID
    model="gpt-4o-mini",      # Required: AI model name
    feature="chat",           # Optional: feature being used
    input_tokens=100,         # Optional: estimated input tokens
)

if result.allowed:
    print("Request allowed!")
    print(f"Estimated cost: \${result.estimated_cost_usd}")
else:
    print(f"Blocked: {result.reason_code}")
    print(f"Message: {result.message}")

# Access current usage state
print(f"Requests today: {result.limit_state.requests_today}")
print(f"Daily limit: {result.limit_state.requests_limit_daily}")`;

const CODE_LOG = `us.log_usage(
    request_id="req_123",      # Required: unique request ID
    user_id="user_123",        # Required: your app's user ID
    model="gpt-4o-mini",       # Required: AI model name
    input_tokens=100,          # Required: actual input tokens
    output_tokens=50,          # Required: actual output tokens
    status="allowed",          # Optional: "allowed" or "blocked"
    feature="chat",            # Optional: feature used
    latency_ms=350,            # Optional: request latency
    estimated_cost_usd=0.001,  # Optional: auto-calculated if omitted
)`;

const CODE_CHECK_AND_CALL = `import openai

def call_openai():
    return openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": "Hello!"}]
    )

# Evaluate + call + log in one step
result, response = us.check_and_call(
    user_id="user_123",
    model="gpt-4o-mini",
    feature="chat",
    ai_function=call_openai,
)

if result.allowed:
    print(response.choices[0].message.content)
else:
    print(f"Blocked: {result.reason_code}")`;

const CODE_ANALYTICS = `# Get usage summary for your workspace
summary = us.get_usage_summary()
print(f"Total requests: {summary.total_requests}")
print(f"Total tokens: {summary.total_tokens}")
print(f"Total cost: \${summary.total_cost_usd:.2f}")
print(f"Blocked: {summary.blocked_count}")

# Get usage grouped by user
by_user = us.get_usage_by_user(page=1, page_size=10)
for user in by_user.items:
    print(f"{user.group}: {user.requests} requests, \${user.cost_usd:.2f}")

# Get usage grouped by feature
by_feature = us.get_usage_by_feature(page=1, page_size=10)
for feature in by_feature.items:
    print(f"{feature.group}: {feature.tokens} tokens")

# Get recent usage records (with optional filters)
recent = us.get_recent_usage(page=1, page_size=20, user_id="user_123")
for record in recent.items:
    print(f"{record.model}: {record.total_tokens} tokens")

# Get blocked requests
blocked = us.get_blocked_requests(page=1, page_size=20)
for record in blocked.items:
    print(f"{record.user_id}: {record.reason_code}")`;

const CODE_ERRORS = `from usagesentinel import (
    UsageSentinel,
    UsageSentinelError,
    AuthenticationError,
    RateLimitError,
    ValidationError,
    NotFoundError,
    APIError,
)

us =UsageSentinel(api_key="us_live_...")

try:
    result = us.evaluate(user_id="user_123", model="gpt-4o-mini")
except AuthenticationError as e:
    # Invalid or missing API key (401, 403)
    print(f"Auth error: {e.message}")
except RateLimitError as e:
    # Platform rate limit exceeded (429)
    print(f"Rate limited! Retry after {e.retry_after}s")
except ValidationError as e:
    # Invalid request parameters (422)
    print(f"Validation error: {e.message}")
except NotFoundError as e:
    # Resource not found (404)
    print(f"Not found: {e.message}")
except APIError as e:
    # Server errors (5xx)
    print(f"API error: {e.message}")
except UsageSentinelError as e:
    # Base exception — catches all above
    print(f"Error: {e.message}")`;

const CODE_REASON_CODES = `# All possible reason codes returned when a request is blocked
REASON_CODES = {
    "ALLOWED":                       "Request is allowed",
    "NO_POLICY":                     "No matching policy, allowed by default",
    "DAILY_REQUEST_LIMIT_EXCEEDED":  "Daily request limit reached",
    "MONTHLY_REQUEST_LIMIT_EXCEEDED":"Monthly request limit reached",
    "DAILY_TOKEN_LIMIT_EXCEEDED":    "Daily token limit reached",
    "MONTHLY_TOKEN_LIMIT_EXCEEDED":  "Monthly token limit reached",
    "DAILY_BUDGET_EXCEEDED":         "Daily budget reached",
    "MONTHLY_BUDGET_EXCEEDED":       "Monthly budget reached",
    "MAX_COST_EXCEEDED":             "Single request cost too high",
    "MODEL_NOT_ALLOWED":             "Model blocked by policy",
}

# Handle specific reason codes
result = us.evaluate(user_id="user_123", model="gpt-4o")

if not result.allowed:
    if result.reason_code == "MODEL_NOT_ALLOWED":
        # Fallback to an allowed model
        result = us.evaluate(user_id="user_123", model="gpt-4o-mini")
    elif result.reason_code == "DAILY_REQUEST_LIMIT_EXCEEDED":
        print("You've reached your daily limit. Try again tomorrow.")
    elif result.reason_code == "DAILY_BUDGET_EXCEEDED":
        print(f"Daily budget of \${result.limit_state.cost_limit_daily_usd} reached")`;

export default function PythonSDKPage() {
  return (
    <div>
      <DocHeader
        icon="🐍"
        title="Python SDK"
        description="Complete guide to using the UsageSentinel Python SDK in your applications."
      />

      <DocTableOfContents items={TOC} />

      <div className="space-y-16">
        <DocSection
          id="installation"
          title="Installation"
          description="Install the UsageSentinel Python SDK using pip:"
          code={CODE_INSTALL}
          language="bash"
        >
          <DocNote type="info">
            Requires Python 3.8 or higher. The SDK has no external dependencies
            beyond <code className="text-brand-400">requests</code>.
          </DocNote>
        </DocSection>

        <DocSection
          id="initialization"
          title="Initialization"
          description="Create a client instance with your API key. You can find your API key in the dashboard under Workspaces → API Keys."
          code={CODE_INIT}
        >
          <DocNote type="tip">
            Use environment variables for your API key in production:{" "}
            <code className="text-brand-400">
              UsageSentinel(api_key=os.environ[&quot;TOKENFENCE_API_KEY&quot;])
            </code>
          </DocNote>
        </DocSection>

        <DocSection
          id="evaluate"
          title="Evaluate Requests"
          description="Before making an AI call, check if the request is allowed by your policies. This checks rate limits, budgets, and model restrictions."
          code={CODE_EVALUATE}
        />

        <DocSection
          id="log-usage"
          title="Log Usage"
          description="After making an AI call, log the actual usage. This updates your analytics and is used to enforce budget limits."
          code={CODE_LOG}
        >
          <DocNote type="warning">
            Always log usage after each AI call — even blocked ones. This keeps
            your analytics accurate and ensures budget tracking works correctly.
          </DocNote>
        </DocSection>

        <DocSection
          id="check-and-call"
          title="Check and Call"
          description="The simplest way to integrate. Pass your AI function and UsageSentinel handles evaluate → call → log automatically."
          code={CODE_CHECK_AND_CALL}
        >
          <DocNote type="tip">
            This is the recommended approach for most use cases. It handles the
            full flow including error handling and automatic usage logging.
          </DocNote>
        </DocSection>

        <DocSection
          id="usage-analytics"
          title="Usage Analytics"
          description="Query your usage data programmatically. All data is also available in the dashboard."
          code={CODE_ANALYTICS}
        />

        <DocSection
          id="error-handling"
          title="Error Handling"
          description="The SDK provides specific exception classes for different error types. Always wrap calls in try/except for production use."
          code={CODE_ERRORS}
        />

        <DocSection
          id="reason-codes"
          title="Reason Codes"
          description="When a request is blocked, the reason_code tells you exactly why. Use this to show appropriate messages to your users or implement fallback logic."
          code={CODE_REASON_CODES}
        />
      </div>
    </div>
  );
}
