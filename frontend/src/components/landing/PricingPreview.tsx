"use client";

import Link from "next/link";
import { useInView } from "@/lib/hooks";
import { PLANS } from "@/lib/constants";
import { Button } from "@/components/ui";
import { PageHeader } from "@/components/layout";

export default function PricingPreview() {
  const [ref, visible] = useInView(0.1);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="pricing"
      className="relative py-32"
    >
      <div className="max-w-5xl mx-auto px-6">
        <PageHeader
          tag="Pricing"
          title="Simple, predictable"
          highlight="pricing"
          description="Pay for AI requests evaluated, not per seat. Start free, scale when ready."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative group p-6 rounded-xl border transition-all duration-500 ${
                plan.highlighted
                  ? "bg-surface-900/80 border-brand-500/30 shadow-[0_0_40px_rgba(245,158,11,0.06)]"
                  : "bg-surface-900/30 border-surface-800/40 hover:border-surface-700/60"
              }`}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(30px)",
                transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s`,
              }}
            >
              {plan.highlighted && (
                <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent" />
              )}

              <div className="mb-6">
                <h3 className="font-mono font-bold text-surface-300 tracking-tight">
                  {plan.name}
                </h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-surface-100 font-mono">
                    {plan.price}
                  </span>
                  <span className="text-sm text-surface-500 font-mono">
                    {plan.period}
                  </span>
                </div>
                <p className="mt-2 text-sm text-surface-500">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-sm text-surface-400"
                  >
                    <span className="text-brand-500 mt-0.5 text-xs">▸</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link href="/signup">
                <Button
                  variant={plan.highlighted ? "primary" : "secondary"}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
