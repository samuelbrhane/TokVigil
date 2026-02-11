"use client";

import Card from "@/components/ui/Card";
import { TopUser } from "@/lib/dashboard";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

interface TopUsersTableProps {
  users: TopUser[];
  loading: boolean;
}

export default function TopUsersTable({ users, loading }: TopUsersTableProps) {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="h-48 animate-pulse rounded-lg bg-surface-800/20" />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-sm font-mono font-bold text-white mb-4">Top Users</h3>

      {users.length === 0 ? (
        <p className="text-sm text-surface-500 font-mono">No usage data yet.</p>
      ) : (
        <>
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
          <div className="space-y-2">
            {users.map((u, i) => (
              <div
                key={u.user_id}
                className="flex items-center justify-between py-2.5 border-b border-surface-800/20 last:border-0 hover:bg-surface-900/40 rounded-lg px-1 transition-colors"
              >
                <span className="text-xs font-mono text-brand-400 w-8 font-bold">
                  {i + 1}.
                </span>
                <span className="text-sm font-mono text-white flex-1">
                  {u.user_id}
                </span>
                <span className="text-xs font-mono text-surface-200 w-24 text-right">
                  {u.requests.toLocaleString()}
                </span>
                <span className="text-xs font-mono text-violet-400 w-24 text-right">
                  {formatNumber(u.tokens)}
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold w-20 text-right">
                  ${u.cost_usd.toFixed(2)}
                </span>
                <span
                  className={`text-xs font-mono font-bold w-20 text-right ${
                    u.blocked > 20
                      ? "text-red-400"
                      : u.blocked > 0
                        ? "text-amber-400"
                        : "text-surface-500"
                  }`}
                >
                  {u.blocked}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
