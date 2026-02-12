"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { BarChart } from "@/components/charts";
import {
  UsageByGroup,
  getUsageByModel,
  getUsageByFeature,
} from "@/lib/dashboard";
import { UsageFilters } from "@/components/usage/UsageFilterBar";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

const COLORS = [
  "text-cyan-400",
  "text-violet-400",
  "text-amber-400",
  "text-emerald-400",
  "text-rose-400",
  "text-indigo-400",
];

const BAR_COLORS = [
  "bg-cyan-500",
  "bg-violet-500",
  "bg-amber-400",
  "bg-emerald-500",
  "bg-rose-500",
  "bg-indigo-500",
];

function BreakdownList({
  title,
  items,
  loading,
  metric,
  onMetricChange,
}: {
  title: string;
  items: UsageByGroup[];
  loading: boolean;
  metric: "requests" | "tokens" | "cost_usd";
  onMetricChange: (m: "requests" | "tokens" | "cost_usd") => void;
}) {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="h-56 animate-pulse rounded-lg bg-surface-800/20" />
      </Card>
    );
  }

  const total = items.reduce((sum, i) => {
    if (metric === "requests") return sum + i.requests;
    if (metric === "tokens") return sum + i.tokens;
    return sum + i.cost_usd;
  }, 0);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-mono font-bold text-white">{title}</h3>
        <div className="flex gap-1">
          {(["requests", "tokens", "cost_usd"] as const).map((m) => (
            <button
              key={m}
              onClick={() => onMetricChange(m)}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                metric === m
                  ? "bg-brand-500/15 text-brand-300 border border-brand-500/30"
                  : "text-surface-400 hover:text-white"
              }`}
            >
              {m === "cost_usd" ? "cost" : m}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-surface-500 font-mono">No data yet</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => {
            const value =
              metric === "requests"
                ? item.requests
                : metric === "tokens"
                  ? item.tokens
                  : item.cost_usd;
            const pct = total > 0 ? (value / total) * 100 : 0;

            return (
              <div key={item.group} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono text-surface-200">
                    {item.group}
                  </span>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-mono font-bold ${COLORS[i % COLORS.length]}`}
                    >
                      {metric === "cost_usd"
                        ? `$${value.toFixed(2)}`
                        : formatNumber(value)}
                    </span>
                    <span className="text-[11px] font-mono text-surface-500 w-12 text-right">
                      {pct.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden bg-surface-800/60">
                  <div
                    className={`h-full rounded-full ${BAR_COLORS[i % BAR_COLORS.length]} transition-all duration-700 ease-out`}
                    style={{ width: `${Math.max(pct, 1)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

interface UsageBreakdownsProps {
  filters: UsageFilters;
}

export default function UsageBreakdowns({ filters }: UsageBreakdownsProps) {
  const [models, setModels] = useState<UsageByGroup[]>([]);
  const [features, setFeatures] = useState<UsageByGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [modelMetric, setModelMetric] = useState<
    "requests" | "tokens" | "cost_usd"
  >("requests");
  const [featureMetric, setFeatureMetric] = useState<
    "requests" | "tokens" | "cost_usd"
  >("requests");

  useEffect(() => {
    if (!filters.workspace_id || !filters.environment_id) return;

    const load = async () => {
      setLoading(true);
      try {
        const [modelData, featureData] = await Promise.all([
          getUsageByModel(
            filters.workspace_id!,
            filters.environment_id!,
            1,
            10,
            filters.user_id,
          ),
          getUsageByFeature(
            filters.workspace_id!,
            filters.environment_id!,
            1,
            10,
            filters.user_id,
          ),
        ]);
        setModels(modelData.items);
        setFeatures(featureData.items);
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters.workspace_id, filters.environment_id, filters.user_id]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <BreakdownList
        title="By Model"
        items={models}
        loading={loading}
        metric={modelMetric}
        onMetricChange={setModelMetric}
      />
      <BreakdownList
        title="By Feature"
        items={features}
        loading={loading}
        metric={featureMetric}
        onMetricChange={setFeatureMetric}
      />
    </div>
  );
}
