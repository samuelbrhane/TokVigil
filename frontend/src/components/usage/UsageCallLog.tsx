"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { Badge } from "@/components/ui";
import { UsageRecord, getRecentUsage } from "@/lib/dashboard";
import { UsageFilters } from "@/components/usage/UsageFilterBar";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;

  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thenDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const days = Math.round((nowDate.getTime() - thenDate.getTime()) / 86400000);

  if (days === 1) return "1d ago";
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function AnimateRow({
  children,
  delay,
}: {
  children: React.ReactNode;
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
      {children}
    </div>
  );
}

function MobileRecordCard({
  record,
  delay,
}: {
  record: UsageRecord;
  delay: number;
}) {
  return (
    <AnimateRow delay={delay}>
      <div className="border-b border-surface-800/20 last:border-0 px-4 py-3 hover:bg-surface-900/40 transition-colors">
        {/* Top row: user + status + time */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-sm font-mono text-white truncate">
              {record.user_id}
            </span>
            <Badge variant={record.status === "allowed" ? "success" : "danger"}>
              {record.status}
            </Badge>
          </div>
          <span className="text-[11px] font-mono text-surface-500 shrink-0 ml-2">
            {timeAgo(record.created_at)}
          </span>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div className="flex justify-between">
            <span className="text-[10px] font-mono text-surface-500">
              Request
            </span>
            <span className="text-[11px] font-mono text-surface-300">
              {record.request_id.slice(0, 8)}…
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[10px] font-mono text-surface-500">
              Model
            </span>
            <span className="text-[11px] font-mono text-surface-300 truncate ml-2">
              {record.model}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[10px] font-mono text-surface-500">
              Tokens
            </span>
            <span className="text-[11px] font-mono text-violet-400">
              {formatNumber(record.total_tokens)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[10px] font-mono text-surface-500">Cost</span>
            <span className="text-[11px] font-mono text-emerald-400">
              {record.estimated_cost_usd > 0
                ? `$${record.estimated_cost_usd.toFixed(4)}`
                : "—"}
            </span>
          </div>
          {record.feature && (
            <div className="flex justify-between col-span-2">
              <span className="text-[10px] font-mono text-surface-500">
                Feature
              </span>
              <span className="text-[11px] font-mono text-surface-300">
                {record.feature}
              </span>
            </div>
          )}
        </div>
      </div>
    </AnimateRow>
  );
}

interface UsageCallLogProps {
  filters: UsageFilters;
}

export default function UsageCallLog({ filters }: UsageCallLogProps) {
  const [records, setRecords] = useState<UsageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    setPage(1);
  }, [filters.workspace_id, filters.environment_id, filters.user_id]);

  useEffect(() => {
    if (!filters.workspace_id || !filters.environment_id) return;

    const load = async () => {
      setLoading(true);
      try {
        const data = await getRecentUsage(
          filters.workspace_id!,
          filters.environment_id!,
          page,
          pageSize,
          {
            user_id: filters.user_id,
          },
        );
        setRecords(data.items);
        setTotalPages(data.total_pages);
        setTotal(data.total);
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters.workspace_id, filters.environment_id, filters.user_id, page]);

  if (loading && records.length === 0) {
    return (
      <Card className="p-4 sm:p-6">
        <div className="h-64 animate-pulse rounded-lg bg-surface-800/20" />
      </Card>
    );
  }

  const PaginationControls = () =>
    totalPages > 1 ? (
      <div className="flex items-center gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-2 py-1 rounded text-xs font-mono text-surface-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ← Prev
        </button>
        <span className="text-xs font-mono text-surface-400">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-2 py-1 rounded text-xs font-mono text-surface-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>
    ) : null;

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-surface-700/40">
        <div className="flex items-center gap-2 sm:gap-3">
          <h3 className="text-sm font-mono font-bold text-white">Call Log</h3>
          <span className="text-[11px] font-mono text-surface-500">
            {total.toLocaleString()} total
          </span>
        </div>
        <div className="hidden sm:block">
          <PaginationControls />
        </div>
      </div>

      {records.length === 0 ? (
        <div className="px-4 sm:px-6 py-12 text-center">
          <p className="text-sm text-surface-500 font-mono">
            No calls recorded yet. Start using the SDK to see requests here.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-700/40">
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
                      className="px-4 py-3 text-left text-[11px] font-mono font-bold text-surface-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((record, i) => (
                  <tr
                    key={record.id}
                    className="border-b border-surface-800/20 hover:bg-surface-900/40 transition-colors animate-fade-in"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <td className="px-4 py-3 text-xs font-mono text-surface-300">
                      {record.request_id.slice(0, 8)}…
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-white">
                      {record.user_id}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-surface-300">
                      {record.feature || "—"}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-surface-300">
                      {record.model}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-violet-400">
                      {formatNumber(record.total_tokens)}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-emerald-400">
                      {record.estimated_cost_usd > 0
                        ? `$${record.estimated_cost_usd.toFixed(4)}`
                        : "—"}
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
                    <td className="px-4 py-3 text-xs font-mono text-surface-400">
                      {timeAgo(record.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden">
            {records.map((record, i) => (
              <MobileRecordCard
                key={record.id}
                record={record}
                delay={50 + i * 60}
              />
            ))}
          </div>
        </>
      )}

      {/* Bottom pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-surface-700/40">
          <span className="text-[11px] font-mono text-surface-500 hidden sm:block">
            Showing {(page - 1) * pageSize + 1}–
            {Math.min(page * pageSize, total)} of {total.toLocaleString()}
          </span>
          <span className="text-[11px] font-mono text-surface-500 sm:hidden">
            {page} of {totalPages}
          </span>
          <PaginationControls />
        </div>
      )}
    </Card>
  );
}
