"use client";

import { useState } from "react";
import { useInView } from "@/lib/hooks";
import { STEPS } from "@/lib/constants";
import { CodeBlock, GridBackground } from "@/components/ui";
import { PageHeader } from "@/components/layout";

export default function HowItWorks() {
  const [ref, visible] = useInView(0.1);
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="how-it-works"
      className="relative py-32"
    >
      <GridBackground opacity={0.02} />

      <div className="max-w-6xl mx-auto px-6">
        <PageHeader
          tag="Integration"
          title="Three steps to"
          highlight="full control"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Steps */}
          <div className="space-y-2">
            {STEPS.map((step, i) => (
              <button
                key={step.num}
                onClick={() => setActiveStep(i)}
                className={`w-full text-left p-5 rounded-xl border transition-all duration-300 ${
                  activeStep === i
                    ? "bg-surface-900/80 border-brand-500/30"
                    : "bg-transparent border-surface-800/30 hover:border-surface-700/50"
                }`}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateX(0)" : "translateX(-30px)",
                  transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s`,
                }}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`font-mono text-sm font-bold mt-0.5 ${
                      activeStep === i ? "text-brand-500" : "text-surface-600"
                    }`}
                  >
                    {step.num}
                  </span>
                  <div>
                    <h3
                      className={`font-bold font-mono tracking-tight ${
                        activeStep === i ? "text-surface-100" : "text-surface-400"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={`text-sm mt-1 leading-relaxed ${
                        activeStep === i ? "text-surface-400" : "text-surface-600"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Code */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(30px)",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
            }}
          >
            <CodeBlock code={STEPS[activeStep].code} language="python" />
          </div>
        </div>
      </div>
    </section>
  );
}
