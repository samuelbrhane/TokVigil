"use client";

import DocHeader from "@/components/docs/DocHeader";
import DocTableOfContents from "@/components/docs/DocTableOfContents";
import DocSection from "@/components/docs/DocSection";
import DocNote from "@/components/docs/DocNote";
import { motion } from "framer-motion";
import { authMotion } from "@/lib/motion/auth";

const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: "easeOut" },
  },
} as const;

const sectionStagger = {
  initial: {},
  animate: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
} as const;

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

const CODE_INSTALL = `npm install tokvigil
# or
yarn add tokvigil`;

const CODE_INIT = `import { TokVigil } from "tokvigil";

const tv = new TokVigil({
  apiKey: "tv_live_...",           // Required: your API key
  baseUrl: "https://api.tokvigil.com",  // Optional, default
  timeout: 30000,                  // Optional, milliseconds
  retryCount: 3,                   // Optional
  retryDelay: 1000,                // Optional, milliseconds
});`;

const CODE_EVALUATE = `const result = await tv.evaluate({
  userId: "user_123",       // Required: your app's user ID
  model: "gpt-4o-mini",     // Required: AI model name
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

// Access current usage state
console.log(\`Requests today: \${result.limitState.requestsToday}\`);
console.log(\`Daily limit: \${result.limitState.requestsLimitDaily}\`);`;

const CODE_LOG = `await tv.logUsage({
  requestId: "req_123",      // Required: unique request ID
  userId: "user_123",        // Required: your app's user ID
  model: "gpt-4o-mini",      // Required: AI model name
  inputTokens: 100,          // Required: actual input tokens
  outputTokens: 50,          // Required: actual output tokens
  status: "allowed",         // Optional: "allowed" or "blocked"
  feature: "chat",           // Optional: feature used
  latencyMs: 350,            // Optional: request latency
  estimatedCostUsd: 0.001,   // Optional: auto-calculated if omitted
});`;

const CODE_CHECK_AND_CALL = `import OpenAI from "openai";

const openai = new OpenAI();

const { result, response } = await tv.checkAndCall(
  {
    userId: "user_123",
    model: "gpt-4o-mini",
    feature: "chat",
  },
  // Your AI function
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
}`;

const CODE_ANALYTICS = `// Get usage summary for your workspace
const summary = await tv.getUsageSummary();
console.log(\`Total requests: \${summary.totalRequests}\`);
console.log(\`Total tokens: \${summary.totalTokens}\`);
console.log(\`Total cost: $\${summary.totalCostUsd.toFixed(2)}\`);
console.log(\`Blocked: \${summary.blockedCount}\`);

// Get usage grouped by user
const byUser = await tv.getUsageByUser({ page: 1, pageSize: 10 });
for (const user of byUser.items) {
  console.log(\`\${user.group}: \${user.requests} requests, $\${user.costUsd.toFixed(2)}\`);
}

// Get usage grouped by feature
const byFeature = await tv.getUsageByFeature({ page: 1, pageSize: 10 });
for (const feature of byFeature.items) {
  console.log(\`\${feature.group}: \${feature.tokens} tokens\`);
}

// Get recent usage records (with optional filters)
const recent = await tv.getRecentUsage({ page: 1, pageSize: 20, userId: "user_123" });
for (const record of recent.items) {
  console.log(\`\${record.model}: \${record.totalTokens} tokens\`);
}

// Get blocked requests
const blocked = await tv.getBlockedRequests({ page: 1, pageSize: 20 });
for (const record of blocked.items) {
  console.log(\`\${record.userId}: \${record.reasonCode}\`);
}`;

const CODE_ERRORS = `import {
  TokVigil,
  TokVigilError,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  NotFoundError,
  APIError,
} from "tokvigil";

const tv = new TokVigil({ apiKey: "tv_live_..." });

try {
  const result = await tv.evaluate({ userId: "user_123", model: "gpt-4o-mini" });
} catch (error) {
  if (error instanceof AuthenticationError) {
    // Invalid or missing API key (401, 403)
    console.log(\`Auth error: \${error.message}\`);
  } else if (error instanceof RateLimitError) {
    // Platform rate limit exceeded (429)
    console.log(\`Rate limited! Retry after \${error.retryAfter}s\`);
  } else if (error instanceof ValidationError) {
    // Invalid request parameters (422)
    console.log(\`Validation error: \${error.message}\`);
  } else if (error instanceof NotFoundError) {
    // Resource not found (404)
    console.log(\`Not found: \${error.message}\`);
  } else if (error instanceof APIError) {
    // Server errors (5xx)
    console.log(\`API error: \${error.message}\`);
  } else if (error instanceof TokVigilError) {
    // Base exception — catches all above
    console.log(\`Error: \${error.message}\`);
  }
}`;

