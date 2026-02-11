"use client";

import Link from "next/link";
import { Button, Badge } from "@/components/ui";
import Card from "@/components/ui/Card";

const policies = [
  { id: 1, name: "free-plan-chat", plan: "free", feature: "chat", limitsDay: 50, limitsMonth: 500, budgetDay: "$1.00", status: "active" },
  { id: 2, name: "free-plan-summarize", plan: "free", feature: "summarize", limitsDay: 20, limitsMonth: 200, budgetDay: "$0.50", status: "active" },
  { id: 3, name: "pro-plan-default", plan: "pro", feature: "all", limitsDay: 1000, limitsMonth: 10000, budgetDay: "$50.00", status: "active" },
  { id: 4, name: "enterprise-default", plan: "enterprise", feature: "all", limitsDay: -1, limitsMonth: -1, budgetDay: "Unlimited", status: "active" },
  { id: 5, name: "test-policy", plan: "free", feature: "extract", limitsDay: 10, limitsMonth: 100, budgetDay: "$0.25", status: "inactive" },
];

export default function PoliciesPage() {
  return (
    <div className="space-y-6">
      {/* Action bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-900/60 border border-surface-800/40">
            <span className="text-surface-600 text-xs">⌕</span>
            <input
              placeholder="Search policies..."
              className="bg-transparent text-xs text-surface-300 placeholder-surface-600 font-mono outline-none w-48"
            />
          </div>
        </div>
        <Link href="/dashboard/policies/new">
          <Button variant="primary" size="sm">
            + Create Policy
          </Button>
        </Link>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-800/30">
                {["Name", "Plan", "Feature", "Daily Limit", "Monthly Limit", "Daily Budget", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-mono font-bold text-surface-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => (
                <tr key={policy.id} className="border-b border-surface-800/15 hover:bg-surface-900/40 transition-colors">
                  <td className="px-4 py-3 text-sm font-mono text-surface-200 font-medium">{policy.name}</td>
                  <td className="px-4 py-3">
                    <Badge variant="brand">{policy.plan}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-surface-400">{policy.feature}</td>
                  <td className="px-4 py-3 text-xs font-mono text-surface-400">
                    {policy.limitsDay === -1 ? "∞" : policy.limitsDay.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-surface-400">
                    {policy.limitsMonth === -1 ? "∞" : policy.limitsMonth.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-surface-400">{policy.budgetDay}</td>
                  <td className="px-4 py-3">
                    <Badge variant={policy.status === "active" ? "success" : "default"}>
                      {policy.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="text-xs font-mono text-surface-500 hover:text-brand-400 transition-colors">
                        Edit
                      </button>
                      <button className="text-xs font-mono text-surface-500 hover:text-red-400 transition-colors">
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
    </div>
  );
}
