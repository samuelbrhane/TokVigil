import {
  DEFAULT_BASE_URL,
  ENDPOINTS,
  DEFAULT_TIMEOUT,
  DEFAULT_RETRY_COUNT,
  DEFAULT_RETRY_DELAY,
  USER_AGENT,
} from "./constants";
import {
  TokenFenceError,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  NotFoundError,
  APIError,
  ConnectionError,
  TimeoutError,
} from "./exceptions";
import {
  TokenFenceConfig,
  EvaluateParams,
  EvaluateResult,
  LogUsageParams,
  UsageLogResult,
  UsageRecord,
  UsageSummary,
  UsageByGroup,
  PaginatedResponse,
  PaginationParams,
  RecentUsageParams,
  UsageSummaryParams,
} from "./types";

export class TokenFence {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;
  private retryCount: number;
  private retryDelay: number;

  constructor(config: TokenFenceConfig) {
    if (!config.apiKey) {
      throw new AuthenticationError("API key is required");
    }

    this.apiKey = config.apiKey;
    this.baseUrl = (config.baseUrl || DEFAULT_BASE_URL).replace(/\/$/, "");
    this.timeout = config.timeout || DEFAULT_TIMEOUT;
    this.retryCount = config.retryCount || DEFAULT_RETRY_COUNT;
    this.retryDelay = config.retryDelay || DEFAULT_RETRY_DELAY;
  }

  // ==================== HTTP Client ====================

