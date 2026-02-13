"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { TopUser } from "@/lib/dashboard";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function UserRow({
  user,
  rank,
  delay,
}: {
  user: TopUser;
  rank: number;
  delay: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-400 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      {/* Desktop row */}
      <div className="hidden md:flex items-center justify-between py-2.5 border-b border-surface-800/20 last:border-0 hover:bg-surface-900/40 rounded-lg px-1 transition-colors">
        <span className="text-xs font-mono text-brand-400 w-8 font-bold">
          {rank}.
        </span>
        <span className="text-sm font-mono text-white flex-1 truncate">
          {user.user_id}
        </span>
        <span className="text-xs font-mono text-surface-200 w-20 text-right">
          {user.requests.toLocaleString()}
        </span>
        <span className="text-xs font-mono text-emerald-400 w-20 text-right">
          {(user.requests - user.blocked).toLocaleString()}
        </span>
        <span
          className={`text-xs font-mono font-bold w-20 text-right ${
            user.blocked > 20
              ? "text-red-400"
              : user.blocked > 0
                ? "text-amber-400"
                : "text-surface-500"
          }`}
        >
          {user.blocked}
        </span>
        <span className="text-xs font-mono text-violet-400 w-24 text-right">
          {formatNumber(user.tokens)}
        </span>
        <span className="text-xs font-mono text-emerald-400 font-bold w-20 text-right">
          ${user.cost_usd.toFixed(2)}
        </span>
      </div>

      {/* Mobile card */}
      <div className="md:hidden border-b border-surface-800/20 last:border-0 py-3 px-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono text-brand-400 font-bold">
            {rank}.
          </span>
          <span className="text-sm font-mono text-white truncate flex-1">
            {user.user_id}
          </span>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            ${user.cost_usd.toFixed(2)}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 pl-5">
          <div className="flex justify-between">
            <span className="text-[10px] font-mono text-surface-500">
              Total
            </span>
            <span className="text-[11px] font-mono text-surface-200">
              {user.requests.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[10px] font-mono text-surface-500">
              Allowed
            </span>
            <span className="text-[11px] font-mono text-emerald-400">
              {(user.requests - user.blocked).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[10px] font-mono text-surface-500">
              Blocked
            </span>
            <span
              className={`text-[11px] font-mono font-bold ${
                user.blocked > 20
                  ? "text-red-400"
                  : user.blocked > 0
                    ? "text-amber-400"
                    : "text-surface-500"
              }`}
            >
              {user.blocked}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[10px] font-mono text-surface-500">
              Tokens
            </span>
            <span className="text-[11px] font-mono text-violet-400">
              {formatNumber(user.tokens)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
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
    <Card className="p-4 sm:p-6">
      <h3 className="text-sm font-mono font-bold text-white mb-4">Top Users</h3>

      {users.length === 0 ? (
        <p className="text-sm text-surface-500 font-mono">No usage data yet.</p>
      ) : (
        <>
          {/* Desktop header — hidden on mobile */}
          <div className="hidden md:flex items-center justify-between pb-3 border-b border-surface-700/40 mb-3">
            <span className="text-[11px] font-mono text-surface-400 uppercase tracking-wider w-8">
              #
            </span>
            <span className="text-[11px] font-mono text-surface-400 uppercase tracking-wider flex-1">
              User
            </span>
            <span className="text-[11px] font-mono text-surface-400 uppercase tracking-wider w-20 text-right">
              Total
            </span>
            <span className="text-[11px] font-mono text-surface-400 uppercase tracking-wider w-20 text-right">
              Allowed
            </span>
            <span className="text-[11px] font-mono text-surface-400 uppercase tracking-wider w-20 text-right">
              Blocked
            </span>
            <span className="text-[11px] font-mono text-surface-400 uppercase tracking-wider w-24 text-right">
              Tokens
            </span>
            <span className="text-[11px] font-mono text-surface-400 uppercase tracking-wider w-20 text-right">
              Cost
            </span>
          </div>

          <div className="space-y-0 md:space-y-2">
            {users.map((u, i) => (
              <UserRow
                key={u.user_id}
                user={u}
                rank={i + 1}
                delay={100 + i * 80}
              />
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
