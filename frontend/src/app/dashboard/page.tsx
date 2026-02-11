"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Badge } from "@/components/ui";
import Card from "@/components/ui/Card";
import { BarChart } from "@/components/charts";
import DashboardBanner from "@/components/ui/DashboardBanner";

// Generate last N days labels from today
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

// Mock data per period — will be replaced with real API calls
const chartDataByPeriod: Record<string, { label: string; value: number }[]> = {
  "7d": getLastNDays(7).map((label, i) => ({
    label,
    value: [1200, 1800, 1400, 2200, 1900, 800, 600][i],
  })),
  "30d": getLastNDays(30).map((label) => ({
    label,
    value: Math.floor(Math.random() * 2500) + 500,
  })),
  "90d": getLastNDays(12).map((_, i) => ({
    label: `W${i + 1}`,
    value: Math.floor(Math.random() * 15000) + 3000,
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

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Usage chart */}
        <Card className="lg:col-span-2 p-6">
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
          <BarChart data={chartDataByPeriod[period]} height={220} />
        </Card>

        {/* Recent activity */}
        <Card className="p-6">
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

      {/* Quick Actions + Top Users */}
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
            Top Users This Month
          </h3>
          <div className="space-y-3">
            {[
              { user: "user_342", requests: 2340, cost: "$34.20" },
              { user: "user_891", requests: 1890, cost: "$28.50" },
              { user: "user_127", requests: 1560, cost: "$22.10" },
              { user: "user_556", requests: 1230, cost: "$18.90" },
              { user: "user_789", requests: 980, cost: "$14.30" },
            ].map((u, i) => (
              <div
                key={u.user}
                className="flex items-center justify-between py-2 border-b border-surface-700/30 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-brand-400 w-4 font-bold">
                    {i + 1}.
                  </span>
                  <span className="text-sm font-mono text-white">{u.user}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-surface-300">
                    {u.requests.toLocaleString()} reqs
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    {u.cost}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
