"use client";

import React from "react";
import { CodeBlock } from "@/components/ui";

// Code examples as separate constants to avoid escaping issues
const CODE_INSTALLATION = `pip install tokenfence`;

const CODE_INITIALIZATION = `from tokenfence import TokenFence

tf = TokenFence(
    api_key="tf_live_...",
    base_url="https://api.tokenfence.io",  # Optional, this is the default
    timeout=30,  # Optional, seconds
    retry_count=3,  # Optional
    retry_delay=1,  # Optional, seconds
)`;

const CODE_EVALUATE = `result = tf.evaluate(
    user_id="user_123",       # Required: your app's user ID
    model="gpt-4o-mini",      # Required: AI model name
    plan="free",              # Optional: user's plan
    feature="chat",           # Optional: feature being used
    input_tokens=100,         # Optional: estimated input tokens
)

if result.allowed:
    print("Request allowed!")
    print(f"Estimated cost: \${result.estimated_cost_usd}")
else:
    print(f"Blocked: {result.reason_code}")
    print(f"Message: {result.message}")

# Access limit state
print(f"Requests today: {result.limit_state.requests_today}")
print(f"Daily limit: {result.limit_state.requests_limit_daily}")`;

const CODE_LOG_USAGE = `tf.log_usage(
    request_id="req_123",      # Required: unique request ID
    user_id="user_123",        # Required: your app's user ID
    model="gpt-4o-mini",       # Required: AI model name
    input_tokens=100,          # Required: actual input tokens
    output_tokens=50,          # Required: actual output tokens
    status="allowed",          # Optional: "allowed" or "blocked"
    plan="free",               # Optional: user's plan
    feature="chat",            # Optional: feature used
    latency_ms=350,            # Optional: request latency
    estimated_cost_usd=0.001,  # Optional: calculated automatically
)`;

const CODE_CHECK_AND_CALL = `import openai

def call_openai():
    return openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": "Hello!"}]
    )

result, response = tf.check_and_call(
    user_id="user_123",
    model="gpt-4o-mini",
    plan="free",
    feature="chat",
    ai_function=call_openai,
)

if result.allowed:
    print(response.choices[0].message.content)
else:
    print(f"Blocked: {result.reason_code}")`;

const CODE_USAGE_ANALYTICS = `# Get usage summary
summary = tf.get_usage_summary()
print(f"Total requests: {summary.total_requests}")
print(f"Total tokens: {summary.total_tokens}")
print(f"Total cost: \${summary.total_cost_usd:.2f}")
print(f"Blocked requests: {summary.blocked_count}")

# Get usage by user
by_user = tf.get_usage_by_user(page=1, page_size=10)
for user in by_user.items:
    print(f"{user.group}: {user.requests} requests, \${user.cost_usd:.2f}")

# Get usage by feature
by_feature = tf.get_usage_by_feature(page=1, page_size=10)
for feature in by_feature.items:
    print(f"{feature.group}: {feature.tokens} tokens")

# Get recent usage records
recent = tf.get_recent_usage(page=1, page_size=20, user_id="user_123")
for record in recent.items:
    print(f"{record.model}: {record.total_tokens} tokens")

# Get blocked requests
blocked = tf.get_blocked_requests(page=1, page_size=20)
for record in blocked.items:
    print(f"{record.user_id}: {record.reason_code}")`;

const CODE_ERROR_HANDLING = `from tokenfence import (
    TokenFence,
    TokenFenceError,
    AuthenticationError,
    RateLimitError,
    ValidationError,
    NotFoundError,
    APIError,
)

tf = TokenFence(api_key="tf_live_...")

try:
    result = tf.evaluate(user_id="user_123", model="gpt-4o-mini")
except AuthenticationError as e:
    # Invalid or missing API key (401, 403)
    print(f"Auth error: {e.message}")
except RateLimitError as e:
    # Platform rate limit exceeded (429)
    print(f"Rate limited! Retry after {e.retry_after} seconds")
except ValidationError as e:
    # Invalid request parameters (422)
    print(f"Validation error: {e.message}")
except NotFoundError as e:
    # Resource not found (404)
    print(f"Not found: {e.message}")
except APIError as e:
    # Other API errors (5xx)
    print(f"API error: {e.message}")
except TokenFenceError as e:
    # Base exception for all TokenFence errors
    print(f"Error: {e.message}")`;

