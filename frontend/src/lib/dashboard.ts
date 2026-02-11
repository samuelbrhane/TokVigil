import { api } from "./api";

export interface UsageSummary {
  total_requests: number;
  total_tokens: number;
  total_cost_usd: number;
  allowed_count: number;
  blocked_count: number;
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
