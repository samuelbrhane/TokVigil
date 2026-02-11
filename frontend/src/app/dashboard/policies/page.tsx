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

export default function PoliciesPage() {
  const [workspaceId, setWorkspaceId] = useState<number | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [data, setData] = useState<PaginatedPolicies | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Policy | null>(null);

  const fetchPolicies = async (wsId: number, p: number) => {
    setLoading(true);
    try {
      const result = await getPolicies(wsId, p);
      setData(result);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workspaceId) fetchPolicies(workspaceId, page);
  }, [workspaceId, page]);

  const handleWorkspaceChange = (id: number) => {
    setWorkspaceId(id);
    setPage(1);
    setInitialized(true);
  };

  const handleDeleted = () => {
    if (workspaceId) fetchPolicies(workspaceId, page);
    setDeleteTarget(null);
  };

  const filteredPolicies =
    data?.items.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.plan?.toLowerCase().includes(search.toLowerCase()) ||
        p.feature?.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  const formatLimit = (val: number | null) =>
    val === null ? "—" : val === -1 ? "∞" : val.toLocaleString();

  const formatBudget = (val: number | null) =>
    val === null ? "—" : `$${val.toFixed(2)}`;

  return (
    <div className="space-y-6">
      {/* Workspace selector */}
      <div className="flex items-center justify-between">
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-900/60 border border-surface-800/40">
              <span className="text-surface-600 text-xs">⌕</span>
              <input
                placeholder="Search policies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-xs text-surface-300 placeholder-surface-600 font-mono outline-none w-48"
              />
            </div>
            <Link href={`/dashboard/policies/new?workspace=${workspaceId}`}>
              <Button variant="primary" size="sm">
                + Create Policy
              </Button>
            </Link>
          </div>

          {/* Table */}
          {filteredPolicies.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">⬡</div>
              <h3 className="text-lg font-bold font-mono text-surface-300 mb-2">
                No policies
              </h3>
              <p className="text-sm text-surface-500 mb-6">
                Create your first policy to start enforcing AI usage rules.
              </p>
              <Link href={`/dashboard/policies/new?workspace=${workspaceId}`}>
                <Button variant="primary" size="sm">
                  + Create Policy
                </Button>
              </Link>
            </div>
          ) : (
            <Card className="animate-fade-in">
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
                    {filteredPolicies.map((policy) => (
                      <tr
                        key={policy.id}
                        className="border-b border-surface-800/15 hover:bg-surface-900/40 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-mono text-surface-200 font-medium">
                          {policy.name}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="brand">{policy.plan || "any"}</Badge>
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
                            variant={policy.is_active ? "success" : "default"}
                          >
                            {policy.is_active ? "active" : "inactive"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={async () => {
                                try {
                                  await updatePolicy(workspaceId!, policy.id, {
                                    is_active: !policy.is_active,
                                  });
                                  fetchPolicies(workspaceId!, page);
                                } catch {}
                              }}
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
            </Card>
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
