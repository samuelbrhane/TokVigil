"use client";

import { useInView } from "@/lib/hooks";
import { CodeBlock, GridBackground } from "@/components/ui";
import { PageHeader } from "@/components/layout";
import { CTASection } from "@/components/landing";

// ============================================================
// FEATURES DATA
// ============================================================
const FEATURES = [
  {
    title: "Rate Limiting",
    icon: "⚡",
    description:
      "Set daily and monthly request limits per user, plan, or feature. Prevent abuse and ensure fair usage across your user base.",
    details: [
      "Daily and monthly request caps",
      "Per-user and per-plan limits",
      "Automatic limit reset at midnight UTC",
      "Real-time limit state in responses",
    ],
  },
  {
    title: "Budget Control",
    icon: "💰",
    description:
      "Control AI spending with daily, monthly, and per-request cost limits. Never exceed your budget again.",
    details: [
      "Daily and monthly cost caps",
      "Per-request cost limits",
      "Automatic cost calculation by model",
      "Budget alerts before limits hit",
    ],
  },
  {
    title: "Token Limits",
    icon: "🔢",
    description:
      "Set token quotas per user or plan. Control context window usage and prevent runaway token consumption.",
    details: [
      "Daily and monthly token caps",
      "Input and output token tracking",
      "Per-model token pricing",
      "Token usage in real-time responses",
    ],
  },
  {
    title: "Model Restrictions",
    icon: "🔒",
    description:
      "Control which AI models each plan can access. Reserve expensive models for premium users.",
    details: [
      "Whitelist models per plan",
      "Block expensive models on free tier",
      "Automatic model validation",
      "Clear error messages for users",
    ],
  },
  {
    title: "Usage Analytics",
    icon: "📊",
    description:
      "Track every request, token, and dollar spent. Query usage by user, feature, or time period.",
    details: [
      "Real-time usage dashboards",
      "Usage breakdown by user",
      "Usage breakdown by feature",
      "Export data via API",
    ],
  },
  {
    title: "Multi-Environment",
    icon: "🌐",
    description:
      "Separate production, staging, and development with distinct API keys. Same policies, isolated data.",
    details: [
      "Production and development keys",
      "Isolated usage tracking",
      "Same policies across environments",
      "Easy environment switching",
    ],
  },
  {
    title: "Error Handling",
    icon: "🛡️",
    description:
      "Built-in exception classes for every scenario. Handle rate limits, auth errors, and blocks gracefully.",
    details: [
      "Typed exception classes",
      "Reason codes for every block",
      "Retry-after headers for rate limits",
      "Detailed error messages",
    ],
  },
  {
    title: "One-Line Integration",
    icon: "🚀",
    description:
      "Evaluate, call your AI, and log usage in a single function. The SDK handles the full flow automatically.",
    details: [
      "check_and_call() for full flow",
      "Automatic token extraction",
      "Automatic usage logging",
      "Automatic error handling",
    ],
  },
] as const;

// ============================================================
// CODE EXAMPLES FOR EACH FEATURE
// ============================================================
const featureCodeExamples: Record<
  string,
  { python: string; typescript: string }
