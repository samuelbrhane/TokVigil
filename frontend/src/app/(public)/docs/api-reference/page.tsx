"use client";

import React from "react";
import { CodeBlock } from "@/components/ui";

const ENDPOINTS = [
  {
    method: "POST",
    path: "/api/v1/evaluate",
    title: "Evaluate Request",
    description: "Check if an AI request should be allowed based on policies.",
    headers: `X-API-Key: tf_live_...
Content-Type: application/json`,
    request: `{
  "user_id": "user_123",
  "model": "gpt-4o-mini",
  "plan": "free",
  "feature": "chat",
  "input_tokens": 100
}`,
    response: `{
  "allowed": true,
  "reason_code": "ALLOWED",
  "message": "Request allowed",
  "policy_id": 1,
  "estimated_cost_usd": 0.00015,
  "limit_state": {
    "requests_today": 10,
    "requests_limit_daily": 100,
    "tokens_today": 5000,
    "tokens_limit_daily": 50000,
    "cost_today_usd": 0.05,
    "cost_limit_daily_usd": 10.00
  }
}`,
  },
  {
    method: "POST",
    path: "/api/v1/usage",
    title: "Log Usage",
    description: "Log an AI request after completion.",
    headers: `X-API-Key: tf_live_...
Content-Type: application/json`,
    request: `{
  "request_id": "req_123",
  "user_id": "user_123",
  "model": "gpt-4o-mini",
  "input_tokens": 100,
  "output_tokens": 50,
  "status": "allowed",
  "plan": "free",
  "feature": "chat",
  "latency_ms": 350
}`,
    response: `{
  "recorded": true,
  "request_id": "req_123"
}`,
  },
  {
    method: "GET",
    path: "/api/v1/usage/summary",
    title: "Usage Summary",
    description: "Get aggregated usage statistics.",
    headers: `X-API-Key: tf_live_...`,
    request: `# Query parameters (optional)
?start_date=2025-01-01T00:00:00Z
&end_date=2025-01-31T23:59:59Z`,
    response: `{
  "total_requests": 1500,
  "total_tokens": 750000,
  "total_cost_usd": 15.50,
  "allowed_count": 1450,
  "blocked_count": 50
}`,
  },
  {
    method: "GET",
    path: "/api/v1/usage/by-user",
    title: "Usage by User",
    description: "Get usage grouped by user ID.",
    headers: `X-API-Key: tf_live_...`,
    request: `# Query parameters
?page=1
&page_size=20`,
    response: `{
  "items": [
    {
      "group": "user_123",
      "requests": 500,
      "tokens": 250000,
      "cost_usd": 5.00
    }
  ],
  "total": 100,
  "page": 1,
  "page_size": 20,
  "total_pages": 5,
  "has_next": true,
  "has_prev": false
}`,
  },
  {
    method: "GET",
    path: "/api/v1/usage/by-feature",
    title: "Usage by Feature",
    description: "Get usage grouped by feature.",
    headers: `X-API-Key: tf_live_...`,
    request: `# Query parameters
?page=1
&page_size=20`,
    response: `{
  "items": [
    {
      "group": "chat",
      "requests": 1000,
      "tokens": 500000,
      "cost_usd": 10.00
    }
  ],
  "total": 5,
  "page": 1,
  "page_size": 20,
  "total_pages": 1,
  "has_next": false,
  "has_prev": false
}`,
  },
  {
    method: "GET",
    path: "/api/v1/auth/api-key-info",
    title: "API Key Info",
    description: "Get information about the current API key.",
    headers: `X-API-Key: tf_live_...`,
    request: `# No request body`,
    response: `{
  "key_prefix": "tf_live_52de2ea4",
  "name": "Production Key",
  "environment_id": 12,
  "environment_name": "production",
  "workspace_id": 4,
  "workspace_name": "My App"
}`,
  },
];

const REASON_CODES = [
  { code: "ALLOWED", description: "Request is allowed" },
  {
    code: "NO_POLICY",
    description: "No policy found, request allowed by default",
  },
  {
    code: "DAILY_REQUEST_LIMIT_EXCEEDED",
    description: "Daily request limit exceeded",
  },
  {
    code: "MONTHLY_REQUEST_LIMIT_EXCEEDED",
    description: "Monthly request limit exceeded",
  },
  {
    code: "DAILY_TOKEN_LIMIT_EXCEEDED",
    description: "Daily token limit exceeded",
  },
  {
    code: "MONTHLY_TOKEN_LIMIT_EXCEEDED",
    description: "Monthly token limit exceeded",
  },
  { code: "DAILY_BUDGET_EXCEEDED", description: "Daily budget exceeded" },
  { code: "MONTHLY_BUDGET_EXCEEDED", description: "Monthly budget exceeded" },
  {
    code: "MAX_COST_EXCEEDED",
    description: "Request cost exceeds maximum allowed",
  },
  { code: "MODEL_NOT_ALLOWED", description: "Model is not allowed by policy" },
];

