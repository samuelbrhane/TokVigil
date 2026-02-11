"use client";

import React from "react";
import { CodeBlock } from "@/components/ui";

const SECTIONS = [
  {
    id: "installation",
    title: "Installation",
    content: `Install the TokenFence TypeScript SDK using npm or yarn:`,
    code: `npm install tokenfence
# or
yarn add tokenfence`,
    language: "bash",
  },
  {
    id: "initialization",
    title: "Initialization",
    content: `Initialize the client with your API key:`,
    code: `import { TokenFence } from "tokenfence";

const tf = new TokenFence({
  apiKey: "tf_live_...",
  baseUrl: "https://api.tokenfence.io",  // Optional, this is the default
  timeout: 30000,  // Optional, milliseconds
  retryCount: 3,   // Optional
  retryDelay: 1000, // Optional, milliseconds
});`,
    language: "typescript",
  },
  {
    id: "evaluate",
    title: "Evaluate Requests",
    content: `Check if a request should be allowed before making an AI call:`,
    code: `const result = await tf.evaluate({
  userId: "user_123",       // Required: your app's user ID
  model: "gpt-4o-mini",     // Required: AI model name
  plan: "free",             // Optional: user's plan
  feature: "chat",          // Optional: feature being used
  inputTokens: 100,         // Optional: estimated input tokens
});

if (result.allowed) {
  console.log("Request allowed!");
  console.log(\`Estimated cost: $\${result.estimatedCostUsd}\`);
} else {
  console.log(\`Blocked: \${result.reasonCode}\`);
  console.log(\`Message: \${result.message}\`);
}

// Access limit state
console.log(\`Requests today: \${result.limitState.requestsToday}\`);
console.log(\`Daily limit: \${result.limitState.requestsLimitDaily}\`);`,
    language: "typescript",
  },
  {
    id: "log-usage",
    title: "Log Usage",
    content: `Log usage after making an AI call:`,
    code: `await tf.logUsage({
  requestId: "req_123",      // Required: unique request ID
  userId: "user_123",        // Required: your app's user ID
  model: "gpt-4o-mini",      // Required: AI model name
  inputTokens: 100,          // Required: actual input tokens
  outputTokens: 50,          // Required: actual output tokens
  status: "allowed",         // Optional: "allowed" or "blocked"
  plan: "free",              // Optional: user's plan
  feature: "chat",           // Optional: feature used
  latencyMs: 350,            // Optional: request latency
  estimatedCostUsd: 0.001,   // Optional: calculated automatically
});`,
    language: "typescript",
  },
  {
    id: "check-and-call",
    title: "Check and Call (Recommended)",
    content: `The easiest way to integrate - evaluate, call AI, and log usage in one step:`,
    code: `import OpenAI from "openai";

const openai = new OpenAI();

const { result, response } = await tf.checkAndCall(
  {
    userId: "user_123",
    model: "gpt-4o-mini",
    plan: "free",
    feature: "chat",
  },
  () => openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: "Hello!" }],
  }),
  // Optional: extract tokens from response
  (response) => ({
    inputTokens: response.usage?.prompt_tokens || 0,
    outputTokens: response.usage?.completion_tokens || 0,
  })
);

if (result.allowed && response) {
  console.log(response.choices[0].message.content);
} else {
  console.log(\`Blocked: \${result.reasonCode}\`);
}`,
    language: "typescript",
  },
  {
    id: "usage-analytics",
    title: "Usage Analytics",
    content: `Query usage data programmatically:`,
    code: `// Get usage summary
const summary = await tf.getUsageSummary();
console.log(\`Total requests: \${summary.totalRequests}\`);
console.log(\`Total tokens: \${summary.totalTokens}\`);
console.log(\`Total cost: $\${summary.totalCostUsd.toFixed(2)}\`);
console.log(\`Blocked requests: \${summary.blockedCount}\`);

// Get usage by user
const byUser = await tf.getUsageByUser({ page: 1, pageSize: 10 });
for (const user of byUser.items) {
  console.log(\`\${user.group}: \${user.requests} requests, $\${user.costUsd.toFixed(2)}\`);
}

// Get usage by feature
const byFeature = await tf.getUsageByFeature();
for (const feature of byFeature.items) {
  console.log(\`\${feature.group}: \${feature.tokens} tokens\`);
}

// Get recent usage records
const recent = await tf.getRecentUsage({ page: 1, pageSize: 20, userId: "user_123" });
for (const record of recent.items) {
  console.log(\`\${record.model}: \${record.totalTokens} tokens\`);
}

// Get blocked requests
const blocked = await tf.getBlockedRequests();
for (const record of blocked.items) {
  console.log(\`\${record.userId}: \${record.reasonCode}\`);
}`,
    language: "typescript",
  },
  {
    id: "error-handling",
    title: "Error Handling",
    content: `Handle errors gracefully with built-in exception classes:`,
    code: `import {
  TokenFence,
  TokenFenceError,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  NotFoundError,
  APIError,
} from "tokenfence";

const tf = new TokenFence({ apiKey: "tf_live_..." });

try {
  const result = await tf.evaluate({ userId: "user_123", model: "gpt-4o-mini" });
} catch (error) {
  if (error instanceof AuthenticationError) {
    // Invalid or missing API key (401, 403)
    console.log(\`Auth error: \${error.message}\`);
  } else if (error instanceof RateLimitError) {
    // Platform rate limit exceeded (429)
    console.log(\`Rate limited! Retry after \${error.retryAfter} seconds\`);
  } else if (error instanceof ValidationError) {
    // Invalid request parameters (422)
    console.log(\`Validation error: \${error.message}\`);
  } else if (error instanceof NotFoundError) {
    // Resource not found (404)
    console.log(\`Not found: \${error.message}\`);
  } else if (error instanceof APIError) {
    // Other API errors (5xx)
    console.log(\`API error: \${error.message}\`);
  } else if (error instanceof TokenFenceError) {
    // Base exception for all TokenFence errors
    console.log(\`Error: \${error.message}\`);
  }
}`,
    language: "typescript",
  },
  {
    id: "reason-codes",
    title: "Reason Codes",
    content: `When a request is blocked, the reasonCode tells you why:`,
    code: `// All possible reason codes
const REASON_CODES = {
  ALLOWED: "Request is allowed",
  NO_POLICY: "No policy found, request allowed by default",
  DAILY_REQUEST_LIMIT_EXCEEDED: "Daily request limit exceeded",
  MONTHLY_REQUEST_LIMIT_EXCEEDED: "Monthly request limit exceeded",
  DAILY_TOKEN_LIMIT_EXCEEDED: "Daily token limit exceeded",
  MONTHLY_TOKEN_LIMIT_EXCEEDED: "Monthly token limit exceeded",
  DAILY_BUDGET_EXCEEDED: "Daily budget exceeded",
  MONTHLY_BUDGET_EXCEEDED: "Monthly budget exceeded",
  MAX_COST_EXCEEDED: "Request cost exceeds maximum allowed",
  MODEL_NOT_ALLOWED: "Model is not allowed by policy",
};

// Handle specific reason codes
const result = await tf.evaluate({ userId: "user_123", model: "gpt-4o" });

if (!result.allowed) {
  switch (result.reasonCode) {
    case "MODEL_NOT_ALLOWED":
      // Fallback to allowed model
      const fallback = await tf.evaluate({ userId: "user_123", model: "gpt-4o-mini" });
      break;
    case "DAILY_REQUEST_LIMIT_EXCEEDED":
      // Show upgrade prompt
      console.log("Upgrade to Pro for more requests!");
      break;
    case "DAILY_BUDGET_EXCEEDED":
      // Show budget warning
      console.log(\`Daily budget of $\${result.limitState.costLimitDailyUsd} reached\`);
      break;
  }
}`,
    language: "typescript",
  },
];

export default function TypeScriptSDKPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">📘</span>
          <h1 className="text-4xl font-bold font-mono text-surface-100 tracking-tight">
            TypeScript SDK
          </h1>
        </div>
        <p className="text-lg text-surface-400 max-w-2xl">
          Complete guide to using the TokenFence TypeScript SDK in your
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
              language={section.language as "typescript" | "bash"}
            />
          </section>
        ))}
      </div>
    </div>
  );
}
