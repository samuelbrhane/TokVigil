import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  UsageSentinel,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  NotFoundError,
} from "../src";

// Test configuration
const TEST_API_KEY = "us_test_xxx";
const TEST_BASE_URL = "http://localhost:8001";

describe("UsageSentinel", () => {
  // ==================== Initialization ====================
  describe("initialization", () => {
    it("should require API key", () => {
      expect(() => new UsageSentinel({ apiKey: "" })).toThrow(
        AuthenticationError,
      );
    });

    it("should initialize with API key", () => {
      const us = new UsageSentinel({ apiKey: TEST_API_KEY });
      expect(tf).toBeInstanceOf(UsageSentinel);
    });

    it("should use custom base URL", () => {
      const us = new UsageSentinel({
        apiKey: TEST_API_KEY,
        baseUrl: TEST_BASE_URL,
      });
      expect(tf).toBeInstanceOf(UsageSentinel);
    });

    it("should use custom timeout", () => {
      const us = new UsageSentinel({
        apiKey: TEST_API_KEY,
        timeout: 60000,
      });
      expect(tf).toBeInstanceOf(UsageSentinel);
    });

    it("should use custom retry settings", () => {
      const us = new UsageSentinel({
        apiKey: TEST_API_KEY,
        retryCount: 5,
        retryDelay: 2000,
      });
      expect(tf).toBeInstanceOf(UsageSentinel);
    });
  });

  // ==================== Evaluate ====================
  describe("evaluate", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    it("should return allowed result", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            allowed: true,
            reason_code: "ALLOWED",
            message: "Request allowed",
            limit_state: {
              requests_today: 10,
              requests_limit_daily: 50,
              tokens_today: 1000,
              tokens_limit_daily: 10000,
              cost_today_usd: 0.01,
              cost_limit_daily_usd: 1.0,
            },
            estimated_cost_usd: 0.001,
            policy_id: 1,
          }),
      });

      const us = new UsageSentinel({ apiKey: TEST_API_KEY });
      const result = await us.evaluate({
        userId: "user_123",
        model: "gpt-4o-mini",
        plan: "free",
        feature: "chat",
        inputTokens: 100,
      });

      expect(result.allowed).toBe(true);
      expect(result.reasonCode).toBe("ALLOWED");
      expect(result.limitState?.requestsToday).toBe(10);
      expect(result.limitState?.requestsLimitDaily).toBe(50);
      expect(result.estimatedCostUsd).toBe(0.001);
      expect(result.policyId).toBe(1);
    });

    it("should return blocked - daily request limit exceeded", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            allowed: false,
            reason_code: "DAILY_REQUEST_LIMIT_EXCEEDED",
            message: "Daily request limit (50) exceeded",
            limit_state: {
              requests_today: 50,
              requests_limit_daily: 50,
            },
            estimated_cost_usd: 0.001,
            policy_id: 1,
          }),
      });

      const us = new UsageSentinel({ apiKey: TEST_API_KEY });
      const result = await us.evaluate({
        userId: "user_123",
        model: "gpt-4o-mini",
      });

      expect(result.allowed).toBe(false);
      expect(result.reasonCode).toBe("DAILY_REQUEST_LIMIT_EXCEEDED");
      expect(result.limitState?.requestsToday).toBe(50);
    });

    it("should return blocked - monthly request limit exceeded", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            allowed: false,
            reason_code: "MONTHLY_REQUEST_LIMIT_EXCEEDED",
            message: "Monthly request limit (1000) exceeded",
            limit_state: {
              requests_this_month: 1000,
              requests_limit_monthly: 1000,
            },
          }),
      });

      const us = new UsageSentinel({ apiKey: TEST_API_KEY });
      const result = await us.evaluate({
        userId: "user_123",
        model: "gpt-4o-mini",
      });

      expect(result.allowed).toBe(false);
      expect(result.reasonCode).toBe("MONTHLY_REQUEST_LIMIT_EXCEEDED");
    });

    it("should return blocked - daily token limit exceeded", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            allowed: false,
            reason_code: "DAILY_TOKEN_LIMIT_EXCEEDED",
            message: "Daily token limit (10000) exceeded",
            limit_state: {
              tokens_today: 10000,
              tokens_limit_daily: 10000,
            },
          }),
      });

      const us = new UsageSentinel({ apiKey: TEST_API_KEY });
      const result = await us.evaluate({
        userId: "user_123",
        model: "gpt-4o-mini",
      });

      expect(result.allowed).toBe(false);
      expect(result.reasonCode).toBe("DAILY_TOKEN_LIMIT_EXCEEDED");
    });

    it("should return blocked - daily budget exceeded", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            allowed: false,
            reason_code: "DAILY_BUDGET_EXCEEDED",
            message: "Daily budget ($1.00) exceeded",
            limit_state: {
              cost_today_usd: 1.0,
              cost_limit_daily_usd: 1.0,
            },
          }),
      });

      const us = new UsageSentinel({ apiKey: TEST_API_KEY });
      const result = await us.evaluate({
        userId: "user_123",
        model: "gpt-4o-mini",
      });

      expect(result.allowed).toBe(false);
      expect(result.reasonCode).toBe("DAILY_BUDGET_EXCEEDED");
    });

    it("should return blocked - model not allowed", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            allowed: false,
            reason_code: "MODEL_NOT_ALLOWED",
            message: "Model 'gpt-4o' is not allowed",
          }),
      });

      const us = new UsageSentinel({ apiKey: TEST_API_KEY });
      const result = await us.evaluate({
        userId: "user_123",
        model: "gpt-4o",
      });

      expect(result.allowed).toBe(false);
      expect(result.reasonCode).toBe("MODEL_NOT_ALLOWED");
    });

    it("should return allowed with no policy", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            allowed: true,
            reason_code: "NO_POLICY",
            message: "No policy found, request allowed",
            limit_state: null,
            estimated_cost_usd: null,
            policy_id: null,
          }),
      });

      const us = new UsageSentinel({ apiKey: TEST_API_KEY });
      const result = await us.evaluate({
        userId: "user_123",
        model: "gpt-4o-mini",
      });

      expect(result.allowed).toBe(true);
      expect(result.reasonCode).toBe("NO_POLICY");
      expect(result.policyId).toBeNull();
    });
  });

  // ==================== Log Usage ====================
  describe("logUsage", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    it("should log usage successfully", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: () =>
          Promise.resolve({
            id: 1,
            request_id: "req_123",
            recorded: true,
            message: "Usage logged successfully",
          }),
      });

      const us = new UsageSentinel({ apiKey: TEST_API_KEY });
      const result = await us.logUsage({
        requestId: "req_123",
        userId: "user_123",
        model: "gpt-4o-mini",
        inputTokens: 100,
        outputTokens: 50,
        status: "allowed",
        plan: "free",
        feature: "chat",
        latencyMs: 350,
      });

      expect(result.recorded).toBe(true);
      expect(result.requestId).toBe("req_123");
      expect(result.id).toBe(1);
    });

    it("should log blocked request", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: () =>
          Promise.resolve({
            id: 2,
            request_id: "req_456",
            recorded: true,
            message: "Usage logged successfully",
          }),
      });

      const us = new UsageSentinel({ apiKey: TEST_API_KEY });
      const result = await us.logUsage({
        requestId: "req_456",
        userId: "user_123",
        model: "gpt-4o-mini",
        inputTokens: 100,
        outputTokens: 0,
        status: "blocked",
        reasonCode: "DAILY_REQUEST_LIMIT_EXCEEDED",
      });

      expect(result.recorded).toBe(true);
      expect(result.requestId).toBe("req_456");
    });
  });

  // ==================== Usage Summary ====================
  describe("getUsageSummary", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    it("should get usage summary", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            total_requests: 100,
            total_tokens: 15000,
            total_cost_usd: 1.5,
            allowed_count: 95,
            blocked_count: 5,
          }),
      });

      const us = new UsageSentinel({ apiKey: TEST_API_KEY });
      const result = await us.getUsageSummary();

      expect(result.totalRequests).toBe(100);
      expect(result.totalTokens).toBe(15000);
      expect(result.totalCostUsd).toBe(1.5);
      expect(result.allowedCount).toBe(95);
      expect(result.blockedCount).toBe(5);
    });

    it("should get usage summary with date filters", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            total_requests: 50,
            total_tokens: 7500,
            total_cost_usd: 0.75,
            allowed_count: 48,
            blocked_count: 2,
          }),
      });

      const us = new UsageSentinel({ apiKey: TEST_API_KEY });
      const result = await us.getUsageSummary({
        startDate: "2025-01-01",
        endDate: "2025-01-31",
      });

      expect(result.totalRequests).toBe(50);
    });
  });

  // ==================== Recent Usage ====================
  describe("getRecentUsage", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    it("should get recent usage with pagination", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            items: [
              {
                id: 1,
                request_id: "req_1",
                user_id: "user_123",
                model: "gpt-4o-mini",
                input_tokens: 100,
                output_tokens: 50,
                total_tokens: 150,
                estimated_cost_usd: 0.001,
                status: "allowed",
                created_at: "2025-02-09T10:00:00Z",
              },
            ],
            total: 1,
            page: 1,
            page_size: 20,
            total_pages: 1,
            has_next: false,
            has_prev: false,
          }),
      });

      const us = new UsageSentinel({ apiKey: TEST_API_KEY });
      const result = await us.getRecentUsage({ page: 1, pageSize: 20 });

      expect(result.items.length).toBe(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.hasNext).toBe(false);
    });

    it("should filter recent usage by user", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            items: [],
            total: 0,
            page: 1,
            page_size: 20,
            total_pages: 0,
            has_next: false,
            has_prev: false,
          }),
      });

      const us = new UsageSentinel({ apiKey: TEST_API_KEY });
      const result = await us.getRecentUsage({ userId: "user_456" });

      expect(result.items.length).toBe(0);
    });
  });

  // ==================== Usage By User ====================
  describe("getUsageByUser", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    it("should get usage grouped by user", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            items: [
              { group: "user_123", requests: 50, tokens: 7500, cost_usd: 0.75 },
              { group: "user_456", requests: 30, tokens: 4500, cost_usd: 0.45 },
            ],
            total: 2,
            page: 1,
            page_size: 20,
            total_pages: 1,
            has_next: false,
            has_prev: false,
          }),
      });

      const us = new UsageSentinel({ apiKey: TEST_API_KEY });
      const result = await us.getUsageByUser();

      expect(result.items.length).toBe(2);
      expect(result.items[0].group).toBe("user_123");
      expect(result.items[0].requests).toBe(50);
    });
  });

  // ==================== Usage By Feature ====================
  describe("getUsageByFeature", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    it("should get usage grouped by feature", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            items: [
              { group: "chat", requests: 80, tokens: 12000, cost_usd: 1.2 },
              { group: "summarize", requests: 20, tokens: 3000, cost_usd: 0.3 },
            ],
            total: 2,
            page: 1,
            page_size: 20,
            total_pages: 1,
            has_next: false,
            has_prev: false,
          }),
      });

      const us = new UsageSentinel({ apiKey: TEST_API_KEY });
      const result = await us.getUsageByFeature();

      expect(result.items.length).toBe(2);
      expect(result.items[0].group).toBe("chat");
      expect(result.items[0].requests).toBe(80);
    });
  });

  // ==================== Blocked Requests ====================
  describe("getBlockedRequests", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    it("should get blocked requests", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            items: [
              {
                id: 1,
                request_id: "req_blocked_1",
                user_id: "user_123",
                model: "gpt-4o-mini",
                input_tokens: 100,
                output_tokens: 0,
                total_tokens: 100,
                estimated_cost_usd: 0.001,
                status: "blocked",
                reason_code: "DAILY_REQUEST_LIMIT_EXCEEDED",
                created_at: "2025-02-09T10:00:00Z",
              },
            ],
            total: 1,
            page: 1,
            page_size: 20,
            total_pages: 1,
            has_next: false,
            has_prev: false,
          }),
      });

      const us = new UsageSentinel({ apiKey: TEST_API_KEY });
      const result = await us.getBlockedRequests();

      expect(result.items.length).toBe(1);
      expect(result.items[0].status).toBe("blocked");
      expect(result.items[0].reasonCode).toBe("DAILY_REQUEST_LIMIT_EXCEEDED");
    });
  });

  // ==================== Error Handling ====================
  describe("error handling", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    it("should throw AuthenticationError on 401", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: () =>
          Promise.resolve({
            detail: {
              error_code: "INVALID_API_KEY",
              message: "Invalid API key",
            },
          }),
      });

      const us = new UsageSentinel({ apiKey: TEST_API_KEY });

      await expect(
        us.evaluate({ userId: "user_123", model: "gpt-4o-mini" }),
      ).rejects.toThrow(AuthenticationError);
    });

    it("should throw AuthenticationError on 403 - API key revoked", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        json: () =>
          Promise.resolve({
            detail: {
              error_code: "API_KEY_REVOKED",
              message: "API key has been revoked",
            },
          }),
      });

      const us = new UsageSentinel({ apiKey: TEST_API_KEY });

      await expect(
        us.evaluate({ userId: "user_123", model: "gpt-4o-mini" }),
      ).rejects.toThrow(AuthenticationError);
    });

    it("should throw RateLimitError on 429 with retry_after", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        json: () =>
          Promise.resolve({
            detail: {
              error_code: "RATE_LIMIT_EXCEEDED",
              message: "Too many requests. Limit: 1000/minute",
              details: { retry_after: 30, limit: 1000 },
            },
          }),
      });

      const us = new UsageSentinel({ apiKey: TEST_API_KEY });

      try {
        await us.evaluate({ userId: "user_123", model: "gpt-4o-mini" });
        expect.fail("Should have thrown RateLimitError");
      } catch (error) {
        expect(error).toBeInstanceOf(RateLimitError);
        expect((error as RateLimitError).retryAfter).toBe(30);
      }
    });

    it("should throw ValidationError on 422", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
        json: () =>
          Promise.resolve({
            detail: {
              error_code: "VALIDATION_ERROR",
              message: "Invalid input data",
            },
          }),
      });

      const us = new UsageSentinel({ apiKey: TEST_API_KEY });

      await expect(
        us.evaluate({ userId: "user_123", model: "gpt-4o-mini" }),
      ).rejects.toThrow(ValidationError);
    });

    it("should throw NotFoundError on 404", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: () =>
          Promise.resolve({
            detail: {
              error_code: "WORKSPACE_NOT_FOUND",
              message: "Workspace not found",
            },
          }),
      });

      const us = new UsageSentinel({ apiKey: TEST_API_KEY });

      await expect(
        us.evaluate({ userId: "user_123", model: "gpt-4o-mini" }),
      ).rejects.toThrow(NotFoundError);
    });
  });
});
