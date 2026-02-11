"use client";

import { useAuth } from "@/lib/auth-context";
import { UsageSummary } from "@/lib/dashboard";

function UsageArc({
  percent,
  label,
  value,
}: {
  percent: number;
  label: string;
  value: string;
}) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const color =
    percent > 90
      ? "#ef4444"
      : percent > 75
        ? "#f43f5e"
        : percent > 60
          ? "#fbbf24"
          : percent > 40
            ? "#a3e635"
            : percent > 20
              ? "#22d3ee"
              : "#818cf8";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="#3f3f46"
            strokeWidth="5"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-mono font-bold text-surface-100">
            {percent}%
          </span>
        </div>
      </div>
      <span className="text-lg font-bold font-mono text-surface-100">
        {value}
      </span>
      <span className="text-[11px] font-mono text-surface-400 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

function PulseIndicator({
  status,
}: {
  status: "healthy" | "warning" | "critical";
}) {
  const colors = {
    healthy: "bg-emerald-400",
    warning: "bg-amber-400",
    critical: "bg-red-400",
  };
  return (
    <span className="relative flex h-2 w-2">
      <span
        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colors[status]}`}
      />
      <span
        className={`relative inline-flex rounded-full h-2 w-2 ${colors[status]}`}
      />
    </span>
  );
}

function TickerItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 px-4 border-r border-surface-700/40 last:border-0">
      <span className="text-[11px] font-mono text-surface-400 uppercase tracking-wider">
        {label}
      </span>
      <span className="text-sm font-mono font-bold text-surface-200">
        {value}
      </span>
    </div>
  );
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

interface DashboardBannerProps {
  summary: UsageSummary | null;
  loading: boolean;
  planLimits: {
    evaluate_calls_limit: number | null;
    rate_limit_per_minute: number | null;
  };
  apiKeyCount: number;
  planName: string;
}

export default function DashboardBanner({
  summary,
  loading,
  planLimits,
  apiKeyCount,
  planName,
}: DashboardBannerProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-surface-700/40 bg-surface-900/60 h-64 animate-pulse" />
    );
  }

  const totalRequests = summary?.total_requests || 0;
  const totalTokens = summary?.total_tokens || 0;
  const totalCost = summary?.total_cost_usd || 0;
  const allowedCount = summary?.allowed_count || 0;
  const blockedCount = summary?.blocked_count || 0;
  const blockRate =
    totalRequests > 0
      ? ((blockedCount / totalRequests) * 100).toFixed(1)
      : "0.0";

  const evalLimit = planLimits.evaluate_calls_limit;
  const evalPercent =
    evalLimit && evalLimit > 0
      ? Math.min(Math.round((totalRequests / evalLimit) * 100), 100)
      : 0;

  const systemStatus: "healthy" | "warning" | "critical" =
    Number(blockRate) > 10
      ? "critical"
      : Number(blockRate) > 5
        ? "warning"
        : "healthy";

  return (
    <div className="relative rounded-2xl border border-surface-700/40 bg-gradient-to-br from-surface-900/80 via-surface-950 to-surface-900/60 overflow-hidden mb-8">
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Top status bar */}
      <div className="relative flex items-center gap-3 px-6 py-2.5 border-b border-surface-700/40 bg-surface-950/50">
        <PulseIndicator status={systemStatus} />
        <span className="text-xs font-mono text-surface-300">
          {systemStatus === "healthy"
            ? "All systems operational"
            : systemStatus === "warning"
              ? "Elevated block rate"
              : "High block rate detected"}
        </span>
        <span className="text-xs font-mono text-surface-400 ml-auto">
          {new Date().toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>

      {/* Main content */}
      <div className="relative px-6 py-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Arcs */}
          <div className="flex items-center gap-6">
            <UsageArc
              percent={evalPercent}
              label="Evaluate Calls"
              value={formatNumber(totalRequests)}
            />
            <UsageArc
              percent={
                totalTokens > 0
                  ? Math.min(Math.round((totalTokens / 10_000_000) * 100), 100)
                  : 0
              }
              label="Tokens Used"
              value={formatNumber(totalTokens)}
            />
            <UsageArc
              percent={
                totalCost > 0
                  ? Math.min(Math.round((totalCost / 200) * 100), 100)
                  : 0
              }
              label="Budget Used"
              value={`$${totalCost.toFixed(2)}`}
            />
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-24 bg-surface-700/60" />

          {/* Live stats */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-mono text-surface-400 uppercase tracking-wider">
                  Total Requests
                </p>
                <p className="text-2xl font-bold font-mono text-surface-100 mt-1">
                  {totalRequests.toLocaleString()}
                </p>
                <p className="text-xs font-mono text-emerald-400 mt-0.5">
                  {allowedCount.toLocaleString()} allowed
                </p>
              </div>
              <div>
                <p className="text-[11px] font-mono text-surface-400 uppercase tracking-wider">
                  Blocked
                </p>
                <p className="text-2xl font-bold font-mono text-surface-100 mt-1">
                  {blockedCount.toLocaleString()}
                </p>
                <p className="text-xs font-mono text-red-400 mt-0.5">
                  {blockRate}% block rate
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom ticker */}
      <div className="relative flex items-center px-2 py-2 border-t border-surface-700/40 bg-surface-950/50 overflow-x-auto">
        <TickerItem label="Plan" value={planName} />
        <TickerItem
          label="Rate"
          value={
            planLimits.rate_limit_per_minute
              ? `${planLimits.rate_limit_per_minute.toLocaleString()}/min`
              : "Unlimited"
          }
        />
        <TickerItem label="API Keys" value={`${apiKeyCount} active`} />
        <TickerItem
          label="Eval Limit"
          value={evalLimit ? `${formatNumber(evalLimit)}/mo` : "Unlimited"}
        />
      </div>
    </div>
  );
}