> = {
  "Rate Limiting": {
    python: `# Check limits before each AI call
result = us.evaluate(
    user_id="user_123",
    model="gpt-4o-mini",
    plan="free",
    feature="chat"
)

if result.allowed:
    response = openai.chat.completions.create(...)
else:
    print(f"Blocked: {result.reason_code}")
    print(f"Requests today: {result.limit_state.requests_today}")
    print(f"Limit: {result.limit_state.requests_limit_daily}")`,
    typescript: `// Check limits before each AI call
const result = await us.evaluate({
  userId: "user_123",
  model: "gpt-4o-mini",
  plan: "free",
  feature: "chat",
});

if (result.allowed) {
  const response = await openai.chat.completions.create(...);
} else {
  console.log(\`Blocked: \${result.reasonCode}\`);
  console.log(\`Requests today: \${result.limitState.requestsToday}\`);
}`,
  },

  "Budget Control": {
    python: `# Budget limits enforced automatically
result = us.evaluate(
    user_id="user_123",
    model="gpt-4o",
    plan="pro"
)

if not result.allowed:
    if result.reason_code == "DAILY_BUDGET_EXCEEDED":
        print(f"Spent today: \${result.limit_state.cost_today_usd}")
        print(f"Daily limit: \${result.limit_state.cost_limit_daily_usd}")
    elif result.reason_code == "MAX_COST_EXCEEDED":
        print("Request too expensive, try a smaller model")`,
    typescript: `// Budget limits enforced automatically
const result = await us.evaluate({
  userId: "user_123",
  model: "gpt-4o",
  plan: "pro",
});

if (!result.allowed) {
  if (result.reasonCode === "DAILY_BUDGET_EXCEEDED") {
    console.log(\`Spent today: $\${result.limitState.costTodayUsd}\`);
    console.log(\`Daily limit: $\${result.limitState.costLimitDailyUsd}\`);
  } else if (result.reasonCode === "MAX_COST_EXCEEDED") {
    console.log("Request too expensive, try a smaller model");
  }
}`,
  },

  "Token Limits": {
    python: `# Token limits checked automatically
result = us.evaluate(
    user_id="user_123",
    model="gpt-4o-mini",
    plan="free",
    input_tokens=1000  # Optional: pre-check tokens
)

if result.allowed:
    response = openai.chat.completions.create(...)
else:
    if result.reason_code == "DAILY_TOKEN_LIMIT_EXCEEDED":
        print(f"Tokens today: {result.limit_state.tokens_today}")
        print(f"Limit: {result.limit_state.tokens_limit_daily}")`,
    typescript: `// Token limits checked automatically
const result = await us.evaluate({
  userId: "user_123",
  model: "gpt-4o-mini",
  plan: "free",
  inputTokens: 1000, // Optional: pre-check tokens
});

if (result.allowed) {
  const response = await openai.chat.completions.create(...);
} else {
  if (result.reasonCode === "DAILY_TOKEN_LIMIT_EXCEEDED") {
    console.log(\`Tokens today: \${result.limitState.tokensToday}\`);
    console.log(\`Limit: \${result.limitState.tokensLimitDaily}\`);
  }
}`,
  },

  "Model Restrictions": {
    python: `# Model restrictions set in dashboard
# Free plan: only gpt-4o-mini allowed
# Pro plan: gpt-4o-mini, gpt-4o, claude-3-sonnet

result = us.evaluate(
    user_id="user_123",
    model="gpt-4o",  # Not allowed on free plan
    plan="free"
)

if result.reason_code == "MODEL_NOT_ALLOWED":
    print("Upgrade to Pro for GPT-4o access")
    # Fallback to allowed model
    result = us.evaluate(
        user_id="user_123",
        model="gpt-4o-mini",
        plan="free"
    )`,
    typescript: `// Model restrictions set in dashboard
// Free plan: only gpt-4o-mini allowed
// Pro plan: gpt-4o-mini, gpt-4o, claude-3-sonnet

const result = await us.evaluate({
  userId: "user_123",
  model: "gpt-4o", // Not allowed on free plan
  plan: "free",
});

if (result.reasonCode === "MODEL_NOT_ALLOWED") {
  console.log("Upgrade to Pro for GPT-4o access");
  // Fallback to allowed model
  const fallback = await us.evaluate({
    userId: "user_123",
    model: "gpt-4o-mini",
    plan: "free",
  });
}`,
  },

  "Usage Analytics": {
    python: `# Get usage summary
summary = us.get_usage_summary()
print(f"Total requests: {summary.total_requests}")
print(f"Total tokens: {summary.total_tokens}")
print(f"Total cost: \${summary.total_cost_usd:.2f}")
print(f"Blocked: {summary.blocked_count}")

# Usage breakdown by user
by_user = us.get_usage_by_user()
for user in by_user.items:
    print(f"{user.group}: {user.requests} requests")

# Usage breakdown by feature
by_feature = us.get_usage_by_feature()
for feature in by_feature.items:
    print(f"{feature.group}: \${feature.cost_usd:.2f}")`,
    typescript: `// Get usage summary
const summary = await us.getUsageSummary();
console.log(\`Total requests: \${summary.totalRequests}\`);
console.log(\`Total tokens: \${summary.totalTokens}\`);
console.log(\`Total cost: $\${summary.totalCostUsd.toFixed(2)}\`);
console.log(\`Blocked: \${summary.blockedCount}\`);

// Usage breakdown by user
const byUser = await us.getUsageByUser();
for (const user of byUser.items) {
  console.log(\`\${user.group}: \${user.requests} requests\`);
}

// Usage breakdown by feature
const byFeature = await us.getUsageByFeature();
for (const feature of byFeature.items) {
  console.log(\`\${feature.group}: $\${feature.costUsd.toFixed(2)}\`);
}`,
  },

  "Multi-Environment": {
    python: `# Separate environments with distinct API keys
from usagesentinel import UsageSentinel

# Production - real usage tracking
us_prod = UsageSentinel(api_key="us_live_xxxxxxxxxxxx")

# Development - isolated testing  
us_dev = UsageSentinel(api_key="us_test_xxxxxxxxxxxx")

# Same code works in both environments
result = us_prod.evaluate(
    user_id="user_123",
    model="gpt-4o-mini",
    plan="free"
)

# Usage data is completely isolated
prod_summary = us_prod.get_usage_summary()
dev_summary = us_dev.get_usage_summary()`,
    typescript: `// Separate environments with distinct API keys
import { UsageSentinel } from "usagesentinel";

// Production - real usage tracking
const tfProd = new UsageSentinel({ apiKey: "us_live_xxxxxxxxxxxx" });

// Development - isolated testing
const tfDev = new UsageSentinel({ apiKey: "us_test_xxxxxxxxxxxx" });

// Same code works in both environments
const result = await tfProd.evaluate({
  userId: "user_123",
  model: "gpt-4o-mini",
  plan: "free",
});

// Usage data is completely isolated
const prodSummary = await tfProd.getUsageSummary();
const devSummary = await tfDev.getUsageSummary();`,
  },

  "Error Handling": {
    python: `from usagesentinel import (
    UsageSentinel,
    RateLimitError,
    AuthenticationError,
    ValidationError,
    UsageSentinelError
)

us = UsageSentinel(api_key="us_live_...")

try:
    result = us.evaluate(
        user_id="user_123",
        model="gpt-4o-mini"
    )
except RateLimitError as e:
    print(f"Rate limited! Retry after {e.retry_after}s")
except AuthenticationError as e:
    print(f"Invalid API key: {e.message}")
except ValidationError as e:
    print(f"Invalid request: {e.message}")
except UsageSentinelError as e:
    print(f"Error: {e.message}")`,
    typescript: `import {
  UsageSentinel,
  RateLimitError,
  AuthenticationError,
  ValidationError,
  UsageSentinelError,
} from "usagesentinel";

const us =new UsageSentinel({ apiKey: "us_live_..." });

try {
  const result = await us.evaluate({
    userId: "user_123",
    model: "gpt-4o-mini",
  });
} catch (error) {
  if (error instanceof RateLimitError) {
    console.log(\`Rate limited! Retry after \${error.retryAfter}s\`);
  } else if (error instanceof AuthenticationError) {
    console.log(\`Invalid API key: \${error.message}\`);
  } else if (error instanceof ValidationError) {
    console.log(\`Invalid request: \${error.message}\`);
  } else if (error instanceof UsageSentinelError) {
    console.log(\`Error: \${error.message}\`);
  }
}`,
  },

  "One-Line Integration": {
    python: `# Full flow in one function call
result, response = us.check_and_call(
    user_id="user_123",
    model="gpt-4o-mini",
    plan="free",
    feature="chat",
    ai_function=lambda: openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": "Hello"}]
    )
)

# Automatically:
# 1. Evaluates against policies
# 2. Calls your AI function (if allowed)
# 3. Logs usage with tokens and latency

if result.allowed:
    print(response.choices[0].message.content)
else:
    print(f"Blocked: {result.reason_code}")`,
    typescript: `// Full flow in one function call
const { result, response } = await us.checkAndCall(
  {
    userId: "user_123",
    model: "gpt-4o-mini",
    plan: "free",
    feature: "chat",
  },
  () => openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: "Hello" }],
  })
);

// Automatically:
// 1. Evaluates against policies
// 2. Calls your AI function (if allowed)
// 3. Logs usage with tokens and latency

if (result.allowed && response) {
  console.log(response.choices[0].message.content);
} else {
  console.log(\`Blocked: \${result.reasonCode}\`);
}`,
  },
};

