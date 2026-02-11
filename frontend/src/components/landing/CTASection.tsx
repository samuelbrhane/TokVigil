"use client";

import Link from "next/link";
import { useInView } from "@/lib/hooks";
import { Button, GridBackground, FenceMotif } from "@/components/ui";

export default function CTASection() {
  const [ref, visible] = useInView(0.1);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative py-32"
    >
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div
          className="relative p-12 rounded-2xl border border-surface-800/40 bg-surface-900/40 overflow-hidden"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible
              ? "translateY(0) scale(1)"
              : "translateY(20px) scale(0.98)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-brand-500/5" />
          <GridBackground opacity={0.03} />

          <div className="relative">
            <FenceMotif className="justify-center mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-surface-100 font-mono">
              Ready to fence your AI?
            </h2>
            <p className="mt-4 text-surface-400 max-w-md mx-auto">
              Start enforcing usage policies in under 5 minutes. No credit card
              required.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button variant="primary" size="lg">
                  Start Free →
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" size="lg">
                  Talk to Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
