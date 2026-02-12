export interface UsageSentinelConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  retryCount?: number;
  retryDelay?: number;
}

export interface LimitState {
  requestsToday?: number | null;
  requestsLimitDaily?: number | null;
  requestsThisMonth?: number | null;
  requestsLimitMonthly?: number | null;
  tokensToday?: number | null;
  tokensLimitDaily?: number | null;
  tokensThisMonth?: number | null;
  tokensLimitMonthly?: number | null;
  costTodayUsd?: number | null;
  costLimitDailyUsd?: number | null;
  costThisMonthUsd?: number | null;
  costLimitMonthlyUsd?: number | null;
}

export interface EvaluateParams {
  userId: string;
  model: string;
  plan?: string;
  feature?: string;
  inputTokens?: number;
  inputText?: string;
  estimatedOutputTokens?: number;
}

export interface EvaluateResult {
  allowed: boolean;
  reasonCode: string;
  message: string;
  limitState?: LimitState | null;
  estimatedCostUsd?: number | null;
  policyId?: number | null;
}

export interface LogUsageParams {
  requestId: string;
  userId: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  status?: "allowed" | "blocked";
  plan?: string;
  feature?: string;
  estimatedCostUsd?: number;
  actualCostUsd?: number;
  reasonCode?: string;
  latencyMs?: number;
  extraData?: Record<string, unknown>;
}

export interface UsageLogResult {
  id: number;
  requestId: string;
  recorded: boolean;
  message: string;
}

export interface UsageRecord {
  id: number;
  requestId: string;
  userId: string;
  plan?: string | null;
  feature?: string | null;
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  actualCostUsd?: number | null;
  status: string;
  reasonCode?: string | null;
  latencyMs?: number | null;
  createdAt: Date;
}

export interface UsageSummary {
  totalRequests: number;
  totalTokens: number;
  totalCostUsd: number;
  allowedCount: number;
  blockedCount: number;
}

export interface UsageByGroup {
  group: string;
  requests: number;
  tokens: number;
  costUsd: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface RecentUsageParams extends PaginationParams {
  userId?: string;
  feature?: string;
  model?: string;
  status?: string;
}

export interface UsageSummaryParams {
  startDate?: string;
  endDate?: string;
}

// API response types (snake_case from API)
export interface APILimitState {
  requests_today?: number | null;
  requests_limit_daily?: number | null;
  requests_this_month?: number | null;
  requests_limit_monthly?: number | null;
  tokens_today?: number | null;
  tokens_limit_daily?: number | null;
  tokens_this_month?: number | null;
  tokens_limit_monthly?: number | null;
  cost_today_usd?: number | null;
  cost_limit_daily_usd?: number | null;
  cost_this_month_usd?: number | null;
  cost_limit_monthly_usd?: number | null;
}

export interface APIEvaluateResult {
  allowed: boolean;
  reason_code: string;
  message: string;
  limit_state?: APILimitState | null;
  estimated_cost_usd?: number | null;
  policy_id?: number | null;
}

export interface APIUsageLogResult {
  id: number;
  request_id: string;
  recorded: boolean;
  message: string;
}

export interface APIUsageRecord {
  id: number;
  request_id: string;
  user_id: string;
  plan?: string | null;
  feature?: string | null;
  model: string;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  estimated_cost_usd: number;
  actual_cost_usd?: number | null;
  status: string;
  reason_code?: string | null;
  latency_ms?: number | null;
  created_at: string;
}

export interface APIUsageSummary {
  total_requests: number;
  total_tokens: number;
  total_cost_usd: number;
  allowed_count: number;
  blocked_count: number;
}

export interface APIUsageByGroup {
  group: string;
  requests: number;
  tokens: number;
  cost_usd: number;
}

export interface APIPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}