// ============================================================
// FEATURE DETAIL COMPONENT
// ============================================================
function FeatureDetail({
  feature,
  index,
}: {
  feature: (typeof FEATURES)[number];
  index: number;
}) {
  const [ref, visible] = useInView(0.1);
  const [language, setLanguage] = React.useState<"python" | "typescript">(
    "python",
  );
  const isReversed = index % 2 === 1;

  const codeExample = featureCodeExamples[feature.title];

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center py-16"
    >
      {/* Text Content */}
      <div
        className={isReversed ? "lg:order-2" : ""}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translateX(0)"
            : `translateX(${isReversed ? "30px" : "-30px"})`,
          transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="text-3xl mb-4 text-brand-500/80">{feature.icon}</div>
        <h3 className="text-2xl font-bold font-mono text-surface-100 tracking-tight mb-3">
          {feature.title}
        </h3>
        <p className="text-surface-400 leading-relaxed mb-6">
          {feature.description}
        </p>
        <ul className="space-y-2.5">
          {feature.details.map((detail) => (
            <li
              key={detail}
              className="flex items-start gap-2.5 text-sm text-surface-400"
            >
              <span className="text-brand-500 mt-0.5 text-xs">▸</span>
              {detail}
            </li>
          ))}
        </ul>
      </div>

      {/* Code Example */}
      <div
        className={isReversed ? "lg:order-1" : ""}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translateX(0)"
            : `translateX(${isReversed ? "-30px" : "30px"})`,
          transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s",
        }}
      >
        {/* Language Toggle */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setLanguage("python")}
            className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
              language === "python"
                ? "bg-brand-500 text-white"
                : "bg-surface-800 text-surface-400 hover:text-surface-200"
            }`}
          >
            Python
          </button>
          <button
            onClick={() => setLanguage("typescript")}
            className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
              language === "typescript"
                ? "bg-brand-500 text-white"
                : "bg-surface-800 text-surface-400 hover:text-surface-200"
            }`}
          >
            TypeScript
          </button>
        </div>
        <CodeBlock code={codeExample[language]} language={language} />
      </div>
    </div>
  );
}

// ============================================================
// FEATURES PAGE
// ============================================================
import React from "react";

export default function FeaturesPage() {
  return (
    <div className="pt-24">
      <div className="relative">
        <GridBackground opacity={0.02} />
        <div className="max-w-7xl mx-auto px-6">
          <PageHeader
            tag="Features"
            title="Built for developers who"
            highlight="ship AI in production"
            description="Every feature designed to solve real problems teams face when integrating AI into their products."
          />
          <div className="divide-y divide-surface-800/30">
            {FEATURES.map((feature, i) => (
              <FeatureDetail key={feature.title} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </div>
      <CTASection />
    </div>
  );
}
