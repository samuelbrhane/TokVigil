// ============================================================
// BRAND CONSTANTS
// ============================================================
export const BRAND = {
  name: "UsageSentinel",
  tagline: "AI usage control for production teams",
  description:
    "Application-layer AI usage control. Enforce budgets, limits, and policies inside your code.",
  url: "https://tokenfence.io",
};

// ============================================================
// NAVIGATION
// ============================================================
export const NAV_LINKS = [
  { label: "Features", href: "/features" },
  { label: "Docs", href: "/docs" },
  { label: "About", href: "/about" },
] as const;
// ============================================================
// FEATURES
// ============================================================
export const FEATURES = [
  {
    icon: "⬡",
    title: "Policy Engine",
    description:
      "Define rules per user, plan, and feature. The engine enforces limits, budgets, and model restrictions automatically.",
    details: [
      "Scope policies by plan, feature, environment, or individual user",
      "Priority-based conflict resolution when multiple policies match",
      "Action on exceed: block or throttle",
      "Machine-readable reason codes on every decision",
    ],
  },
  {
    icon: "◈",
    title: "Budget Control",
    description:
      "Set per-request, daily, and monthly cost caps. Never wake up to a surprise AI bill again.",
    details: [
      "Per-request cost caps to prevent expensive single calls",
      "Daily and monthly spend limits per user or feature",
      "Real-time cost estimation before each LLM call",
      "Model-specific pricing tables with automatic updates",
    ],
  },
  {
    icon: "⬢",
    title: "Usage Analytics",
    description:
      "Track tokens, costs, and requests across users and features. Know exactly where your AI spend goes.",
    details: [
      "Per-user, per-feature, per-model usage breakdowns",
      "Time-series charts for daily and monthly trends",
      "Blocked request logs with reason codes",
      "Export to CSV or JSON for external analysis",
    ],
  },
  {
    icon: "⎔",
    title: "Multi-Tenant",
    description:
      "Workspaces, environments, and API keys. Isolate dev from prod, team from team.",
    details: [
      "Workspace-level isolation for different teams or products",
      "Environment separation: dev, staging, production",
      "Per-environment API keys with prefix identification",
      "Independent policy sets per environment",
    ],
  },
  {
    icon: "◇",
    title: "Reason Codes",
    description:
      "Every blocked request comes with a machine-readable reason. Debug enforcement issues in seconds.",
    details: [
      "13+ specific reason codes (MODEL_NOT_ALLOWED, DAILY_BUDGET_EXCEEDED, etc.)",
      "Limit state included with every response",
      "Retry-after hints for rate-limited requests",
      "Full audit trail of all decisions",
    ],
  },
  {
    icon: "⏣",
    title: "SDK-First",
    description:
      "Python & TypeScript SDKs wrap your LLM calls. Three lines of code to full governance.",
    details: [
      "Python SDK: pip install tokenfence",
      "TypeScript SDK: npm install tokenfence",
      "OpenAI adapter built-in, more coming soon",
      "BYOK (Bring Your Own Key) with consistent tracking",
    ],
  },
] as const;

// ============================================================
// HOW IT WORKS STEPS
// ============================================================
export const STEPS = [
  {
    num: "01",
    title: "Install & initialize",
    description:
      "Add the SDK and connect to your UsageSentinel workspace with one API key.",
    python: `pip install tokenfence

from tokenfence import UsageSentinel

tf = UsageSentinel(api_key="tf_live_...")`,
    typescript: `npm install tokenfence

import { UsageSentinel } from "tokenfence";

const tf = new UsageSentinel({ apiKey: "tf_live_..." });`,
  },
  {
    num: "02",
    title: "Evaluate, call, and log",
    description:
      "Check policies before each AI call, then log usage automatically. One function handles the full flow.",
    python: `# Check → Call AI → Log usage (all in one)
result, response = tf.check_and_call(
    user_id="user_123",
    model="gpt-4o-mini",
    plan="free",
    feature="chat",
    ai_function=lambda: openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": "Hello"}]
    )
)

if result.allowed:
    print(response.choices[0].message.content)
else:
    print(f"Blocked: {result.reason_code}")`,
    typescript: `// Check → Call AI → Log usage (all in one)
const { result, response } = await tf.checkAndCall(
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

if (result.allowed && response) {
  console.log(response.choices[0].message.content);
} else {
  console.log(\`Blocked: \${result.reasonCode}\`);
}`,
  },
  {
    num: "03",
    title: "Monitor & enforce",
    description:
      "Track usage, catch blocked requests, and handle errors from code, VS Code, or the dashboard.",
    python: `# Usage summary
summary = tf.get_usage_summary()
print(f"Requests: {summary.total_requests}")
print(f"Cost: \${summary.total_cost_usd}")

# Check blocked requests
blocked = tf.get_blocked_requests()
for record in blocked.items:
    print(f"{record.user_id}: {record.reason_code}")`,
    typescript: `// Usage summary
const summary = await tf.getUsageSummary();
console.log(\`Requests: \${summary.totalRequests}\`);
console.log(\`Cost: $\${summary.totalCostUsd}\`);

// Check blocked requests  
const blocked = await tf.getBlockedRequests();
for (const record of blocked.items) {
  console.log(\`\${record.userId}: \${record.reasonCode}\`);
}`,
  },
] as const;

