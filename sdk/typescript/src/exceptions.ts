export interface ErrorDetails {
  [key: string]: unknown;
}

export class UsageSentinelError extends Error {
  public errorCode: string | null;
  public details: ErrorDetails | null;

  constructor(
    message: string,
    errorCode: string | null = null,
    details: ErrorDetails | null = null,
  ) {
    super(message);
    this.name = "UsageSentinelError";
    this.errorCode = errorCode;
    this.details = details;
  }
}

export class AuthenticationError extends UsageSentinelError {
  constructor(
    message: string = "Unauthorized",
    errorCode: string | null = null,
    details: ErrorDetails | null = null,
  ) {
    super(message, errorCode, details);
    this.name = "AuthenticationError";
  }
}

export class RateLimitError extends UsageSentinelError {
  public retryAfter: number | null;

  constructor(
    message: string = "Rate limit exceeded",
    retryAfter: number | null = null,
    errorCode: string | null = null,
    details: ErrorDetails | null = null,
  ) {
    super(message, errorCode, details);
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }
}

export class ValidationError extends UsageSentinelError {
  constructor(
    message: string = "Validation error",
    errorCode: string | null = null,
    details: ErrorDetails | null = null,
  ) {
    super(message, errorCode, details);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends UsageSentinelError {
  constructor(
    message: string = "Resource not found",
    errorCode: string | null = null,
    details: ErrorDetails | null = null,
  ) {
    super(message, errorCode, details);
    this.name = "NotFoundError";
  }
}

export class APIError extends UsageSentinelError {
  public statusCode: number | null;

  constructor(
    message: string = "API error",
    statusCode: number | null = null,
    errorCode: string | null = null,
    details: ErrorDetails | null = null,
  ) {
    super(message, errorCode, details);
    this.name = "APIError";
    this.statusCode = statusCode;
  }
}

export class ConnectionError extends UsageSentinelError {
  constructor(
    message: string = "Connection failed",
    errorCode: string | null = null,
    details: ErrorDetails | null = null,
  ) {
    super(message, errorCode, details);
    this.name = "ConnectionError";
  }
}

export class TimeoutError extends UsageSentinelError {
  constructor(
    message: string = "Request timed out",
    errorCode: string | null = null,
    details: ErrorDetails | null = null,
  ) {
    super(message, errorCode, details);
    this.name = "TimeoutError";
  }
}
