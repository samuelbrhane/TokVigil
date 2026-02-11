"use client";

import { useState } from "react";
import { useInView } from "@/lib/hooks";
import { STEPS } from "@/lib/constants";
import { CodeBlock, GridBackground } from "@/components/ui";
import { PageHeader } from "@/components/layout";

export default function HowItWorks() {
  const [ref, visible] = useInView(0.1);
  const [activeStep, setActiveStep] = useState(0);
  const [lang, setLang] = useState<"python" | "typescript">("python");

  const step = STEPS[activeStep];

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="how-it-works"
      className="relative py-32"
    >
      <GridBackground opacity={0.02} />

      <div className="max-w-7xl mx-auto px-6">
        <PageHeader
          tag="Integration"
          title="Three steps to"
          highlight="full control"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Steps */}
          <div className="space-y-2">
            {STEPS.map((s, i) => (
              <button
                key={s.num}
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
                    {s.num}
                  </span>
                  <div>
                    <h3
                      className={`font-bold font-mono tracking-tight ${
                        activeStep === i
                          ? "text-surface-100"
                          : "text-surface-400"
                      }`}
                    >
                      {s.title}
                    </h3>
                    <p
                      className={`text-sm mt-1 leading-relaxed ${
                        activeStep === i
                          ? "text-surface-400"
                          : "text-surface-600"
                      }`}
                    >
                      {s.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Code with language toggle */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(30px)",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
            }}
          >
            {/* Language tabs */}
            <div className="flex gap-1 mb-3">
              {(["python", "typescript"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-colors ${
                    lang === l
                      ? "bg-brand-500/10 text-brand-400 border border-brand-500/20"
                      : "text-surface-500 hover:text-surface-300 border border-transparent"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <CodeBlock
              code={step[lang]}
              language={lang === "python" ? "python" : "typescript"}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
