"use client";

import { useInView } from "@/lib/hooks";
import { GridBackground, FenceMotif } from "@/components/ui";
import { PageHeader } from "@/components/layout";
import { CTASection } from "@/components/landing";

const values = [
  {
    title: "SDK-first",
    description:
      "Control belongs in your code, not in a separate dashboard you check once a month. Developers integrate TokVigil in 3 lines policies enforce automatically from there.",
  },
  {
    title: "Transparent by default",
    description:
      "Every decision comes with a reason code. Every blocked request is logged. No black boxes, no guessing why something was denied.",
  },
  {
    title: "Built for real products",
    description:
      "TokVigil exists because teams shipping AI in production kept solving the same problems rate limits, cost spikes, per-user tracking. We built the tool we needed.",
  },
];

export default function AboutPage() {
  const [ref, visible] = useInView(0.1);
  const [valuesRef, valuesVisible] = useInView(0.1);

  return (
    <div className="pt-24">
      <div className="relative">
        <GridBackground opacity={0.02} />
        <div className="max-w-7xl mx-auto px-6">
          <PageHeader
            tag="About"
            title="AI usage control"
            highlight="for production teams"
          />

          {/* Story */}
          <div
            ref={ref as React.RefObject<HTMLDivElement>}
            className="max-w-2xl mx-auto mb-24"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div className="space-y-6 text-surface-400 leading-relaxed">
              <p>
                TokVigil is an application-layer control plane that helps teams
                enforce business rules around AI usage per user, per feature,
                per plan consistently across services.
              </p>
              <p>
                When AI ships inside real products, teams face free-tier abuse,
                cost spikes, no per-user visibility, and duplicated guardrail
                logic across services. Infrastructure-level tools can&apos;t
                reliably enforce business logic. TokVigil does.
              </p>
              <p>
                Developers make a controlled call through our SDK. The platform
                evaluates policies, enforces limits and budgets, and logs
                everything with clear reason codes on every decision.
              </p>
            </div>

            <FenceMotif className="mt-8" />
          </div>

          {/* Values */}
          <div
            ref={valuesRef as React.RefObject<HTMLDivElement>}
            className="mb-24"
          >
            <h3 className="text-xl font-bold font-mono text-surface-100 text-center mb-12">
              How we build
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((value, i) => (
                <div
                  key={value.title}
                  className="p-6 rounded-xl border border-surface-800/40 bg-surface-900/30"
                  style={{
                    opacity: valuesVisible ? 1 : 0,
                    transform: valuesVisible
                      ? "translateY(0)"
                      : "translateY(20px)",
                    transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s`,
                  }}
                >
                  <h4 className="text-sm font-bold font-mono text-brand-400 mb-3">
                    {value.title}
                  </h4>
                  <p className="text-sm text-surface-500 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tech stack */}
          {/* <div className="max-w-3xl mx-auto mb-24 text-center">
            <h3 className="text-xl font-bold font-mono text-surface-100 mb-6">
              Built with
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "FastAPI",
                "PostgreSQL",
                "Redis",
                "Python SDK",
                "TypeScript SDK",
                "VS Code Extension",
                "Next.js",
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-lg bg-surface-900/60 border border-surface-800/40 text-xs font-mono text-surface-400"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div> */}
        </div>
      </div>

      <CTASection />
    </div>
  );
}
