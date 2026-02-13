"use client";

import { useState, useEffect } from "react";
import {
  UsageFilterBar,
  UsageBanner,
  UsageChart,
  UsageBreakdowns,
} from "@/components/usage";

import UsageCallLog from "@/components/usage/UsageCallLog";
import {
  DEFAULT_FILTERS,
  UsageFilters,
} from "@/components/usage/UsageFilterBar";

function AnimateIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {children}
    </div>
  );
}

export default function UsagePage() {
  const [filters, setFilters] = useState<UsageFilters>(DEFAULT_FILTERS);

  const hasScope = filters.workspace_id && filters.environment_id;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Filter Bar */}
      <UsageFilterBar filters={filters} onChange={setFilters} />

      {/* Empty state when no scope selected */}
      {!hasScope && (
        <div className="rounded-2xl border border-surface-700/40 bg-surface-900/60 p-8 sm:p-12 text-center">
          <p className="text-sm font-mono text-surface-400">
            Select a workspace and environment to view usage data
          </p>
        </div>
      )}

      {/* Components */}
      {hasScope && (
        <div className="space-y-6 sm:space-y-8">
          <AnimateIn delay={0}>
            <UsageBanner filters={filters} />
          </AnimateIn>
          <AnimateIn delay={100}>
            <UsageChart filters={filters} />
          </AnimateIn>
          <AnimateIn delay={200}>
            <UsageBreakdowns filters={filters} />
          </AnimateIn>
          <AnimateIn delay={300}>
            <UsageCallLog filters={filters} />
          </AnimateIn>
        </div>
      )}
    </div>
  );
}
