import { describe, it, expect, vi, beforeEach } from "vitest";
import { TokenFence, AuthenticationError, RateLimitError } from "../src";

describe("TokenFence", () => {
  it("should require API key", () => {
    expect(() => new TokenFence({ apiKey: "" })).toThrow(AuthenticationError);
  });

  it("should initialize with API key", () => {
    const tf = new TokenFence({ apiKey: "tf_test_xxx" });
    expect(tf).toBeInstanceOf(TokenFence);
  });

  it("should use custom base URL", () => {
    const tf = new TokenFence({
      apiKey: "tf_test_xxx",
      baseUrl: "http://localhost:8000",
    });
    expect(tf).toBeInstanceOf(TokenFence);
  });

  describe("evaluate", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    it("should return allowed result", async () => {
      global.fetch = vi.fn().mockResolvedValue({
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
            },
            estimated_cost_usd: 0.001,
            policy_id: 1,
          }),
      });

      const tf = new TokenFence({ apiKey: "tf_test_xxx" });
      const result = await tf.evaluate({
        userId: "user_123",
        model: "gpt-4o-mini",
      });

      expect(result.allowed).toBe(true);
      expect(result.reasonCode).toBe("ALLOWED");
      expect(result.limitState?.requestsToday).toBe(10);
    });

    it("should return blocked result", async () => {
      global.fetch = vi.fn().mockResolvedValue({
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
          }),
      });

      const tf = new TokenFence({ apiKey: "tf_test_xxx" });
      const result = await tf.evaluate({
        userId: "user_123",
        model: "gpt-4o-mini",
      });

      expect(result.allowed).toBe(false);
      expect(result.reasonCode).toBe("DAILY_REQUEST_LIMIT_EXCEEDED");
    });

    it("should throw AuthenticationError on 401", async () => {
      global.fetch = vi.fn().mockResolvedValue({
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

      const tf = new TokenFence({ apiKey: "tf_test_invalid" });

      await expect(
        tf.evaluate({ userId: "user_123", model: "gpt-4o-mini" }),
      ).rejects.toThrow(AuthenticationError);
    });

    it("should throw RateLimitError on 429", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        json: () =>
          Promise.resolve({
            detail: {
              error_code: "RATE_LIMIT_EXCEEDED",
              message: "Too many requests",
              details: { retry_after: 30 },
            },
          }),
      });

      const tf = new TokenFence({ apiKey: "tf_test_xxx" });

      await expect(
        tf.evaluate({ userId: "user_123", model: "gpt-4o-mini" }),
      ).rejects.toThrow(RateLimitError);
    });
  });

  describe("logUsage", () => {
    it("should log usage successfully", async () => {
      global.fetch = vi.fn().mockResolvedValue({
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

      const tf = new TokenFence({ apiKey: "tf_test_xxx" });
      const result = await tf.logUsage({
        requestId: "req_123",
        userId: "user_123",
        model: "gpt-4o-mini",
        inputTokens: 100,
        outputTokens: 50,
        status: "allowed",
      });

      expect(result.recorded).toBe(true);
      expect(result.requestId).toBe("req_123");
    });
  });
});
