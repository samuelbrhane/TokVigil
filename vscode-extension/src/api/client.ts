import * as vscode from "vscode";
import {
  TokenFenceConfig,
  EvaluateParams,
  EvaluateResult,
  UsageSummary,
  UsageByGroup,
  Policy,
  Workspace,
  LimitState,
} from "../types";
import { ENDPOINTS } from "../config/constants";

interface LogUsageParams {
  requestId: string;
  userId: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  status: string;
  plan?: string;
  feature?: string;
  reasonCode?: string;
}

interface LogUsageResult {
  recorded: boolean;
  requestId: string;
}

interface ApiKeyInfo {
  keyPrefix: string;
  name: string;
  environmentId: number;
  environmentName: string;
  workspaceId: number;
  workspaceName: string;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  errorCode?: string;
}

export class TokenFenceApiClient {
  private config: TokenFenceConfig;

  constructor(config: TokenFenceConfig) {
    this.config = config;
  }

  updateConfig(config: TokenFenceConfig): void {
    this.config = config;
  }

  private async request<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    endpoint: string,
    params?: Record<string, unknown>,
    body?: Record<string, unknown>,
  ): Promise<ApiResponse<T>> {
    if (!this.config.apiKey) {
      return { error: "API key not configured", errorCode: "NO_API_KEY" };
    }

    try {
      const url = new URL(`${this.config.baseUrl}${endpoint}`);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(this.toSnakeCase(key), String(value));
          }
        });
      }

      const response = await fetch(url.toString(), {
        method,
        headers: {
          "X-API-Key": this.config.apiKey,
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(this.toSnakeCaseObject(body)) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData?.detail?.message || errorData?.detail || "Request failed";
        const errorCode = errorData?.detail?.error_code || "UNKNOWN";
        return { error: errorMessage, errorCode };
      }

      if (response.status === 204) {
        return { data: {} as T };
      }

      const data = await response.json();
      return { data: this.toCamelCaseObject(data) as T };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { error: message, errorCode: "CONNECTION_ERROR" };
    }
  }

  private toSnakeCase(str: string): string {
    return str.replace(/([A-Z])/g, "_$1").toLowerCase();
  }

  private toSnakeCaseObject(
    obj: Record<string, unknown>,
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[this.toSnakeCase(key)] = value;
    }
    return result;
  }

  private toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  private toCamelCaseObject(obj: unknown): unknown {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.toCamelCaseObject(item));
    }
    if (obj !== null && typeof obj === "object") {
      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(
        obj as Record<string, unknown>,
      )) {
        result[this.toCamelCase(key)] = this.toCamelCaseObject(value);
      }
      return result;
    }
    return obj;
  }

  // ==================== Evaluate ====================

  async evaluate(params: EvaluateParams): Promise<ApiResponse<EvaluateResult>> {
    return this.request<EvaluateResult>(
      "POST",
      ENDPOINTS.evaluate,
      undefined,
      params as unknown as Record<string, unknown>,
    );
  }

  // ==================== Usage ====================

  async getUsageSummary(
    startDate?: string,
    endDate?: string,
  ): Promise<UsageSummary> {
    const response = await this.request<UsageSummary>(
      "GET",
      ENDPOINTS.usageSummary,
      {
        startDate,
        endDate,
      },
    );

    if (response.error || !response.data) {
      return {
        totalRequests: 0,
        totalTokens: 0,
        totalCostUsd: 0,
        allowedCount: 0,
        blockedCount: 0,
      };
    }

    return response.data;
  }

  async getUsageByUser(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginatedResponse<UsageByGroup>> {
    const response = await this.request<PaginatedResponse<UsageByGroup>>(
      "GET",
      ENDPOINTS.usageByUser,
      {
        page,
        pageSize,
      },
    );

    if (response.error || !response.data) {
      return {
        items: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      };
    }

    return response.data;
  }

  async getUsageByFeature(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginatedResponse<UsageByGroup>> {
    const response = await this.request<PaginatedResponse<UsageByGroup>>(
      "GET",
      ENDPOINTS.usageByFeature,
      {
        page,
        pageSize,
      },
    );

    if (response.error || !response.data) {
      return {
        items: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      };
    }

    return response.data;
  }

  // ==================== Policies ====================

  async getPolicies(workspaceId: number): Promise<Policy[]> {
    const response = await this.request<PaginatedResponse<Policy>>(
      "GET",
      `${ENDPOINTS.policies}/${workspaceId}`,
    );

    if (response.error || !response.data) {
      return [];
    }

    return response.data.items || [];
  }

  // ==================== Workspaces ====================

  async getWorkspaces(): Promise<Workspace[]> {
    const response = await this.request<PaginatedResponse<Workspace>>(
      "GET",
      ENDPOINTS.workspaces,
    );

    if (response.error || !response.data) {
      return [];
    }

    return response.data.items || [];
  }

  // ==================== Health Check ====================

  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const summary = await this.getUsageSummary();
      return {
        success: true,
        message: `Connected! Total requests: ${summary.totalRequests}`,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Connection failed",
      };
    }
  }

  async getApiKeyInfo(): Promise<ApiKeyInfo | null> {
    const response = await this.request<ApiKeyInfo>(
      "GET",
      "/api/v1/auth/api-key-info",
    );

    if (response.error || !response.data) {
      return null;
    }

    return response.data;
  }

  async logUsage(params: LogUsageParams): Promise<LogUsageResult | null> {
    const response = await this.request<LogUsageResult>(
      "POST",
      ENDPOINTS.usage,
      undefined,
      params as unknown as Record<string, unknown>,
    );

    if (response.error || !response.data) {
      return null;
    }

    return response.data;
  }
}
