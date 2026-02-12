"use client";

import { useState } from "react";
import UsageFilterBar, {
  UsageFilters,
  DEFAULT_FILTERS,
} from "@/components/usage/UsageFilterBar";

export default function UsagePage() {
  const [filters, setFilters] = useState<UsageFilters>(DEFAULT_FILTERS);

  const hasScope = filters.workspace_id && filters.environment_id;

  return (
    <div className="space-y-8">
      {/* Filter Bar */}
      <UsageFilterBar filters={filters} onChange={setFilters} />

      {/* Empty state when no scope selected */}
      {!hasScope && (
        <div className="rounded-2xl border border-surface-700/40 bg-surface-900/60 p-12 text-center">
          <p className="text-sm font-mono text-surface-400">
            Select a workspace and environment to view usage data
          </p>
        </div>
      )}

      {/* Components will be added here step by step */}
      {hasScope && (
        <div className="space-y-8">
          {/* TODO: UsageBanner */}
          {/* TODO: UsageChart */}
          {/* TODO: ByModel / ByFeature breakdowns */}
          {/* TODO: Recent calls table */}
        </div>
      )}
    </div>
  );
}
