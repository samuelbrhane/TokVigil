export const DEFAULT_BASE_URL = "https://api.tokvigil.com";
export const API_VERSION = "v1";

export const ENDPOINTS = {
  evaluate: "/api/v1/evaluate",
  usage: "/api/v1/usage",
  usageSummary: "/api/v1/usage/summary",
  usageByUser: "/api/v1/usage/by-user",
  usageByFeature: "/api/v1/usage/by-feature",
  policies: "/api/v1/policies",
  workspaces: "/api/v1/workspaces",
  apiKeyInfo: "/api/v1/auth/api-key-info",
};

export const EXTENSION_ID = "tokvigil.tokvigil";
export const EXTENSION_NAME = "TokVigil";

export const SUPPORTED_LANGUAGES = ["python", "typescript", "javascript"];

export const SDK_METHODS = [
  {
    name: "evaluate",
    description: "Check if an AI request should be allowed",
    signature: "evaluate(params: EvaluateParams): EvaluateResult",
    params: [
      {
        name: "userId",
        type: "string",
        required: true,
        description: "Your app's user ID",
      },
      {
        name: "model",
        type: "string",
        required: true,
        description: "AI model name (e.g., 'gpt-4o-mini')",
      },
      {
        name: "plan",
        type: "string",
        required: false,
        description: "User's plan (e.g., 'free', 'pro')",
      },
      {
        name: "feature",
        type: "string",
        required: false,
        description: "Feature being used (e.g., 'chat')",
      },
      {
        name: "inputTokens",
        type: "number",
        required: false,
        description: "Number of input tokens",
      },
    ],
  },
  {
    name: "logUsage",
    description: "Log an AI call after completion",
    signature: "logUsage(params: LogUsageParams): UsageLogResult",
    params: [
      {
        name: "requestId",
        type: "string",
        required: true,
        description: "Unique request ID",
      },
      {
        name: "userId",
        type: "string",
        required: true,
        description: "Your app's user ID",
      },
      {
        name: "model",
        type: "string",
        required: true,
        description: "AI model name",
      },
      {
        name: "inputTokens",
        type: "number",
        required: true,
        description: "Actual input tokens used",
      },
      {
        name: "outputTokens",
        type: "number",
        required: true,
        description: "Actual output tokens used",
      },
      {
        name: "status",
        type: "string",
        required: false,
        description: "'allowed' or 'blocked'",
      },
      {
        name: "latencyMs",
        type: "number",
        required: false,
        description: "Request latency in ms",
      },
    ],
  },
  {
    name: "getUsageSummary",
    description: "Get usage summary statistics",
    signature: "getUsageSummary(params?: UsageSummaryParams): UsageSummary",
    params: [
      {
        name: "startDate",
        type: "string",
        required: false,
        description: "Filter from date (ISO format)",
      },
      {
        name: "endDate",
        type: "string",
        required: false,
        description: "Filter to date (ISO format)",
      },
    ],
  },
  {
    name: "getRecentUsage",
    description: "Get recent usage records",
    signature:
      "getRecentUsage(params?: RecentUsageParams): PaginatedResponse<UsageRecord>",
    params: [
      {
        name: "page",
        type: "number",
        required: false,
        description: "Page number",
      },
      {
        name: "pageSize",
        type: "number",
        required: false,
        description: "Items per page",
      },
      {
        name: "userId",
        type: "string",
        required: false,
        description: "Filter by user ID",
      },
    ],
  },
  {
    name: "getUsageByUser",
    description: "Get usage grouped by user",
    signature:
      "getUsageByUser(params?: PaginationParams): PaginatedResponse<UsageByGroup>",
    params: [
      {
        name: "page",
        type: "number",
        required: false,
        description: "Page number",
      },
      {
        name: "pageSize",
        type: "number",
        required: false,
        description: "Items per page",
      },
    ],
  },
  {
    name: "getUsageByFeature",
    description: "Get usage grouped by feature",
    signature:
      "getUsageByFeature(params?: PaginationParams): PaginatedResponse<UsageByGroup>",
    params: [
      {
        name: "page",
        type: "number",
        required: false,
        description: "Page number",
      },
      {
        name: "pageSize",
        type: "number",
        required: false,
        description: "Items per page",
      },
    ],
  },
  {
    name: "getBlockedRequests",
    description: "Get blocked requests",
    signature:
      "getBlockedRequests(params?: PaginationParams): PaginatedResponse<UsageRecord>",
    params: [
      {
        name: "page",
        type: "number",
        required: false,
        description: "Page number",
      },
      {
        name: "pageSize",
        type: "number",
        required: false,
        description: "Items per page",
      },
    ],
  },
];

