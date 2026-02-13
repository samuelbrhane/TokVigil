"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Badge } from "@/components/ui";
import Card from "@/components/ui/Card";
import WorkspaceSelector from "@/components/dashboard/WorkspaceSelector";
import DeletePolicyModal from "@/components/dashboard/DeletePolicyModal";
import Pagination from "@/components/dashboard/Pagination";
import { getPolicies, updatePolicy } from "@/lib/policies";
import { Policy, PaginatedPolicies } from "@/types/policy";

function AnimateIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
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

function MobilePolicyCard({
  policy,
  workspaceId,
  delay,
  onToggle,
  onDelete,
}: {
  policy: Policy;
  workspaceId: number;
  delay: number;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const formatLimit = (val: number | null) =>
    val === null ? "—" : val === -1 ? "∞" : val.toLocaleString();

  const formatBudget = (val: number | null) =>
    val === null ? "—" : `$${val.toFixed(2)}`;

  return (
    <AnimateIn delay={delay}>
      <div className="border-b border-surface-800/20 last:border-0 px-4 py-3 hover:bg-surface-900/40 transition-colors">
        {/* Top: name + status */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-mono text-surface-200 font-medium truncate flex-1">
            {policy.name}
          </span>
          <Badge variant={policy.is_active ? "success" : "default"}>
            {policy.is_active ? "active" : "inactive"}
          </Badge>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="brand">{policy.plan || "any"}</Badge>
          <span className="text-[11px] font-mono text-surface-400">
            {policy.feature || "all features"}
          </span>
        </div>

        {/* Limits grid */}
        <div className="grid grid-cols-3 gap-x-3 gap-y-1 mb-3">
          <div>
            <span className="text-[10px] font-mono text-surface-500 block">
              Daily Req
            </span>
            <span className="text-[11px] font-mono text-surface-300">
              {formatLimit(policy.requests_per_day)}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-surface-500 block">
              Monthly Req
            </span>
            <span className="text-[11px] font-mono text-surface-300">
              {formatLimit(policy.requests_per_month)}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-surface-500 block">
              Daily Budget
            </span>
            <span className="text-[11px] font-mono text-surface-300">
              {formatBudget(policy.budget_per_day_usd)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggle}
            className={`text-xs font-mono transition-colors ${
              policy.is_active
                ? "text-surface-500 hover:text-yellow-400"
                : "text-surface-500 hover:text-green-400"
            }`}
          >
            {policy.is_active ? "Disable" : "Enable"}
          </button>
          <Link
            href={`/dashboard/policies/${policy.id}/edit?workspace=${workspaceId}`}
            className="text-xs font-mono text-surface-500 hover:text-brand-400 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={onDelete}
            className="text-xs font-mono text-surface-500 hover:text-red-400 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </AnimateIn>
  );
}

export default function PoliciesPage() {
  const [workspaceId, setWorkspaceId] = useState<number | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [data, setData] = useState<PaginatedPolicies | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Policy | null>(null);

  const fetchPolicies = async (wsId: number, p: number, s?: string) => {
    setLoading(true);
    try {
      const result = await getPolicies(wsId, p, 20, {
        search: s || undefined,
      });
      setData(result);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workspaceId) fetchPolicies(workspaceId, page, activeSearch);
  }, [workspaceId, page, activeSearch]);

  const handleWorkspaceChange = (id: number) => {
    setWorkspaceId(id);
    setPage(1);
    setSearch("");
    setActiveSearch("");
    setInitialized(true);
  };

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setPage(1);
      setActiveSearch(search);
    }
  };

  const handleClearSearch = () => {
    setSearch("");
    setActiveSearch("");
    setPage(1);
  };

  const handleDeleted = () => {
    if (workspaceId) fetchPolicies(workspaceId, page, activeSearch);
    setDeleteTarget(null);
  };

  const handleTogglePolicy = async (policy: Policy) => {
    try {
      await updatePolicy(workspaceId!, policy.id, {
        is_active: !policy.is_active,
      });
      fetchPolicies(workspaceId!, page, activeSearch);
    } catch {}
  };

  const policies = data?.items || [];

  const formatLimit = (val: number | null) =>
    val === null ? "—" : val === -1 ? "∞" : val.toLocaleString();

  const formatBudget = (val: number | null) =>
    val === null ? "—" : `$${val.toFixed(2)}`;

  return (
    <div className="space-y-6">
      {/* Workspace selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs text-surface-500 font-mono">Workspace:</span>
          <WorkspaceSelector
            value={workspaceId}
            onChange={handleWorkspaceChange}
            onLoaded={(has) => {
              setInitialized(true);
              if (!has) setLoading(false);
            }}
          />
        </div>
      </div>

      {!initialized ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-surface-400 text-sm font-mono">Loading...</p>
          </div>
        </div>
      ) : !workspaceId ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">⬡</div>
          <h3 className="text-lg font-bold font-mono text-surface-300 mb-2">
            Select a workspace
          </h3>
          <p className="text-sm text-surface-500">
            Choose a workspace to manage its policies.
          </p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-surface-400 text-sm font-mono">Loading...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Action bar */}
          <AnimateIn delay={0}>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-900/60 border border-surface-800/40">
                <span className="text-surface-600 text-xs">⌕</span>
                <input
                  placeholder="Search policies... (Enter)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleSearch}
                  className="bg-transparent text-xs text-surface-300 placeholder-surface-600 font-mono outline-none w-full sm:w-48"
                />
                {activeSearch && (
                  <button
                    onClick={handleClearSearch}
                    className="text-surface-500 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
              <Link href={`/dashboard/policies/new?workspace=${workspaceId}`}>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  + Create Policy
                </Button>
              </Link>
            </div>
          </AnimateIn>

          {/* Content */}
          {policies.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">⬡</div>
              <h3 className="text-lg font-bold font-mono text-surface-300 mb-2">
                {activeSearch ? "No results" : "No policies"}
              </h3>
              <p className="text-sm text-surface-500 mb-6">
                {activeSearch
                  ? `No policies found for "${activeSearch}"`
                  : "Create your first policy to start enforcing AI usage rules."}
              </p>
              {activeSearch ? (
                <Button variant="ghost" size="sm" onClick={handleClearSearch}>
                  Clear search
                </Button>
              ) : (
                <Link href={`/dashboard/policies/new?workspace=${workspaceId}`}>
                  <Button variant="primary" size="sm">
                    + Create Policy
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <AnimateIn delay={100}>
              <Card>
                {/* Desktop table */}
                <div className="hidden lg:block">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-surface-800/30">
                          {[
                            "Name",
                            "Plan",
                            "Feature",
                            "Daily Requests",
                            "Monthly Requests",
                            "Daily Budget",
                            "Status",
                            "Actions",
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
                        {policies.map((policy) => (
                          <tr
                            key={policy.id}
                            className="border-b border-surface-800/15 hover:bg-surface-900/40 transition-colors"
                          >
                            <td className="px-4 py-3 text-sm font-mono text-surface-200 font-medium">
                              {policy.name}
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="brand">
                                {policy.plan || "any"}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-xs font-mono text-surface-400">
                              {policy.feature || "all"}
                            </td>
                            <td className="px-4 py-3 text-xs font-mono text-surface-400">
                              {formatLimit(policy.requests_per_day)}
                            </td>
                            <td className="px-4 py-3 text-xs font-mono text-surface-400">
                              {formatLimit(policy.requests_per_month)}
                            </td>
                            <td className="px-4 py-3 text-xs font-mono text-surface-400">
                              {formatBudget(policy.budget_per_day_usd)}
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                variant={
                                  policy.is_active ? "success" : "default"
                                }
                              >
                                {policy.is_active ? "active" : "inactive"}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleTogglePolicy(policy)}
                                  className={`text-xs font-mono transition-colors ${
                                    policy.is_active
                                      ? "text-surface-500 hover:text-yellow-400"
                                      : "text-surface-500 hover:text-green-400"
                                  }`}
                                >
                                  {policy.is_active ? "Disable" : "Enable"}
                                </button>
                                <Link
                                  href={`/dashboard/policies/${policy.id}/edit?workspace=${workspaceId}`}
                                  className="text-xs font-mono text-surface-500 hover:text-brand-400 transition-colors"
                                >
                                  Edit
                                </Link>
                                <button
                                  onClick={() => setDeleteTarget(policy)}
                                  className="text-xs font-mono text-surface-500 hover:text-red-400 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile cards */}
                <div className="lg:hidden">
                  {policies.map((policy, i) => (
                    <MobilePolicyCard
                      key={policy.id}
                      policy={policy}
                      workspaceId={workspaceId!}
                      delay={50 + i * 60}
                      onToggle={() => handleTogglePolicy(policy)}
                      onDelete={() => setDeleteTarget(policy)}
                    />
                  ))}
                </div>
              </Card>
            </AnimateIn>
          )}

          {/* Pagination */}
          {data && (
            <Pagination
              page={data.page}
              totalPages={data.total_pages}
              hasNext={data.has_next}
              hasPrev={data.has_prev}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      {deleteTarget && workspaceId && (
        <DeletePolicyModal
          open={true}
          onClose={() => setDeleteTarget(null)}
          onDeleted={handleDeleted}
          workspaceId={workspaceId}
          policyId={deleteTarget.id}
          policyName={deleteTarget.name}
        />
      )}
    </div>
  );
}