const CODE_REASON_CODES = `// All possible reason codes returned when a request is blocked
const REASON_CODES = {
  ALLOWED:                        "Request is allowed",
  NO_POLICY:                      "No matching policy, allowed by default",
  DAILY_REQUEST_LIMIT_EXCEEDED:   "Daily request limit reached",
  MONTHLY_REQUEST_LIMIT_EXCEEDED: "Monthly request limit reached",
  DAILY_TOKEN_LIMIT_EXCEEDED:     "Daily token limit reached",
  MONTHLY_TOKEN_LIMIT_EXCEEDED:   "Monthly token limit reached",
  DAILY_BUDGET_EXCEEDED:          "Daily budget reached",
  MONTHLY_BUDGET_EXCEEDED:        "Monthly budget reached",
  MAX_COST_EXCEEDED:              "Single request cost too high",
  MODEL_NOT_ALLOWED:              "Model blocked by policy",
};

// Handle specific reason codes
const result = await tv.evaluate({ userId: "user_123", model: "gpt-4o" });

if (!result.allowed) {
  switch (result.reasonCode) {
    case "MODEL_NOT_ALLOWED":
      // Fallback to an allowed model
      const fallback = await tv.evaluate({ userId: "user_123", model: "gpt-4o-mini" });
      break;
    case "DAILY_REQUEST_LIMIT_EXCEEDED":
      console.log("You've reached your daily limit. Try again tomorrow.");
      break;
    case "DAILY_BUDGET_EXCEEDED":
      console.log(\`Daily budget of $\${result.limitState.costLimitDailyUsd} reached\`);
      break;
  }
}`;

export default function TypeScriptSDKPage() {
  return (
    <motion.div
      variants={authMotion.page}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div variants={fadeUp} initial="initial" animate="animate">
        <DocHeader
          icon="📘"
          title="TypeScript SDK"
          description="Complete guide to using the TokVigil TypeScript SDK in your Node.js and browser applications."
        />
      </motion.div>

      <motion.div variants={fadeUp} initial="initial" animate="animate">
        <DocTableOfContents items={TOC} />
      </motion.div>

      <motion.div
        className="space-y-16"
        variants={sectionStagger}
        initial="initial"
        animate="animate"
      >
        <motion.div
          variants={authMotion.panel}
          initial="initial"
          animate="animate"
        >
          <DocSection
            id="installation"
            title="Installation"
            description="Install the TokVigil TypeScript SDK using npm or yarn:"
            code={CODE_INSTALL}
            language="bash"
          >
            <DocNote type="info">
              Works with Node.js 16+ and modern browsers. Ships with full
              TypeScript type definitions included.
            </DocNote>
          </DocSection>
        </motion.div>

        <motion.div
          variants={authMotion.panel}
          initial="initial"
          animate="animate"
        >
          <DocSection
            id="initialization"
            title="Initialization"
            description="Create a client instance with your API key. You can find your API key in the dashboard under Workspaces → API Keys."
            code={CODE_INIT}
          >
            <DocNote type="tip">
              Use environment variables for your API key in production:{" "}
              <code className="text-brand-400">
                new TokVigil({"{"} apiKey: process.env.TOKVIGIL_API_KEY {"}"})
              </code>
            </DocNote>
          </DocSection>
        </motion.div>

        <motion.div
          variants={authMotion.panel}
          initial="initial"
          animate="animate"
        >
          <DocSection
            id="evaluate"
            title="Evaluate Requests"
            description="Before making an AI call, check if the request is allowed by your policies. This checks rate limits, budgets, and model restrictions."
            code={CODE_EVALUATE}
          />
        </motion.div>

        <motion.div
          variants={authMotion.panel}
          initial="initial"
          animate="animate"
        >
          <DocSection
            id="log-usage"
            title="Log Usage"
            description="After making an AI call, log the actual usage. This updates your analytics and is used to enforce budget limits."
            code={CODE_LOG}
          >
            <DocNote type="warning">
              Always log usage after each AI call — even blocked ones. This
              keeps your analytics accurate and ensures budget tracking works
              correctly.
            </DocNote>
          </DocSection>
        </motion.div>

        <motion.div
          variants={authMotion.panel}
          initial="initial"
          animate="animate"
        >
          <DocSection
            id="check-and-call"
            title="Check and Call"
            description="The simplest way to integrate. Pass your AI function and TokVigil handles evaluate → call → log automatically. The optional third argument extracts token counts from the response."
            code={CODE_CHECK_AND_CALL}
          >
            <DocNote type="tip">
              This is the recommended approach for most use cases. It handles
              the full flow including error handling and automatic usage
              logging.
            </DocNote>
          </DocSection>
        </motion.div>

        <motion.div
          variants={authMotion.panel}
          initial="initial"
          animate="animate"
        >
          <DocSection
            id="usage-analytics"
            title="Usage Analytics"
            description="Query your usage data programmatically. All data is also available in the dashboard."
            code={CODE_ANALYTICS}
          />
        </motion.div>

        <motion.div
          variants={authMotion.panel}
          initial="initial"
          animate="animate"
        >
          <DocSection
            id="error-handling"
            title="Error Handling"
            description="The SDK provides specific error classes for different failure types. Always wrap calls in try/catch for production use."
            code={CODE_ERRORS}
          />
        </motion.div>

        <motion.div
          variants={authMotion.panel}
          initial="initial"
          animate="animate"
        >
          <DocSection
            id="reason-codes"
            title="Reason Codes"
            description="When a request is blocked, the reasonCode tells you exactly why. Use this to show appropriate messages to your users or implement fallback logic."
            code={CODE_REASON_CODES}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