export const REASON_CODES = {
  ALLOWED: "Request is allowed",
  NO_POLICY: "No policy found, request allowed by default",
  DAILY_REQUEST_LIMIT_EXCEEDED: "Daily request limit exceeded",
  MONTHLY_REQUEST_LIMIT_EXCEEDED: "Monthly request limit exceeded",
  DAILY_TOKEN_LIMIT_EXCEEDED: "Daily token limit exceeded",
  MONTHLY_TOKEN_LIMIT_EXCEEDED: "Monthly token limit exceeded",
  DAILY_BUDGET_EXCEEDED: "Daily budget exceeded",
  MONTHLY_BUDGET_EXCEEDED: "Monthly budget exceeded",
  MODEL_NOT_ALLOWED: "Model is not allowed by policy",
  MAX_COST_EXCEEDED: "Request cost exceeds maximum allowed",
};

// Supported AI Models
export const AI_MODELS = {
  // OpenAI - GPT-4o series
  "gpt-4o": { provider: "openai", label: "GPT-4o" },
  "gpt-4o-mini": { provider: "openai", label: "GPT-4o Mini" },

  // OpenAI - GPT-4 series
  "gpt-4-turbo": { provider: "openai", label: "GPT-4 Turbo" },
  "gpt-4": { provider: "openai", label: "GPT-4" },

  // OpenAI - GPT-3.5
  "gpt-3.5-turbo": { provider: "openai", label: "GPT-3.5 Turbo" },

  // Anthropic - Claude 3.5
  "claude-3-5-sonnet": { provider: "anthropic", label: "Claude 3.5 Sonnet" },
  "claude-3-5-haiku": { provider: "anthropic", label: "Claude 3.5 Haiku" },

  // Anthropic - Claude 3
  "claude-3-opus": { provider: "anthropic", label: "Claude 3 Opus" },
  "claude-3-sonnet": { provider: "anthropic", label: "Claude 3 Sonnet" },
  "claude-3-haiku": { provider: "anthropic", label: "Claude 3 Haiku" },

  // Google - Gemini
  "gemini-1.5-pro": { provider: "google", label: "Gemini 1.5 Pro" },
  "gemini-1.5-flash": { provider: "google", label: "Gemini 1.5 Flash" },
  "gemini-1.0-pro": { provider: "google", label: "Gemini 1.0 Pro" },

  // Mistral
  "mistral-large": { provider: "mistral", label: "Mistral Large" },
  "mistral-medium": { provider: "mistral", label: "Mistral Medium" },
  "mistral-small": { provider: "mistral", label: "Mistral Small" },

  // Meta - Llama
  "llama-3-70b": { provider: "meta", label: "Llama 3 70B" },
  "llama-3-8b": { provider: "meta", label: "Llama 3 8B" },

  // Cohere
  "command-r-plus": { provider: "cohere", label: "Command R+" },
  "command-r": { provider: "cohere", label: "Command R" },
};

export const PROVIDERS = [
  "openai",
  "anthropic",
  "google",
  "mistral",
  "meta",
  "cohere",
];

export function getModelsByProvider(provider: string): string[] {
  return Object.entries(AI_MODELS)
    .filter(([_, data]) => data.provider === provider)
    .map(([model]) => model);
}

export function getAllModels(): string[] {
  return Object.keys(AI_MODELS);
}
