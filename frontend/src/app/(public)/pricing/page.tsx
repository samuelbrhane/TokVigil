"use client";

import { useState } from "react";
import Link from "next/link";
import { useInView } from "@/lib/hooks";
import { PLANS, FEATURE_COMPARISON, PRICING_FAQ } from "@/lib/constants";
import { Button, GridBackground } from "@/components/ui";
import { PageHeader } from "@/components/layout";
import { CTASection } from "@/components/landing";

function PlanCards() {
  const [ref, visible] = useInView(0.1);

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-24">
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
            <>
              <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent" />
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-brand-500 text-surface-950 text-[10px] font-mono font-bold uppercase tracking-wider">
                Most Popular
              </div>
            </>
          )}
          <div className="mb-6">
            <h3 className="font-mono font-bold text-surface-300 tracking-tight">{plan.name}</h3>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-surface-100 font-mono">{plan.price}</span>
              <span className="text-sm text-surface-500 font-mono">{plan.period}</span>
            </div>
            <p className="mt-2 text-sm text-surface-500">{plan.description}</p>
          </div>
          <ul className="space-y-3 mb-8">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-surface-400">
                <span className="text-brand-500 mt-0.5 text-xs">▸</span>
                {f}
              </li>
            ))}
          </ul>
          <Link href="/signup">
            <Button variant={plan.highlighted ? "primary" : "secondary"} className="w-full">
              {plan.cta}
            </Button>
          </Link>
        </div>
      ))}
    </div>
  );
}

function ComparisonTable() {
  const [ref, visible] = useInView(0.1);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="mb-24"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <h3 className="text-xl font-bold font-mono text-surface-100 text-center mb-8">
        Feature Comparison
      </h3>
      <div className="overflow-x-auto rounded-xl border border-surface-800/40">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-800/40">
              <th className="text-left px-5 py-3 text-xs font-mono font-bold text-surface-400 uppercase tracking-wider">
                Feature
              </th>
              <th className="text-center px-5 py-3 text-xs font-mono font-bold text-surface-400 uppercase tracking-wider">
                Free
              </th>
              <th className="text-center px-5 py-3 text-xs font-mono font-bold text-brand-400 uppercase tracking-wider bg-brand-500/5">
                Pro
              </th>
              <th className="text-center px-5 py-3 text-xs font-mono font-bold text-surface-400 uppercase tracking-wider">
                Enterprise
              </th>
            </tr>
          </thead>
          <tbody>
            {FEATURE_COMPARISON.map((row, i) => (
              <tr
                key={row.feature}
                className={`border-b border-surface-800/20 ${i % 2 === 0 ? "bg-surface-900/20" : ""}`}
              >
                <td className="px-5 py-3 text-sm text-surface-300 font-mono">{row.feature}</td>
                <td className="px-5 py-3 text-sm text-surface-500 text-center font-mono">{row.free}</td>
                <td className="px-5 py-3 text-sm text-surface-300 text-center font-mono bg-brand-500/5">
                  {row.pro}
                </td>
                <td className="px-5 py-3 text-sm text-surface-500 text-center font-mono">{row.enterprise}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [ref, visible] = useInView(0.1);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="max-w-2xl mx-auto mb-16"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.7s ease",
      }}
    >
      <h3 className="text-xl font-bold font-mono text-surface-100 text-center mb-8">
        Frequently Asked Questions
      </h3>
      <div className="space-y-2">
        {PRICING_FAQ.map((faq, i) => (
          <button
            key={i}
            className="w-full text-left p-5 rounded-xl border border-surface-800/30 hover:border-surface-700/50 transition-all duration-300 bg-surface-900/20"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono font-medium text-surface-200">{faq.question}</span>
              <span className={`text-surface-500 text-xs transition-transform duration-200 ${openIndex === i ? "rotate-180" : ""}`}>
                ▾
              </span>
            </div>
            {openIndex === i && (
              <p className="mt-3 text-sm text-surface-500 leading-relaxed animate-slide-up">
                {faq.answer}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className="pt-24">
      <div className="relative">
        <GridBackground opacity={0.02} />
        <div className="max-w-5xl mx-auto px-6">
          <PageHeader
            tag="Pricing"
            title="Simple, predictable"
            highlight="pricing"
            description="Pay for AI requests evaluated, not per seat. Start free, scale when ready."
          />
          <PlanCards />
          <ComparisonTable />
          <FAQSection />
        </div>
      </div>
      <CTASection />
    </div>
  );
}
