// API URLs
export const DEFAULT_BASE_URL = "https://api.tokenfence.io";
export const API_VERSION = "v1";

// Endpoints
export const ENDPOINTS = {
  evaluate: "/api/v1/evaluate",
  usageLog: "/api/v1/usage",
  usageRecent: "/api/v1/usage/recent",
  usageBlocked: "/api/v1/usage/blocked",
  usageSummary: "/api/v1/usage/summary",
  usageByUser: "/api/v1/usage/by-user",
  usageByFeature: "/api/v1/usage/by-feature",
} as const;

// Defaults
export const DEFAULT_TIMEOUT = 30000; // milliseconds
export const DEFAULT_RETRY_COUNT = 3;
export const DEFAULT_RETRY_DELAY = 1000; // milliseconds

// SDK Info
export const SDK_VERSION = "0.1.0";
export const SDK_NAME = "tokenfence-node";
export const USER_AGENT = `${SDK_NAME}/${SDK_VERSION}`;
