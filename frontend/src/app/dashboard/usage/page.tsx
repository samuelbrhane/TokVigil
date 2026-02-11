"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui";
import Card from "@/components/ui/Card";
import { BarChart } from "@/components/charts";

// ── Data ──────────────────────────────────────────────

const usageByModel = [
  { label: "gpt-4o-mini", value: 8500 },
  { label: "gpt-4o", value: 2100 },
  { label: "gpt-3.5", value: 1800 },
  { label: "claude-3", value: 450 },
];

const usageByFeature = [
  { label: "chat", value: 6200 },
  { label: "summarize", value: 3400 },
  { label: "extract", value: 2100 },
  { label: "classify", value: 1147 },
];

const dailyData = [
  { label: "Feb 1", value: 1800 },
  { label: "Feb 2", value: 2100 },
  { label: "Feb 3", value: 1600 },
  { label: "Feb 4", value: 2400 },
  { label: "Feb 5", value: 2200 },
  { label: "Feb 6", value: 1900 },
  { label: "Feb 7", value: 2600 },
  { label: "Feb 8", value: 2300 },
  { label: "Feb 9", value: 1500 },
  { label: "Feb 10", value: 2800 },
];

const usageRecords = [
  {
    id: "req_a1b2",
    user: "user_342",
    feature: "chat",
    model: "gpt-4o-mini",
    tokens: 450,
    cost: "$0.003",
    status: "allowed",
    time: "2025-02-10 14:23",
  },
  {
    id: "req_c3d4",
    user: "user_891",
    feature: "summarize",
    model: "gpt-4o-mini",
    tokens: 320,
    cost: "$0.001",
    status: "allowed",
    time: "2025-02-10 14:20",
  },
  {
    id: "req_e5f6",
    user: "user_127",
    feature: "chat",
    model: "gpt-4o",
    tokens: 0,
    cost: "—",
    status: "blocked",
    time: "2025-02-10 14:18",
  },
  {
    id: "req_g7h8",
    user: "user_556",
    feature: "extract",
    model: "gpt-4o",
    tokens: 1200,
    cost: "$0.012",
    status: "allowed",
    time: "2025-02-10 14:15",
  },
  {
    id: "req_i9j0",
    user: "user_342",
    feature: "chat",
    model: "gpt-4o-mini",
    tokens: 380,
    cost: "$0.002",
    status: "allowed",
    time: "2025-02-10 14:12",
  },
];

// ── Mini Stat ─────────────────────────────────────────

function MiniStat({
  label,
  value,
  sub,
  subColor = "text-emerald-400",
}: {
  label: string;
  value: string;
  sub: string;
  subColor?: string;
}) {
  return (
    <div className="px-5 py-4 border-r border-surface-700/40 last:border-0">
      <p className="text-[11px] font-mono text-surface-400 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-xl font-bold font-mono text-surface-100 mt-1">
        {value}
      </p>
      <p className={`text-xs font-mono mt-0.5 ${subColor}`}>{sub}</p>
    </div>
  );
}

// ── Usage Banner ──────────────────────────────────────

function UsageBanner() {
  const liveModels = [
    { model: "gpt-4o-mini", pct: 66 },
    { model: "gpt-4o", pct: 16 },
    { model: "gpt-3.5", pct: 14 },
    { model: "claude-3", pct: 4 },
  ];

  const colors = [
    "bg-brand-500",
    "bg-emerald-500",
    "bg-amber-400",
    "bg-violet-500",
  ];

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

      {/* Stats row */}
      <div className="relative flex flex-col md:flex-row border-b border-surface-700/40">
        <MiniStat label="Requests" value="12,847" sub="+12.3% vs last period" />
        <MiniStat label="Tokens Used" value="2.4M" sub="+8.1% vs last period" />
        <MiniStat
          label="Total Cost"
          value="$156.32"
          sub="+5.7% vs last period"
        />
        <MiniStat
          label="Avg Latency"
          value="423ms"
          sub="-2.1% vs last period"
          subColor="text-red-400"
        />
      </div>

      {/* Model distribution bar */}
      <div className="relative px-5 py-4">
        <p className="text-[11px] font-mono text-surface-400 uppercase tracking-wider mb-3">
          Model Distribution
        </p>
        <div className="h-3 rounded-full overflow-hidden flex bg-surface-800/60">
          {liveModels.map((m, i) => (
            <div
              key={m.model}
              className={`${colors[i]} transition-all duration-700 ease-out`}
              style={{ width: `${m.pct}%` }}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-4 mt-3">
          {liveModels.map((m, i) => (
            <div key={m.model} className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${colors[i]}`} />
              <span className="text-xs font-mono text-surface-400">
                {m.model}
              </span>
              <span className="text-xs font-mono text-surface-300 font-bold">
                {m.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────

export default function UsagePage() {
  const [activeTab, setActiveTab] = useState<"requests" | "tokens" | "cost">(
    "requests",
  );

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {["All Environments", "All Users", "All Models", "All Status"].map(
          (filter) => (
            <button
              key={filter}
              className="px-3 py-1.5 rounded-lg bg-surface-900/60 border border-surface-800/40 text-xs font-mono text-surface-400 hover:border-surface-700/60 transition-colors"
            >
              {filter} <span className="text-surface-600 ml-1">▾</span>
            </button>
          ),
        )}
        <button className="px-3 py-1.5 rounded-lg bg-surface-900/60 border border-surface-800/40 text-xs font-mono text-surface-400 hover:border-surface-700/60 transition-colors">
          Feb 1 – Feb 10 <span className="text-surface-600 ml-1">◫</span>
        </button>
      </div>

      {/* Banner replaces stat cards */}
      <UsageBanner />

      {/* Main chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1">
            {(["requests", "tokens", "cost"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded text-xs font-mono capitalize transition-colors ${
                  activeTab === tab
                    ? "bg-brand-500/10 text-brand-400 border border-brand-500/20"
                    : "text-surface-500 hover:text-surface-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <BarChart data={dailyData} height={250} />
      </Card>

      {/* Breakdown charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="text-sm font-mono font-bold text-surface-200 mb-4">
            By Model
          </h3>
          <BarChart data={usageByModel} height={180} />
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-mono font-bold text-surface-200 mb-4">
            By Feature
          </h3>
          <BarChart data={usageByFeature} height={180} />
        </Card>
      </div>

      {/* Usage table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-800/30">
          <h3 className="text-sm font-mono font-bold text-surface-200">
            Recent Calls
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-800/30">
                {[
                  "Request ID",
                  "User",
                  "Feature",
                  "Model",
                  "Tokens",
                  "Cost",
                  "Status",
                  "Time",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[11px] font-mono font-bold text-surface-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usageRecords.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-surface-800/15 hover:bg-surface-900/40 transition-colors"
                >
                  <td className="px-4 py-3 text-xs font-mono text-surface-400">
                    {record.id}
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-surface-300">
                    {record.user}
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-surface-400">
                    {record.feature}
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-surface-400">
                    {record.model}
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-surface-400">
                    {record.tokens.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-surface-400">
                    {record.cost}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        record.status === "allowed" ? "success" : "danger"
                      }
                    >
                      {record.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-surface-500">
                    {record.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