  private async request<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    endpoint: string,
    params?: Record<string, unknown>,
    body?: Record<string, unknown>,
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.retryCount; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url.toString(), {
          method,
          headers: {
            "X-API-Key": this.apiKey,
            "Content-Type": "application/json",
            "User-Agent": USER_AGENT,
          },
          body: body ? JSON.stringify(this.toSnakeCase(body)) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        return await this.handleResponse<T>(response);
      } catch (error) {
        if (error instanceof RateLimitError) {
          throw error;
        }
        if (error instanceof TokenFenceError) {
          throw error;
        }
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            lastError = new TimeoutError(
              `Request timed out after ${this.timeout}ms`,
            );
          } else {
            lastError = new ConnectionError(
              "Failed to connect to TokenFence API",
            );
          }
        }

        if (attempt < this.retryCount - 1) {
          await this.sleep(this.retryDelay * (attempt + 1));
        }
      }
    }

    throw lastError || new APIError("Unknown error");
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 204) {
      return {} as T;
    }

    if (response.ok) {
      const data = await response.json();
      return this.toCamelCase(data) as T;
    }

    let errorCode = "UNKNOWN";
    let message = "Unknown error";
    let details: Record<string, unknown> | null = null;

    try {
      const errorData = await response.json();
      if (typeof errorData.detail === "object") {
        errorCode = errorData.detail.error_code || "UNKNOWN";
        message = errorData.detail.message || "Unknown error";
        details = errorData.detail.details || null;
      } else {
        message = errorData.detail || "Unknown error";
      }
    } catch {
      message = response.statusText || "Unknown error";
    }

    switch (response.status) {
      case 401:
      case 403:
        throw new AuthenticationError(message, errorCode, details);
      case 404:
        throw new NotFoundError(message, errorCode, details);
      case 422:
        throw new ValidationError(message, errorCode, details);
      case 429:
        const retryAfter = details?.retry_after as number | undefined;
        throw new RateLimitError(
          message,
          retryAfter || null,
          errorCode,
          details,
        );
      default:
        throw new APIError(message, response.status, errorCode, details);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ==================== Case Conversion ====================

  private toSnakeCase(obj: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
      result[snakeKey] = value;
    }
    return result;
  }

  private toCamelCase(obj: unknown): unknown {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.toCamelCase(item));
    }
    if (obj !== null && typeof obj === "object") {
      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(
        obj as Record<string, unknown>,
      )) {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
          letter.toUpperCase(),
        );
        result[camelKey] = this.toCamelCase(value);
      }
      return result;
    }
    return obj;
  }

  // ==================== Evaluate ====================

  async evaluate(params: EvaluateParams): Promise<EvaluateResult> {
    const data = await this.request<EvaluateResult>(
      "POST",
      ENDPOINTS.evaluate,
      undefined,
      {
        userId: params.userId,
        model: params.model,
        plan: params.plan,
        feature: params.feature,
        inputTokens: params.inputTokens,
        inputText: params.inputText,
        estimatedOutputTokens: params.estimatedOutputTokens,
      },
    );

    return data;
  }

  // ==================== Usage Logging ====================

  async logUsage(params: LogUsageParams): Promise<UsageLogResult> {
    const data = await this.request<UsageLogResult>(
      "POST",
      ENDPOINTS.usageLog,
      undefined,
      {
        requestId: params.requestId,
        userId: params.userId,
        model: params.model,
        inputTokens: params.inputTokens,
        outputTokens: params.outputTokens,
        status: params.status || "allowed",
        plan: params.plan,
        feature: params.feature,
        estimatedCostUsd: params.estimatedCostUsd,
        actualCostUsd: params.actualCostUsd,
        reasonCode: params.reasonCode,
        latencyMs: params.latencyMs,
        extraData: params.extraData,
      },
    );

    return data;
  }

  // ==================== Helper: Check and Call ====================

  async checkAndCall<T>(
    params: EvaluateParams,
    aiFunction: () => Promise<T>,
    getUsage?: (response: T) => { inputTokens: number; outputTokens: number },
  ): Promise<{ result: EvaluateResult; response: T | null }> {
    const requestId = crypto.randomUUID();
    const startTime = Date.now();

    const evalResult = await this.evaluate(params);

    if (!evalResult.allowed) {
      await this.logUsage({
        requestId,
        userId: params.userId,
        model: params.model,
        inputTokens: params.inputTokens || 0,
        outputTokens: 0,
        status: "blocked",
        plan: params.plan,
        feature: params.feature,
        reasonCode: evalResult.reasonCode,
      });

      return { result: evalResult, response: null };
    }

    try {
      const response = await aiFunction();
      const latencyMs = Date.now() - startTime;

      let inputTokens = params.inputTokens || 0;
      let outputTokens = 0;

      if (getUsage) {
        const usage = getUsage(response);
        inputTokens = usage.inputTokens;
        outputTokens = usage.outputTokens;
      }

      await this.logUsage({
        requestId,
        userId: params.userId,
        model: params.model,
        inputTokens,
        outputTokens,
        status: "allowed",
        plan: params.plan,
        feature: params.feature,
        latencyMs,
      });

      return { result: evalResult, response };
    } catch (error) {
      const latencyMs = Date.now() - startTime;

      await this.logUsage({
        requestId,
        userId: params.userId,
        model: params.model,
        inputTokens: params.inputTokens || 0,
        outputTokens: 0,
        status: "allowed",
        plan: params.plan,
        feature: params.feature,
        latencyMs,
        extraData: { error: String(error) },
      });

      throw error;
    }
  }

  // ==================== Usage Analytics ====================

  async getUsageSummary(params?: UsageSummaryParams): Promise<UsageSummary> {
    return await this.request<UsageSummary>(
      "GET",
      ENDPOINTS.usageSummary,
      params as Record<string, unknown>,
    );
  }

  async getRecentUsage(
    params?: RecentUsageParams,
  ): Promise<PaginatedResponse<UsageRecord>> {
    const data = await this.request<PaginatedResponse<UsageRecord>>(
      "GET",
      ENDPOINTS.usageRecent,
      {
        page: params?.page || 1,
        pageSize: params?.pageSize || 20,
        userId: params?.userId,
        feature: params?.feature,
        model: params?.model,
        status: params?.status,
      },
    );

    return {
      ...data,
      items: data.items.map((item) => ({
        ...item,
        createdAt: new Date(item.createdAt as unknown as string),
      })),
    };
  }

  async getBlockedRequests(
    params?: PaginationParams,
  ): Promise<PaginatedResponse<UsageRecord>> {
    const data = await this.request<PaginatedResponse<UsageRecord>>(
      "GET",
      ENDPOINTS.usageBlocked,
      {
        page: params?.page || 1,
        pageSize: params?.pageSize || 20,
      },
    );

    return {
      ...data,
      items: data.items.map((item) => ({
        ...item,
        createdAt: new Date(item.createdAt as unknown as string),
      })),
    };
  }

  async getUsageByUser(
    params?: PaginationParams,
  ): Promise<PaginatedResponse<UsageByGroup>> {
    return await this.request<PaginatedResponse<UsageByGroup>>(
      "GET",
      ENDPOINTS.usageByUser,
      {
        page: params?.page || 1,
        pageSize: params?.pageSize || 20,
      },
    );
  }

  async getUsageByFeature(
    params?: PaginationParams,
  ): Promise<PaginatedResponse<UsageByGroup>> {
    return await this.request<PaginatedResponse<UsageByGroup>>(
      "GET",
      ENDPOINTS.usageByFeature,
      {
        page: params?.page || 1,
        pageSize: params?.pageSize || 20,
      },
    );
  }
}
