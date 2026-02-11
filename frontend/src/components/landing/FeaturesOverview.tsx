"use client";

import { useInView } from "@/lib/hooks";
import { FEATURES } from "@/lib/constants";
import { PageHeader } from "@/components/layout";

export default function FeaturesOverview() {
  const [ref, visible] = useInView(0.1);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="features"
      className="relative py-32"
    >
      <div className="max-w-7xl mx-auto px-6">
        <PageHeader
          tag="Capabilities"
          title="Everything you need to"
          highlight="govern AI usage"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-xl border border-surface-800/40 bg-surface-900/30 hover:bg-surface-900/60 hover:border-brand-500/20 transition-all duration-500"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(30px)",
                transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s`,
              }}
            >
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="text-2xl mb-4 text-brand-500/70 group-hover:text-brand-400 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-surface-200 font-mono tracking-tight mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-surface-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
