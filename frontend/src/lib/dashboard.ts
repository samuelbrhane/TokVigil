import { api } from "./api";

export interface UsageSummary {
  total_requests: number;
  total_tokens: number;
  total_cost_usd: number;
  allowed_count: number;
  blocked_count: number;
  workspace_count: number;
  policy_count: number;
  api_key_count: number;
}

export interface UsageRecord {
  id: number;
  request_id: string;
  user_id: string;
  feature: string | null;
  model: string;
  total_tokens: number;
  estimated_cost_usd: number;
  status: string;
  created_at: string;
}

export interface PaginatedUsage {
  items: UsageRecord[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface TopUser {
  user_id: string;
  requests: number;
  tokens: number;
  cost_usd: number;
  blocked: number;
}

export async function getGlobalSummary(): Promise<UsageSummary> {
  return api<UsageSummary>("/dashboard/usage/global/summary");
}

export async function getGlobalRecent(
  page = 1,
  pageSize = 10,
): Promise<PaginatedUsage> {
  return api<PaginatedUsage>(
    `/dashboard/usage/global/recent?page=${page}&page_size=${pageSize}`,
  );
}

export async function getGlobalTopUsers(limit = 5): Promise<TopUser[]> {
  return api<TopUser[]>(`/dashboard/usage/global/top-users?limit=${limit}`);
}

export interface DailyUsage {
  date: string;
  requests: number;
  tokens: number;
  cost_usd: number;
}

export async function getGlobalDaily(days = 7): Promise<DailyUsage[]> {
  return api<DailyUsage[]>(`/dashboard/usage/global/daily?days=${days}`);
}

export async function getUsageSummary(
  workspaceId: number,
  environmentId: number,
  startDate?: string,
  endDate?: string,
): Promise<UsageSummary> {
  let url = `/dashboard/usage/${workspaceId}/${environmentId}/summary`;
  const params = new URLSearchParams();
  if (startDate) params.set("start_date", startDate);
  if (endDate) params.set("end_date", endDate);
  if (params.toString()) url += `?${params}`;
  return api<UsageSummary>(url);
}

export async function getRecentUsage(
  workspaceId: number,
  environmentId: number,
  page = 1,
  pageSize = 20,
  filters?: {
    user_id?: string | null;
    feature?: string | null;
    model?: string | null;
    status?: string | null;
  },
): Promise<PaginatedUsage> {
  const params = new URLSearchParams();
  params.set("page", page.toString());
  params.set("page_size", pageSize.toString());
  if (filters?.user_id) params.set("user_id", filters.user_id);
  if (filters?.feature) params.set("feature", filters.feature);
  if (filters?.model) params.set("model", filters.model);
  if (filters?.status) params.set("status", filters.status);
  return api<PaginatedUsage>(
    `/dashboard/usage/${workspaceId}/${environmentId}/recent?${params}`,
  );
}

export async function getBlockedUsage(
  workspaceId: number,
  environmentId: number,
  page = 1,
  pageSize = 20,
): Promise<PaginatedUsage> {
  return api<PaginatedUsage>(
    `/dashboard/usage/${workspaceId}/${environmentId}/blocked?page=${page}&page_size=${pageSize}`,
  );
}

export interface UsageByGroup {
  group: string;
  requests: number;
  tokens: number;
  cost_usd: number;
}

export interface PaginatedUsageByGroup {
  items: UsageByGroup[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export async function getUsageByUser(
  workspaceId: number,
  environmentId: number,
  page = 1,
  pageSize = 20,
): Promise<PaginatedUsageByGroup> {
  return api<PaginatedUsageByGroup>(
    `/dashboard/usage/${workspaceId}/${environmentId}/by-user?page=${page}&page_size=${pageSize}`,
  );
}

export async function getUsageByFeature(
  workspaceId: number,
  environmentId: number,
  page = 1,
  pageSize = 20,
): Promise<PaginatedUsageByGroup> {
  return api<PaginatedUsageByGroup>(
    `/dashboard/usage/${workspaceId}/${environmentId}/by-feature?page=${page}&page_size=${pageSize}`,
  );
}

export async function getScopedDaily(
  workspaceId: number,
  environmentId: number,
  days = 7,
): Promise<DailyUsage[]> {
  return api<DailyUsage[]>(
    `/dashboard/usage/${workspaceId}/${environmentId}/daily?days=${days}`,
  );
}
