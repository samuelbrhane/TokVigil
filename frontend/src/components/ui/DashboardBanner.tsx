"use client";

import { useEffect, useState } from "react";
import { UsageSummary } from "@/lib/dashboard";

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

function StatCard({
  label,
  value,
  sub,
  subColor = "text-surface-400",
  delay = 0,
}: {
  label: string;
  value: string;
  sub?: string;
  subColor?: string;
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
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
    >
      <p className="text-[11px] font-mono text-surface-400 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-xl sm:text-2xl font-bold font-mono text-surface-100 mt-1">
        {value}
      </p>
      {sub && (
        <p className={`text-[11px] sm:text-xs font-mono mt-0.5 ${subColor}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

function TickerItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 px-3 sm:px-4 border-r border-surface-700/40 last:border-0 shrink-0">
      <span className="text-[10px] sm:text-[11px] font-mono text-surface-400 uppercase tracking-wider whitespace-nowrap">
        {label}
      </span>
      <span className="text-xs sm:text-sm font-mono font-bold text-surface-200 whitespace-nowrap">
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
}

export default function DashboardBanner({
  summary,
  loading,
}: DashboardBannerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setMounted(true), 50);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-surface-700/40 bg-surface-900/60 h-48 animate-pulse" />
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

  const systemStatus: "healthy" | "warning" | "critical" =
    Number(blockRate) > 10
      ? "critical"
      : Number(blockRate) > 5
        ? "warning"
        : "healthy";

  return (
    <div
      className={`relative rounded-2xl border border-surface-700/40 bg-gradient-to-br from-surface-900/80 via-surface-950 to-surface-900/60 overflow-hidden mb-6 sm:mb-8 transition-all duration-600 ease-out ${
        mounted ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]"
      }`}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Top status bar */}
      <div className="relative flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-2.5 border-b border-surface-700/40 bg-surface-950/50">
        <PulseIndicator status={systemStatus} />
        <span className="text-[11px] sm:text-xs font-mono text-surface-300">
          {systemStatus === "healthy"
            ? "All systems operational"
            : systemStatus === "warning"
              ? "Elevated block rate"
              : "High block rate detected"}
        </span>
        <span className="text-[11px] sm:text-xs font-mono text-surface-400 ml-auto hidden sm:block">
          {new Date().toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>

      {/* Main stats */}
      <div className="relative px-4 sm:px-6 py-5 sm:py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          <StatCard
            label="Total Requests"
            value={formatNumber(totalRequests)}
            sub="across all workspaces"
            delay={100}
          />
          <StatCard
            label="Allowed"
            value={formatNumber(allowedCount)}
            sub={`${totalRequests > 0 ? ((allowedCount / totalRequests) * 100).toFixed(1) : "0.0"}% pass rate`}
            subColor="text-emerald-400"
            delay={200}
          />
          <StatCard
            label="Blocked"
            value={formatNumber(blockedCount)}
            sub={`${blockRate}% block rate`}
            subColor="text-red-400"
            delay={300}
          />
          <StatCard
            label="Tokens Used"
            value={formatNumber(totalTokens)}
            sub="total consumption"
            delay={400}
          />
          <StatCard
            label="Total Cost"
            value={`$${totalCost.toFixed(2)}`}
            sub="estimated spend"
            delay={500}
          />
        </div>
      </div>

      {/* Bottom ticker */}
      <div className="relative border-t border-surface-700/40 bg-surface-950/50 px-4 py-2 sm:px-2 sm:py-2">
        <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-y-1 sm:gap-x-0">
          <TickerItem
            label="Workspaces"
            value={`${summary?.workspace_count || 0}`}
          />
          <TickerItem
            label="Policies"
            value={`${summary?.policy_count || 0} active`}
          />
          <TickerItem
            label="API Keys"
            value={`${summary?.api_key_count || 0} active`}
          />
          <TickerItem label="Block Rate" value={`${blockRate}%`} />
          <TickerItem
            label="Avg Cost/Req"
            value={
              totalRequests > 0
                ? `$${(totalCost / totalRequests).toFixed(4)}`
                : "$0.00"
            }
          />
        </div>
      </div>
    </div>
  );
}
