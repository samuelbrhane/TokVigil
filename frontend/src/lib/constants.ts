// ============================================================
// BRAND CONSTANTS
// ============================================================
export const BRAND = {
  name: "TokenFence",
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
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
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
    title: "Install the SDK",
    code: `pip install tokenfence`,
    description: "Add TokenFence to your project in seconds.",
  },
  {
    num: "02",
    title: "Wrap your AI calls",
    code: `from tokenfence import TokenFence

tf = TokenFence(api_key="tf_live_...")

response = tf.chat(
    user_id="user_123",
    feature="chat",
    messages=[{"role": "user", "content": prompt}],
    model="gpt-4o-mini",
)`,
    description:
      "Replace direct LLM calls with controlled calls. TokenFence evaluates policies, calls the model, and logs usage.",
  },
  {
    num: "03",
    title: "Monitor & enforce",
    code: `# Blocked requests raise clear errors
try:
    response = tf.chat(...)
except AIUsageBlockedError as e:
    print(e.reason_code)
    # "FREE_PLAN_DAILY_CAP_EXCEEDED"
    print(e.retry_after)
    # 3600 seconds`,
    description:
      "View usage in VS Code, the dashboard, or via API. Policies enforce automatically.",
  },
] as const;

// ============================================================
// PRICING PLANS
// ============================================================
export const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "For solo developers exploring AI integration",
    features: [
      "1 workspace",
      "1,000 AI requests/month",
      "Basic analytics",
      "Community support",
      "1 environment",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "For teams shipping AI-powered products",
    features: [
      "5 workspaces",
      "100,000 AI requests/month",
      "Advanced analytics",
      "Webhooks & alerts",
      "3 environments",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations with complex compliance needs",
    features: [
      "Unlimited workspaces",
      "Unlimited AI requests",
      "Full audit logs",
      "SSO & RBAC",
      "Unlimited environments",
      "Dedicated support & SLA",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
] as const;

// ============================================================
// PRICING FAQ
// ============================================================
export const PRICING_FAQ = [
  {
    question: "What counts as an AI request?",
    answer:
      "One AI request = one evaluate call + one usage log. When your SDK calls tf.chat(), it evaluates the policy and logs usage — that counts as 1 AI request.",
  },
  {
    question: "Can I switch plans anytime?",
    answer:
      "Yes. Upgrade or downgrade at any time. Changes take effect immediately, and we pro-rate billing.",
  },
  {
    question: "What happens when I hit my limit?",
    answer:
      "On the Free plan, additional evaluate calls return PLAN_LIMIT_EXCEEDED. On Pro, you can configure overage behavior — block or allow with alerts.",
  },
  {
    question: "Do you store my LLM prompts or responses?",
    answer:
      "No. TokenFence only sees token counts, costs, and metadata. Your prompts and responses go directly between your app and the LLM provider.",
  },
  {
    question: "Can I use my own API keys (BYOK)?",
    answer:
      "Yes. Pass your own OpenAI/Anthropic key to the SDK. TokenFence still tracks usage and enforces policies — you just pay the LLM provider directly.",
  },
] as const;

// ============================================================
// FEATURE COMPARISON TABLE
// ============================================================
export const FEATURE_COMPARISON = [
  { feature: "Workspaces", free: "1", pro: "5", enterprise: "Unlimited" },
  {
    feature: "AI Requests/month",
    free: "1,000",
    pro: "100,000",
    enterprise: "Unlimited",
  },
  { feature: "Environments", free: "1", pro: "3", enterprise: "Unlimited" },
  { feature: "Policies", free: "5", pro: "Unlimited", enterprise: "Unlimited" },
  {
    feature: "Usage Analytics",
    free: "Basic",
    pro: "Advanced",
    enterprise: "Advanced",
  },
  { feature: "Webhooks", free: "—", pro: "✓", enterprise: "✓" },
  { feature: "Audit Logs", free: "—", pro: "30 days", enterprise: "1 year" },
  { feature: "SSO / RBAC", free: "—", pro: "—", enterprise: "✓" },
  {
    feature: "Support",
    free: "Community",
    pro: "Priority",
    enterprise: "Dedicated + SLA",
  },
  {
    feature: "Export Data",
    free: "—",
    pro: "CSV",
    enterprise: "CSV + JSON + API",
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
      { label: "Pricing", href: "/pricing" },
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
      { label: "GitHub", href: "https://github.com/tokenfence" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
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
  { label: "Billing", href: "/dashboard/billing", icon: "credit-card" },
] as const;
