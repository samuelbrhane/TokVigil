"use client";

import { useState, useEffect } from "react";

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
      ? "#ef4444" // red — critical
      : percent > 75
        ? "#f43f5e" // rose — warning high
        : percent > 60
          ? "#fbbf24" // amber — warning
          : percent > 40
            ? "#a3e635" // lime — healthy
            : percent > 20
              ? "#22d3ee" // cyan — low usage
              : "#818cf8"; // indigo — minimal

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

export default function DashboardBanner() {
  const recentEvents = [
    "user_342 → chat → allowed",
    "user_891 → summarize → allowed",
    "user_127 → chat → blocked:DAILY_LIMIT",
    "user_556 → extract → allowed",
    "user_789 → chat → allowed",
  ];

  return (
    <div className="relative rounded-2xl border border-surface-700/40 bg-gradient-to-br from-surface-900/80 via-surface-950 to-surface-900/60 overflow-hidden mb-8">
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Top status bar */}
      <div className="relative flex items-center gap-3 px-6 py-2.5 border-b border-surface-700/40 bg-surface-950/50">
        <PulseIndicator status="healthy" />
        <span className="text-xs font-mono text-surface-300">
          All systems operational
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
            <UsageArc percent={67} label="Evaluate Calls" value="33.5K" />
            <UsageArc percent={37} label="Tokens Used" value="18.5M" />
            <UsageArc percent={45} label="Budget Used" value="$89" />
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
                  12,847
                </p>
                <p className="text-xs font-mono text-emerald-400 mt-0.5">
                  +12.3% vs last period
                </p>
              </div>
              <div>
                <p className="text-[11px] font-mono text-surface-400 uppercase tracking-wider">
                  Blocked
                </p>
                <p className="text-2xl font-bold font-mono text-surface-100 mt-1">
                  342
                </p>
                <p className="text-xs font-mono text-red-400 mt-0.5">
                  2.7% block rate
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom ticker bar */}
      <div className="relative flex items-center px-2 py-2 border-t border-surface-700/40 bg-surface-950/50 overflow-x-auto">
        <TickerItem label="Plan" value="Pro" />
        <TickerItem label="Rate" value="500/min" />
        <TickerItem label="API Keys" value="4 active" />
        <TickerItem label="Team" value="3 members" />
        <TickerItem label="Avg Latency" value="12ms" />
      </div>
    </div>
  );
}
