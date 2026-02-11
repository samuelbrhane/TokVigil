export interface Policy {
  id: number;
  workspace_id: number;
  name: string;
  plan: string | null;
  feature: string | null;
  user_id: string | null;
  requests_per_day: number | null;
  requests_per_month: number | null;
  tokens_per_day: number | null;
  tokens_per_month: number | null;
  budget_per_day_usd: number | null;
  budget_per_month_usd: number | null;
  max_cost_per_request_usd: number | null;
  allowed_models: string[] | null;
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginatedPolicies {
  items: Policy[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PolicyFormData {
  name: string;
  plan: string;
  feature: string;
  user_id: string;
  requests_per_day: number | null;
  requests_per_month: number | null;
  tokens_per_day: number | null;
  tokens_per_month: number | null;
  budget_per_day_usd: number | null;
  budget_per_month_usd: number | null;
  max_cost_per_request_usd: number | null;
  allowed_models: string[];
  priority: number;
}