const CODE_REASON_CODES = `# All possible reason codes
REASON_CODES = {
    "ALLOWED": "Request is allowed",
    "NO_POLICY": "No policy found, request allowed by default",
    "DAILY_REQUEST_LIMIT_EXCEEDED": "Daily request limit exceeded",
    "MONTHLY_REQUEST_LIMIT_EXCEEDED": "Monthly request limit exceeded",
    "DAILY_TOKEN_LIMIT_EXCEEDED": "Daily token limit exceeded",
    "MONTHLY_TOKEN_LIMIT_EXCEEDED": "Monthly token limit exceeded",
    "DAILY_BUDGET_EXCEEDED": "Daily budget exceeded",
    "MONTHLY_BUDGET_EXCEEDED": "Monthly budget exceeded",
    "MAX_COST_EXCEEDED": "Request cost exceeds maximum allowed",
    "MODEL_NOT_ALLOWED": "Model is not allowed by policy",
}

# Handle specific reason codes
result = tf.evaluate(user_id="user_123", model="gpt-4o")

if not result.allowed:
    if result.reason_code == "MODEL_NOT_ALLOWED":
        # Fallback to allowed model
        result = tf.evaluate(user_id="user_123", model="gpt-4o-mini")
    elif result.reason_code == "DAILY_REQUEST_LIMIT_EXCEEDED":
        # Show upgrade prompt
        print(f"Upgrade to Pro for more requests!")
    elif result.reason_code == "DAILY_BUDGET_EXCEEDED":
        # Show budget warning
        print(f"Daily budget of \${result.limit_state.cost_limit_daily_usd} reached")`;

const SECTIONS = [
  {
    id: "installation",
    title: "Installation",
    content: "Install the TokenFence Python SDK using pip:",
    code: CODE_INSTALLATION,
    language: "bash",
  },
  {
    id: "initialization",
    title: "Initialization",
    content: "Initialize the client with your API key:",
    code: CODE_INITIALIZATION,
    language: "python",
  },
  {
    id: "evaluate",
    title: "Evaluate Requests",
    content: "Check if a request should be allowed before making an AI call:",
    code: CODE_EVALUATE,
    language: "python",
  },
  {
    id: "log-usage",
    title: "Log Usage",
    content: "Log usage after making an AI call:",
    code: CODE_LOG_USAGE,
    language: "python",
  },
  {
    id: "check-and-call",
    title: "Check and Call (Recommended)",
    content:
      "The easiest way to integrate - evaluate, call AI, and log usage in one step:",
    code: CODE_CHECK_AND_CALL,
    language: "python",
  },
  {
    id: "usage-analytics",
    title: "Usage Analytics",
    content: "Query usage data programmatically:",
    code: CODE_USAGE_ANALYTICS,
    language: "python",
  },
  {
    id: "error-handling",
    title: "Error Handling",
    content: "Handle errors gracefully with built-in exception classes:",
    code: CODE_ERROR_HANDLING,
    language: "python",
  },
  {
    id: "reason-codes",
    title: "Reason Codes",
    content: "When a request is blocked, the reason_code tells you why:",
    code: CODE_REASON_CODES,
    language: "python",
  },
];

export default function PythonSDKPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🐍</span>
          <h1 className="text-4xl font-bold font-mono text-surface-100 tracking-tight">
            Python SDK
          </h1>
        </div>
        <p className="text-lg text-surface-400 max-w-2xl">
          Complete guide to using the TokenFence Python SDK in your
          applications.
        </p>
      </div>

      {/* Table of Contents */}
      <div className="mb-12 p-6 bg-surface-900/50 border border-surface-800 rounded-lg">
        <h3 className="font-mono font-semibold text-surface-100 mb-4">
          On this page
        </h3>
        <ul className="space-y-2 text-sm">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="text-surface-400 hover:text-brand-400 transition-colors"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Sections */}
      <div className="space-y-16">
        {SECTIONS.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-28">
            <h2 className="text-2xl font-bold font-mono text-surface-100 tracking-tight mb-4">
              {section.title}
            </h2>
            <p className="text-surface-400 mb-6">{section.content}</p>
            <CodeBlock
              code={section.code}
              language={section.language as "python" | "bash"}
            />
          </section>
        ))}
      </div>
    </div>
  );
}
