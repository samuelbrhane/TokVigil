"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Badge } from "@/components/ui";
import Card from "@/components/ui/Card";
import { BarChart } from "@/components/charts";
import DashboardBanner from "@/components/ui/DashboardBanner";

function getLastNDays(n: number): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    );
  }
  return days;
}

const DAYS_7 = getLastNDays(7);
const DAYS_30 = getLastNDays(30);

const chartDataByPeriod: Record<string, { label: string; value: number }[]> = {
  "7d": DAYS_7.map((label, i) => ({
    label,
    value: [1200, 1800, 1400, 2200, 1900, 800, 600][i],
  })),
  "30d": DAYS_30.map((label, i) => ({
    label,
    value: [
      1800, 2100, 1600, 2400, 2200, 1900, 2600, 2300, 1500, 2800, 1700, 2000,
      1400, 2500, 2100, 1800, 2700, 2200, 1600, 2900, 1900, 2300, 1500, 2600,
      2000, 1700, 2800, 2400, 1800, 2100,
    ][i],
  })),
  "90d": Array.from({ length: 12 }, (_, i) => ({
    label: `W${i + 1}`,
    value: [
      8500, 9200, 7800, 10500, 9800, 8900, 11200, 10100, 8600, 12000, 11500,
      9700,
    ][i],
  })),
};

const recentActivity = [
  {
    user: "user_342",
    feature: "chat",
    cost: "$0.003",
    status: "allowed",
    time: "2 min ago",
  },
  {
    user: "user_891",
    feature: "summarize",
    cost: "$0.001",
    status: "allowed",
    time: "5 min ago",
  },
  {
    user: "user_127",
    feature: "chat",
    cost: "—",
    status: "blocked",
    time: "8 min ago",
  },
  {
    user: "user_556",
    feature: "extract",
    cost: "$0.012",
    status: "allowed",
    time: "12 min ago",
  },
  {
    user: "user_342",
    feature: "chat",
    cost: "$0.004",
    status: "allowed",
    time: "15 min ago",
  },
];

export default function DashboardOverview() {
  const [period, setPeriod] = useState("7d");

  return (
    <div className="space-y-8">
      <DashboardBanner />

      {/* Requests chart — full width */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-mono font-bold text-white">Requests</h3>
          <div className="flex gap-1">
            {(["7d", "30d", "90d"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                  period === p
                    ? "bg-brand-500/15 text-brand-300 border border-brand-500/30"
                    : "text-surface-400 hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <BarChart data={chartDataByPeriod[period]} height={260} />
      </Card>

      {/* Top Users — full width */}
      <Card className="p-6">
        <h3 className="text-sm font-mono font-bold text-white mb-4">
          Top Users This Month
        </h3>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-700/40 mb-3">
          <span className="text-[11px] font-mono text-surface-400 uppercase tracking-wider w-8">
            #
          </span>
          <span className="text-[11px] font-mono text-surface-400 uppercase tracking-wider flex-1">
            User
          </span>
          <span className="text-[11px] font-mono text-surface-400 uppercase tracking-wider w-24 text-right">
            Requests
          </span>
          <span className="text-[11px] font-mono text-surface-400 uppercase tracking-wider w-24 text-right">
            Tokens
          </span>
          <span className="text-[11px] font-mono text-surface-400 uppercase tracking-wider w-20 text-right">
            Cost
          </span>
          <span className="text-[11px] font-mono text-surface-400 uppercase tracking-wider w-20 text-right">
            Blocked
          </span>
        </div>
        {/* Rows */}
        <div className="space-y-2">
          {[
            {
              user: "user_342",
              requests: 2340,
              tokens: "1.2M",
              cost: "$34.20",
              blocked: 12,
            },
            {
              user: "user_891",
              requests: 1890,
              tokens: "980K",
              cost: "$28.50",
              blocked: 5,
            },
            {
              user: "user_127",
              requests: 1560,
              tokens: "820K",
              cost: "$22.10",
              blocked: 87,
            },
            {
              user: "user_556",
              requests: 1230,
              tokens: "640K",
              cost: "$18.90",
              blocked: 3,
            },
            {
              user: "user_789",
              requests: 980,
              tokens: "510K",
              cost: "$14.30",
              blocked: 0,
            },
          ].map((u, i) => (
            <div
              key={u.user}
              className="flex items-center justify-between py-2.5 border-b border-surface-800/20 last:border-0 hover:bg-surface-900/40 rounded-lg px-1 transition-colors"
            >
              <span className="text-xs font-mono text-brand-400 w-8 font-bold">
                {i + 1}.
              </span>
              <span className="text-sm font-mono text-white flex-1">
                {u.user}
              </span>
              <span className="text-xs font-mono text-surface-200 w-24 text-right">
                {u.requests.toLocaleString()}
              </span>
              <span className="text-xs font-mono text-violet-400 w-24 text-right">
                {u.tokens}
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold w-20 text-right">
                {u.cost}
              </span>
              <span
                className={`text-xs font-mono font-bold w-20 text-right ${u.blocked > 20 ? "text-red-400" : u.blocked > 0 ? "text-amber-400" : "text-surface-500"}`}
              >
                {u.blocked}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions + Recent Activity — side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-6">
          <h3 className="text-sm font-mono font-bold text-white mb-4">
            Quick Actions
          </h3>
          <div className="flex flex-col gap-2">
            <Link href="/dashboard/policies/new" className="block">
              <Button
                variant="secondary"
                className="w-full justify-start"
                size="sm"
              >
                <span className="mr-2 text-brand-400">⬡</span> Create Policy
              </Button>
            </Link>
            <Link href="/dashboard/api-keys" className="block">
              <Button
                variant="secondary"
                className="w-full justify-start"
                size="sm"
              >
                <span className="mr-2 text-brand-400">⚿</span> Generate API Key
              </Button>
            </Link>
            <Link href="/docs" className="block">
              <Button
                variant="secondary"
                className="w-full justify-start"
                size="sm"
              >
                <span className="mr-2 text-brand-400">◩</span> View Docs
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="lg:col-span-2 p-6">
          <h3 className="text-sm font-mono font-bold text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-surface-700/30 last:border-0"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-white truncate">
                      {item.user}
                    </span>
                    <Badge
                      variant={item.status === "allowed" ? "success" : "danger"}
                    >
                      {item.status === "allowed" ? "✓" : "✕"}
                    </Badge>
                  </div>
                  <span className="text-[11px] font-mono text-surface-400">
                    {item.feature} · {item.time}
                  </span>
                </div>
                <span className="text-xs font-mono text-brand-300">
                  {item.cost}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
