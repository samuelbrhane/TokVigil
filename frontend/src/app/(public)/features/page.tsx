"use client";

import { useInView } from "@/lib/hooks";
import { FEATURES } from "@/lib/constants";
import { CodeBlock, GridBackground } from "@/components/ui";
import { PageHeader } from "@/components/layout";
import { CTASection } from "@/components/landing";

const featureCodeExamples: Record<string, string> = {
  "Policy Engine": `# Policy scoped to free plan + chat feature
policy = tf.policies.create(
    name="free-plan-chat",
    scope_plan="free",
    scope_feature="chat",
    limits={"requests_per_day": 50},
    budget={"max_cost_per_day_usd": 1.00},
    action_on_exceed="block",
)`,
  "Budget Control": `# Per-request cost cap prevents expensive calls
policy = tf.policies.create(
    name="cost-guard",
    per_request={"max_estimated_cost_usd": 0.05},
    budget={
        "max_cost_per_day_usd": 10.00,
        "max_cost_per_month_usd": 100.00,
    },
)`,
  "Usage Analytics": `# Query usage data programmatically
summary = tf.usage.summary(
    group_by="feature",
    start_date="2025-01-01",
    end_date="2025-01-31",
)
for item in summary:
    print(f"{item.feature}: {item.total_cost_usd}")`,
  "Multi-Tenant": `# Separate environments with distinct API keys
# Production: tf_live_xxxxxxxxxxxx
# Development: tf_test_xxxxxxxxxxxx

tf_prod = TokenFence(api_key="tf_live_...")
tf_dev  = TokenFence(api_key="tf_test_...")

# Same policies, isolated usage tracking`,
  "Reason Codes": `try:
    response = tf.chat(user_id="u_123", ...)
except AIUsageBlockedError as e:
    match e.reason_code:
        case "DAILY_BUDGET_EXCEEDED":
            show_upgrade_prompt(e.limit_state)
        case "MODEL_NOT_ALLOWED":
            fallback_to_allowed_model()
        case _:
            log_blocked_request(e)`,
  "SDK-First": `# Python
from tokenfence import TokenFence
tf = TokenFence(api_key="tf_live_...")
response = tf.chat(
    user_id="user_123",
    feature="chat",
    messages=[{"role": "user", "content": "Hello"}],
    model="gpt-4o-mini",
)`,
};

function FeatureDetail({ feature, index }: { feature: (typeof FEATURES)[number]; index: number }) {
  const [ref, visible] = useInView(0.1);
  const isReversed = index % 2 === 1;

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16"
    >
      <div
        className={isReversed ? "lg:order-2" : ""}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateX(0)" : `translateX(${isReversed ? "30px" : "-30px"})`,
          transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="text-3xl mb-4 text-brand-500/80">{feature.icon}</div>
        <h3 className="text-2xl font-bold font-mono text-surface-100 tracking-tight mb-3">
          {feature.title}
        </h3>
        <p className="text-surface-400 leading-relaxed mb-6">{feature.description}</p>
        <ul className="space-y-2.5">
          {feature.details.map((detail) => (
            <li key={detail} className="flex items-start gap-2.5 text-sm text-surface-400">
              <span className="text-brand-500 mt-0.5 text-xs">▸</span>
              {detail}
            </li>
          ))}
        </ul>
      </div>

      <div
        className={isReversed ? "lg:order-1" : ""}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateX(0)" : `translateX(${isReversed ? "-30px" : "30px"})`,
          transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s",
        }}
      >
        <CodeBlock code={featureCodeExamples[feature.title] || "# Coming soon"} language="python" />
      </div>
    </div>
  );
}

export default function FeaturesPage() {
  return (
    <div className="pt-24">
      <div className="relative">
        <GridBackground opacity={0.02} />
        <div className="max-w-6xl mx-auto px-6">
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
