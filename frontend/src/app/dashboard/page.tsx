"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  DailyUsage,
  getGlobalDaily,
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
import {
  QuickActions,
  RecentActivity,
  RequestsChart,
} from "@/components/dashboard";

export default function DashboardOverview() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<UsageSummary | null>(null);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [recent, setRecent] = useState<UsageRecord[]>([]);
  const [chartData, setChartData] = useState<Record<string, DailyUsage[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          summaryData,
          topUsersData,
          recentData,
          dailyData,
          workspacesData,
        ] = await Promise.all([
          getGlobalSummary(),
          getGlobalTopUsers(5),
          getGlobalRecent(1, 5),
          getGlobalDaily(7),
          getWorkspaces(),
        ]);
        setSummary(summaryData);
        setTopUsers(topUsersData);
        setRecent(recentData.items);
        setChartData({ "7d": dailyData });
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePeriodChange = async (days: number) => {
    const label = `${days}d`;
    if (chartData[label]) return;
    try {
      const data = await getGlobalDaily(days);
      setChartData((prev) => ({ ...prev, [label]: data }));
    } catch {
      // handle error
    }
  };

  return (
    <div className="space-y-8">
      <DashboardBanner summary={summary} loading={loading} />

      <RequestsChart
        data={chartData}
        loading={loading}
        onPeriodChange={handlePeriodChange}
      />

      <TopUsersTable users={topUsers} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <QuickActions />
        <RecentActivity records={recent} loading={loading} />
      </div>
    </div>
  );
}