const ERROR_CODES = [
  {
    status: 401,
    code: "INVALID_API_KEY",
    description: "API key is missing or invalid",
  },
  {
    status: 403,
    code: "API_KEY_REVOKED",
    description: "API key has been revoked",
  },
  { status: 404, code: "NOT_FOUND", description: "Resource not found" },
  {
    status: 422,
    code: "VALIDATION_ERROR",
    description: "Invalid request parameters",
  },
  {
    status: 429,
    code: "RATE_LIMIT_EXCEEDED",
    description: "Platform rate limit exceeded",
  },
  { status: 500, code: "INTERNAL_ERROR", description: "Internal server error" },
];

export default function APIReferencePage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">📚</span>
          <h1 className="text-4xl font-bold font-mono text-surface-100 tracking-tight">
            API Reference
          </h1>
        </div>
        <p className="text-lg text-surface-400 max-w-2xl">
          Complete REST API documentation for TokenFence.
        </p>
      </div>

      {/* Base URL */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold font-mono text-surface-100 tracking-tight mb-4">
          Base URL
        </h2>
        <CodeBlock code="https://api.tokenfence.io" language="bash" />
      </section>

      {/* Authentication */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold font-mono text-surface-100 tracking-tight mb-4">
          Authentication
        </h2>
        <p className="text-surface-400 mb-4">
          All API requests require an API key in the{" "}
          <code className="px-2 py-0.5 bg-surface-800 rounded text-sm">
            X-API-Key
          </code>{" "}
          header:
        </p>
        <CodeBlock
          code={`curl -X POST https://api.tokenfence.io/api/v1/evaluate \\
  -H "X-API-Key: tf_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{"user_id": "user_123", "model": "gpt-4o-mini"}'`}
          language="bash"
        />
      </section>

      {/* Endpoints */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold font-mono text-surface-100 tracking-tight mb-6">
          Endpoints
        </h2>
        <div className="space-y-12">
          {ENDPOINTS.map((endpoint) => (
            <div
              key={endpoint.path}
              id={endpoint.path.replace(/\//g, "-")}
              className="scroll-mt-28"
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`px-2 py-1 text-xs font-mono font-bold rounded ${
                    endpoint.method === "GET"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {endpoint.method}
                </span>
                <code className="text-surface-200 font-mono">
                  {endpoint.path}
                </code>
              </div>
              <h3 className="text-xl font-semibold text-surface-100 mb-2">
                {endpoint.title}
              </h3>
              <p className="text-surface-400 mb-6">{endpoint.description}</p>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-surface-300 mb-2">
                    Headers
                  </h4>
                  <CodeBlock code={endpoint.headers} language="bash" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-surface-300 mb-2">
                    Request
                  </h4>
                  <CodeBlock code={endpoint.request} language="json" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-surface-300 mb-2">
                    Response
                  </h4>
                  <CodeBlock code={endpoint.response} language="json" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reason Codes */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold font-mono text-surface-100 tracking-tight mb-4">
          Reason Codes
        </h2>
        <p className="text-surface-400 mb-6">
          When evaluating a request, the{" "}
          <code className="px-2 py-0.5 bg-surface-800 rounded text-sm">
            reason_code
          </code>{" "}
          indicates why it was allowed or blocked:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-800">
                <th className="text-left py-3 px-4 text-surface-400 font-mono font-medium">
                  Code
                </th>
                <th className="text-left py-3 px-4 text-surface-400 font-medium">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {REASON_CODES.map((item) => (
                <tr key={item.code} className="border-b border-surface-800/50">
                  <td className="py-3 px-4 font-mono text-brand-400">
                    {item.code}
                  </td>
                  <td className="py-3 px-4 text-surface-300">
                    {item.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Error Codes */}
      <section>
        <h2 className="text-2xl font-bold font-mono text-surface-100 tracking-tight mb-4">
          Error Codes
        </h2>
        <p className="text-surface-400 mb-6">
          API errors return a JSON object with{" "}
          <code className="px-2 py-0.5 bg-surface-800 rounded text-sm">
            detail
          </code>{" "}
          containing the error:
        </p>
        <CodeBlock
          code={`{
  "detail": {
    "message": "Invalid API key",
    "error_code": "INVALID_API_KEY"
  }
}`}
          language="json"
        />
        <div className="overflow-x-auto mt-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-800">
                <th className="text-left py-3 px-4 text-surface-400 font-medium">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-surface-400 font-mono font-medium">
                  Code
                </th>
                <th className="text-left py-3 px-4 text-surface-400 font-medium">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {ERROR_CODES.map((item) => (
                <tr key={item.code} className="border-b border-surface-800/50">
                  <td className="py-3 px-4 font-mono text-surface-300">
                    {item.status}
                  </td>
                  <td className="py-3 px-4 font-mono text-red-400">
                    {item.code}
                  </td>
                  <td className="py-3 px-4 text-surface-300">
                    {item.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
