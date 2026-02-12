"use client";

import { useEffect, useState } from "react";
import {
  UsageSummary,
  getUsageSummary,
  UsageByGroup,
  getUsageByFeature,
} from "@/lib/dashboard";
import { UsageFilters } from "@/components/usage/UsageFilterBar";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function StatCard({
  label,
  value,
  sub,
  iconColor,
  valueColor = "text-white",
  subColor = "text-surface-400",
}: {
  label: string;
  value: string;
  sub: string;
  iconColor: string;
  valueColor?: string;
  subColor?: string;
}) {
  return (
    <div className="relative flex-1 px-5 py-5 group">
      <div
        className={`absolute top-0 left-5 right-5 h-px ${iconColor} opacity-40`}
      />
      <p className="text-[11px] font-mono text-surface-400 uppercase tracking-wider">
        {label}
      </p>
      <p className={`text-2xl font-bold font-mono mt-2 ${valueColor}`}>
        {value}
      </p>
      <p className={`text-xs font-mono mt-1 ${subColor}`}>{sub}</p>
    </div>
  );
}

const DISTRIBUTION_COLORS = [
  { bg: "bg-cyan-500", dot: "bg-cyan-500", text: "text-cyan-400" },
  { bg: "bg-violet-500", dot: "bg-violet-500", text: "text-violet-400" },
  { bg: "bg-amber-400", dot: "bg-amber-400", text: "text-amber-400" },
  { bg: "bg-emerald-500", dot: "bg-emerald-500", text: "text-emerald-400" },
  { bg: "bg-rose-500", dot: "bg-rose-500", text: "text-rose-400" },
  { bg: "bg-indigo-500", dot: "bg-indigo-500", text: "text-indigo-400" },
];

interface UsageBannerProps {
  filters: UsageFilters;
}

export default function UsageBanner({ filters }: UsageBannerProps) {
  const [summary, setSummary] = useState<UsageSummary | null>(null);
  const [features, setFeatures] = useState<UsageByGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!filters.workspace_id || !filters.environment_id) return;

    const load = async () => {
      setLoading(true);
      try {
        const [summaryData, featureData] = await Promise.all([
          getUsageSummary(filters.workspace_id!, filters.environment_id!),
          getUsageByFeature(
            filters.workspace_id!,
            filters.environment_id!,
            1,
            10,
          ),
        ]);
        setSummary(summaryData);
        setFeatures(featureData.items);
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters.workspace_id, filters.environment_id]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-surface-700/40 bg-surface-900/60 h-52 animate-pulse" />
    );
  }

  if (!summary) return null;

  const totalRequests = summary.total_requests;
  const totalTokens = summary.total_tokens;
  const totalCost = summary.total_cost_usd;
  const allowedCount = summary.allowed_count;
  const blockedCount = summary.blocked_count;
  const blockRate =
    totalRequests > 0
      ? ((blockedCount / totalRequests) * 100).toFixed(1)
      : "0.0";

  const totalFeatureRequests = features.reduce((sum, f) => sum + f.requests, 0);
  const featureDistribution = features.map((f) => ({
    name: f.group,
    pct:
      totalFeatureRequests > 0
        ? Math.round((f.requests / totalFeatureRequests) * 100)
        : 0,
  }));

  return (
    <div className="relative rounded-2xl border border-surface-700/40 bg-gradient-to-br from-surface-900/80 via-surface-950 to-surface-900/60 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative grid grid-cols-2 md:grid-cols-5 divide-x divide-surface-700/40 border-b border-surface-700/40">
        <StatCard
          label="Total Requests"
          value={formatNumber(totalRequests)}
          sub={`${allowedCount.toLocaleString()} allowed`}
          iconColor="bg-cyan-500"
          valueColor="text-cyan-300"
          subColor="text-emerald-400"
        />
        <StatCard
          label="Blocked"
          value={formatNumber(blockedCount)}
          sub={`${blockRate}% block rate`}
          iconColor="bg-rose-500"
          valueColor="text-rose-300"
          subColor={
            Number(blockRate) > 5 ? "text-rose-400" : "text-surface-400"
          }
        />
        <StatCard
          label="Tokens Used"
          value={formatNumber(totalTokens)}
          sub={
            totalRequests > 0
              ? `~${formatNumber(Math.round(totalTokens / totalRequests))}/req`
              : "—"
          }
          iconColor="bg-violet-500"
          valueColor="text-violet-300"
        />
        <StatCard
          label="Total Cost"
          value={`$${totalCost.toFixed(2)}`}
          sub={
            totalRequests > 0
              ? `$${(totalCost / totalRequests).toFixed(4)}/req`
              : "—"
          }
          iconColor="bg-emerald-500"
          valueColor="text-emerald-300"
        />
        <StatCard
          label="Avg Latency"
          value="—"
          sub="coming soon"
          iconColor="bg-amber-500"
          valueColor="text-amber-300"
          subColor="text-surface-500"
        />
      </div>

      {featureDistribution.length > 0 && (
        <div className="relative px-5 py-4">
          <p className="text-[11px] font-mono text-surface-400 uppercase tracking-wider mb-3">
            Feature Distribution
          </p>
          <div className="h-3 rounded-full overflow-hidden flex bg-surface-800/60">
            {featureDistribution.map((f, i) => (
              <div
                key={f.name}
                className={`${DISTRIBUTION_COLORS[i % DISTRIBUTION_COLORS.length].bg} transition-all duration-700 ease-out`}
                style={{ width: `${Math.max(f.pct, 2)}%` }}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-4 mt-3">
            {featureDistribution.map((f, i) => (
              <div key={f.name} className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${DISTRIBUTION_COLORS[i % DISTRIBUTION_COLORS.length].dot}`}
                />
                <span className="text-xs font-mono text-surface-300">
                  {f.name}
                </span>
                <span
                  className={`text-xs font-mono font-bold ${DISTRIBUTION_COLORS[i % DISTRIBUTION_COLORS.length].text}`}
                >
                  {f.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
