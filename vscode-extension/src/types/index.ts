export interface TokVigilConfig {
  apiKey: string;
  baseUrl: string;
}

export interface EvaluateParams {
  userId: string;
  model: string;
  plan?: string;
  feature?: string;
  inputTokens?: number;
}

export interface EvaluateResult {
  allowed: boolean;
  reasonCode: string;
  message: string;
  limitState?: LimitState;
  estimatedCostUsd?: number;
  policyId?: number;
}

export interface LimitState {
  requestsToday?: number;
  requestsLimitDaily?: number;
  requestsThisMonth?: number;
  requestsLimitMonthly?: number;
  tokensToday?: number;
  tokensLimitDaily?: number;
  tokensThisMonth?: number;
  tokensLimitMonthly?: number;
  costTodayUsd?: number;
  costLimitDailyUsd?: number;
  costThisMonthUsd?: number;
  costLimitMonthlyUsd?: number;
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

export interface Policy {
  id: number;
  name: string;
  plan?: string;
  feature?: string;
  requestsPerDay?: number;
  requestsPerMonth?: number;
  tokensPerDay?: number;
  tokensPerMonth?: number;
  budgetPerDayUsd?: number;
  budgetPerMonthUsd?: number;
  allowedModels?: string[];
  isActive: boolean;
}

export interface Workspace {
  id: number;
  name: string;
  isActive: boolean;
}

export interface Environment {
  id: number;
  name: string;
  workspaceId: number;
}

export interface SnippetDefinition {
  prefix: string;
  body: string[];
  description: string;
}
