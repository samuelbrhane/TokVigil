"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { BarChart } from "@/components/charts";
import { DailyUsage } from "@/lib/dashboard";

interface RequestsChartProps {
  data: Record<string, DailyUsage[]>;
  loading: boolean;
  onPeriodChange: (days: number) => void;
}

const periods = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
];

function formatLabel(dateStr: string, totalDays: number): string {
  const date = new Date(dateStr + "T00:00:00");
  if (totalDays <= 7) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }
  if (totalDays <= 30) {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  // 90d — weekly, show "W1", "W2", etc.
  return `W${Math.ceil((new Date().getTime() - date.getTime()) / (7 * 86400000))}`;
}

export default function RequestsChart({
  data,
  loading,
  onPeriodChange,
}: RequestsChartProps) {
  const [period, setPeriod] = useState("7d");

  const handlePeriodChange = (p: string, days: number) => {
    setPeriod(p);
    onPeriodChange(days);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="h-72 animate-pulse rounded-lg bg-surface-800/20" />
      </Card>
    );
  }

  const currentData = data[period] || [];
  const chartData = currentData.map((d, i) => {
    let label: string;

    if (period === "7d") {
      label = new Date(d.date + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "short",
      });
    } else if (period === "30d") {
      label = new Date(d.date + "T00:00:00").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } else {
      // 90d weekly — show date range like "Feb 1–7"
      const start = new Date(d.date + "T00:00:00");
      const end = new Date(start);
      end.setDate(end.getDate() + 6);

      const startStr = start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const endStr =
        start.getMonth() === end.getMonth()
          ? end.getDate().toString()
          : end.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      label = `${startStr}–${endStr}`;
    }

    return { label, value: d.requests };
  });

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-mono font-bold text-white">Requests</h3>
        <div className="flex gap-1">
          {periods.map((p) => (
            <button
              key={p.label}
              onClick={() => handlePeriodChange(p.label, p.days)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                period === p.label
                  ? "bg-brand-500/15 text-brand-300 border border-brand-500/30"
                  : "text-surface-400 hover:text-white"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-sm text-surface-500 font-mono">No data yet</p>
        </div>
      ) : (
        <BarChart data={chartData} height={260} />
      )}
    </Card>
  );
}
