"use client";

import { useState } from "react";
import Link from "next/link";
import { useInView } from "@/lib/hooks";
import { PLANS } from "@/lib/constants";
import { Button } from "@/components/ui";
import { PageHeader } from "@/components/layout";

export default function PricingPreview() {
  const [ref, visible] = useInView(0.1);
  const [selected, setSelected] = useState(2); // Premium selected by default

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="pricing"
      className="relative py-32"
    >
      <div className="max-w-7xl mx-auto px-6">
        <PageHeader
          tag="Pricing"
          title="Simple, predictable"
          highlight="pricing"
          description="Pay for evaluate calls, not per seat. Start free, scale when ready."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map((plan, i) => {
            const isSelected = selected === i;

            return (
              <button
                key={plan.name}
                onClick={() => setSelected(i)}
                className={`relative text-left p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "bg-surface-900/80 border-brand-500/40 shadow-[0_0_40px_rgba(6,182,212,0.08)] scale-[1.02]"
                    : "bg-surface-900/30 border-surface-800/40 hover:border-surface-700/60"
                }`}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible
                    ? isSelected
                      ? "translateY(0) scale(1.02)"
                      : "translateY(0) scale(1)"
                    : "translateY(30px) scale(1)",
                  transition: `all 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s`,
                }}
              >
                {/* Selected indicator */}
                {isSelected && (
                  <>
                    <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent" />
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-brand-500 text-surface-950 text-[10px] font-mono font-bold uppercase tracking-wider">
                      Selected
                    </div>
                  </>
                )}

                {/* Radio indicator */}
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className={`font-mono font-bold tracking-tight ${isSelected ? "text-brand-400" : "text-surface-300"}`}
                  >
                    {plan.name}
                  </h3>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected ? "border-brand-500" : "border-surface-700"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-brand-500" />
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-4xl font-bold font-mono ${isSelected ? "text-surface-100" : "text-surface-300"}`}
                    >
                      {plan.price}
                    </span>
                    <span className="text-sm text-surface-500 font-mono">
                      {plan.period}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-surface-500">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-sm text-surface-400"
                    >
                      <span
                        className={`mt-0.5 text-xs ${isSelected ? "text-brand-500" : "text-surface-600"}`}
                      >
                        ▸
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = "/signup";
                  }}
                  className={`w-full text-center py-2.5 px-5 rounded-lg font-mono font-semibold text-sm tracking-wide transition-all duration-300 ${
                    isSelected
                      ? "bg-brand-500 text-surface-950 hover:bg-brand-400"
                      : "bg-surface-800/80 text-surface-200 border border-surface-700/50 hover:border-brand-500/30 hover:text-brand-400"
                  }`}
                >
                  {plan.cta}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
