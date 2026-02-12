"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import { BarChart } from "@/components/charts";
import { DailyUsage, getScopedDaily } from "@/lib/dashboard";
import { UsageFilters } from "@/components/usage/UsageFilterBar";

interface UsageChartProps {
  filters: UsageFilters;
}

export default function UsageChart({ filters }: UsageChartProps) {
  const [activeTab, setActiveTab] = useState<"requests" | "tokens" | "cost">(
    "requests",
  );
  const [data, setData] = useState<DailyUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!filters.workspace_id || !filters.environment_id) return;

    const load = async () => {
      setLoading(true);
      try {
        const result = await getScopedDaily(
          filters.workspace_id!,
          filters.environment_id!,
          filters.days,
        );
        setData(result);
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters.workspace_id, filters.environment_id, filters.days]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="h-72 animate-pulse rounded-lg bg-surface-800/20" />
      </Card>
    );
  }

  const chartData = data.map((d) => {
    let dateLabel: string;

    if (filters.days <= 7) {
      dateLabel = new Date(d.date + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "short",
      });
    } else if (filters.days <= 30) {
      dateLabel = new Date(d.date + "T00:00:00").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } else {
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

      dateLabel = `${startStr}–${endStr}`;
    }

    let value: number;
    if (activeTab === "requests") value = d.requests;
    else if (activeTab === "tokens") value = d.tokens;
    else value = d.cost_usd;

    return { label: dateLabel, value };
  });

  const chartPrefix = activeTab === "cost" ? "$" : "";

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-mono font-bold text-white">
          {activeTab === "requests"
            ? "Daily Requests"
            : activeTab === "tokens"
              ? "Daily Tokens"
              : "Daily Cost"}
        </h3>
        <div className="flex gap-1">
          {(["requests", "tokens", "cost"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded text-xs font-mono capitalize transition-colors ${
                activeTab === tab
                  ? "bg-brand-500/15 text-brand-300 border border-brand-500/30"
                  : "text-surface-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-sm text-surface-500 font-mono">
            No data for this period
          </p>
        </div>
      ) : (
        <BarChart data={chartData} height={250} valuePrefix={chartPrefix} />
      )}
    </Card>
  );
}
