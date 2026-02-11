"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  getGlobalRecent,
  getGlobalSummary,
  getGlobalTopUsers,
  TopUser,
  UsageRecord,
  UsageSummary,
} from "@/lib/dashboard";
import { getWorkspaces } from "@/lib/workspaces";
import { DashboardBanner } from "@/components/ui";
import TopUsersTable from "@/components/dashboard/TopUsersTable";
import { QuickActions, RecentActivity } from "@/components/dashboard";

function getPlanLimits(plan: string) {
  const plans: Record<
    string,
    {
      evaluate_calls_limit: number | null;
      rate_limit_per_minute: number | null;
    }
  > = {
    free: { evaluate_calls_limit: 1000, rate_limit_per_minute: 100 },
    pro: { evaluate_calls_limit: 50000, rate_limit_per_minute: 500 },
    premium: { evaluate_calls_limit: 500000, rate_limit_per_minute: 2000 },
    enterprise: { evaluate_calls_limit: null, rate_limit_per_minute: 10000 },
  };
  return plans[plan] || plans.free;
}
export default function DashboardOverview() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<UsageSummary | null>(null);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [recent, setRecent] = useState<UsageRecord[]>([]);
  const [apiKeyCount, setApiKeyCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryData, topUsersData, recentData, workspacesData] =
          await Promise.all([
            getGlobalSummary(),
            getGlobalTopUsers(5),
            getGlobalRecent(1, 5),
            getWorkspaces(),
          ]);
        setSummary(summaryData);
        setTopUsers(topUsersData);
        setRecent(recentData.items);
        setApiKeyCount(workspacesData.items.length);
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const planName = user?.plan || "free";
  const planLimits = getPlanLimits(planName);

  return (
    <div className="space-y-8">
      <DashboardBanner
        summary={summary}
        loading={loading}
        planLimits={planLimits}
        apiKeyCount={apiKeyCount}
        planName={planName}
      />

      <TopUsersTable users={topUsers} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <QuickActions />
        <RecentActivity records={recent} loading={loading} />
      </div>
    </div>
  );
}
