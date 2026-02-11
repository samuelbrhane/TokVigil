"use client";

import { Badge } from "@/components/ui";
import Card from "@/components/ui/Card";
import { UsageRecord } from "@/lib/dashboard";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

interface RecentActivityProps {
  records: UsageRecord[];
  loading: boolean;
}

export default function RecentActivity({
  records,
  loading,
}: RecentActivityProps) {
  if (loading) {
    return (
      <Card className="lg:col-span-2 p-6">
        <div className="h-48 animate-pulse rounded-lg bg-surface-800/20" />
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2 p-6">
      <h3 className="text-sm font-mono font-bold text-white mb-4">
        Recent Activity
      </h3>
      {records.length === 0 ? (
        <p className="text-sm text-surface-500 font-mono">
          No activity yet. Start using the SDK to see requests here.
        </p>
      ) : (
        <div className="space-y-3">
          {records.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2 border-b border-surface-700/30 last:border-0"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-white truncate">
                    {item.user_id}
                  </span>
                  <Badge
                    variant={item.status === "allowed" ? "success" : "danger"}
                  >
                    {item.status === "allowed" ? "✓" : "✕"}
                  </Badge>
                </div>
                <span className="text-[11px] font-mono text-surface-400">
                  {item.feature || "—"} · {item.model} ·{" "}
                  {timeAgo(item.created_at)}
                </span>
              </div>
              <span className="text-xs font-mono text-brand-300">
                ${item.estimated_cost_usd.toFixed(3)}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