// In constants.ts — update PLANS names:
export const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "For solo developers exploring AI integration",
    features: [
      "1 workspace",
      "2 API keys",
      "1,000 evaluate calls/month",
      "100 requests/min",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For solo developers shipping AI features",
    features: [
      "3 workspaces",
      "10 API keys",
      "50,000 evaluate calls/month",
      "500 requests/min",
      "Audit logs",
    ],
    cta: "Start Pro",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "$29",
    period: "/month",
    description: "For teams running AI in production at scale",
    features: [
      "10 workspaces",
      "50 API keys",
      "500,000 evaluate calls/month",
      "2,000 requests/min",
      "Audit logs",
      "Priority support",
    ],
    cta: "Start Premium",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For organizations needing full control",
    features: [
      "Unlimited workspaces",
      "Unlimited API keys",
      "Unlimited evaluate calls",
      "10,000 requests/min",
      "Audit logs",
      "Priority support",
    ],
    cta: "Start Enterprise",
    highlighted: false,
  },
] as const;

// Update FEATURE_COMPARISON column names too:
export const FEATURE_COMPARISON = [
  {
    feature: "Workspaces",
    free: "1",
    pro: "3",
    premium: "10",
    enterprise: "Unlimited",
  },
  {
    feature: "API Keys",
    free: "2",
    pro: "10",
    premium: "50",
    enterprise: "Unlimited",
  },
  {
    feature: "Evaluate Calls/month",
    free: "1,000",
    pro: "50,000",
    premium: "500,000",
    enterprise: "Unlimited",
  },
  {
    feature: "Rate Limit (req/min)",
    free: "100",
    pro: "500",
    premium: "2,000",
    enterprise: "10,000",
  },

  { feature: "Audit Logs", free: "—", pro: "✓", premium: "✓", enterprise: "✓" },
  {
    feature: "Priority Support",
    free: "—",
    pro: "—",
    premium: "✓",
    enterprise: "✓",
  },
] as const;

export const PRICING_FAQ = [
  {
    question: "What counts as an evaluate call?",
    answer:
      "One evaluate call = one POST to /api/v1/evaluate. When your SDK calls tf.evaluate() or tf.checkAndCall(), that counts as 1 evaluate call. Usage logging (POST /api/v1/usage) does not count toward your limit.",
  },
  {
    question: "Can I switch plans anytime?",
    answer:
      "Yes. Upgrade or downgrade at any time. Changes take effect immediately, and we pro-rate billing.",
  },
  {
    question: "What happens when I hit my evaluate call limit?",
    answer:
      "Additional evaluate calls return PLAN_LIMIT_EXCEEDED. You can upgrade your plan or wait for the monthly reset.",
  },
  {
    question: "Do you store my LLM prompts or responses?",
    answer:
      "No. UsageSentinel only sees token counts, costs, and metadata. Your prompts and responses go directly between your app and the LLM provider.",
  },
  {
    question: "What does the rate limit apply to?",
    answer:
      "The rate limit applies to API calls per minute per API key. This protects both your account and the platform from abuse or runaway scripts.",
  },
] as const;
// ============================================================
// STATS (landing page hero)
// ============================================================
export const HERO_STATS = [
  { value: "12M+", label: "Requests evaluated" },
  { value: "200+", label: "Teams" },
  { value: "99.9%", label: "Uptime" },
] as const;

// ============================================================
// FOOTER
// ============================================================
export const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Documentation", href: "/docs" },
      { label: "VS Code Extension", href: "/docs/vscode-extension" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Python SDK", href: "/docs/sdk/python" },
      { label: "TypeScript SDK", href: "/docs/sdk/typescript" },
      { label: "API Reference", href: "/docs/api-reference" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
] as const;
// ============================================================
// DASHBOARD SIDEBAR NAV
// ============================================================
export const DASHBOARD_NAV = [
  { label: "Overview", href: "/dashboard", icon: "grid" },
  { label: "Usage", href: "/dashboard/usage", icon: "chart" },
  { label: "Policies", href: "/dashboard/policies", icon: "shield" },
  { label: "API Keys", href: "/dashboard/api-keys", icon: "key" },
  { label: "Workspaces", href: "/dashboard/workspaces", icon: "layers" },
] as const;

export const DASHBOARD_NAV_BOTTOM = [
  { label: "Settings", href: "/dashboard/settings", icon: "settings" },
  // { label: "Billing", href: "/dashboard/billing", icon: "credit-card" },
] as const;
