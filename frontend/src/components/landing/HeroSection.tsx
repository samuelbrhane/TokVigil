"use client";

import Link from "next/link";
import { useInView, useTypingEffect } from "@/lib/hooks";
import { HERO_STATS } from "@/lib/constants";
import { Button, GridBackground } from "@/components/ui";

export default function HeroSection() {
  const [ref, visible] = useInView(0.1);
  const tagline = "ai_call(user, prompt, policy)";
  const { displayed } = useTypingEffect(tagline, 40, visible);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden"
    >
      <GridBackground opacity={0.03} />

      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-500/5 rounded-full blur-[120px]" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <div
          className="transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
          }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-widest uppercase text-brand-400 border border-brand-500/20 bg-brand-500/5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            Now available
          </span>
        </div>

        <h1
          className="mt-8 text-5xl md:text-7xl font-bold tracking-tight text-surface-100 leading-[1.1] font-mono"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(40px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
          }}
        >
          Stop AI cost leaks.
          <br />
          <span className="text-brand-500">Ship with control.</span>
        </h1>

        <p
          className="mt-6 text-lg md:text-xl text-surface-400 max-w-2xl mx-auto leading-relaxed"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.25s",
          }}
        >
          Enforce budgets, rate limits, and policies on every AI call - per
          user, per feature, per plan. Three lines of code.
        </p>

        {/* Typed code line */}
        <div
          className="mt-10 inline-flex items-center gap-3 px-5 py-3 bg-surface-900/80 border border-surface-800/60 rounded-xl font-mono"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.8s ease 0.4s",
          }}
        >
          <span className="text-brand-500/60 text-sm">→</span>
          <span className="text-sm text-surface-300">
            {displayed}
            <span className="inline-block w-2 h-4 bg-brand-500 ml-0.5 animate-pulse" />
          </span>
        </div>

        <div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
          }}
        >
          <Link href="/signup">
            <Button variant="primary" size="lg">
              Get Started Free →
            </Button>
          </Link>
          <Link href="/docs">
            <Button variant="secondary" size="lg">
              View Documentation
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div
          className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 1s ease 0.7s",
          }}
        >
          {HERO_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-surface-200 font-mono">
                {stat.value}
              </div>
              <div className="text-xs text-surface-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
