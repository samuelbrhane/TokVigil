from fastapi import HTTPException, status
from typing import Any, Optional


class APIError(HTTPException):
    def __init__(
        self,
        status_code: int,
        error_code: str,
        message: str,
        details: Optional[Any] = None
    ):
        super().__init__(
            status_code=status_code,
            detail={
                "error_code": error_code,
                "message": message,
                "details": details
            }
        )


# ==================== Auth Errors ====================

class UnauthorizedError(APIError):
    def __init__(self, message: str = "Unauthorized", details: Any = None):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            error_code="UNAUTHORIZED",
            message=message,
            details=details
        )


class InvalidAPIKeyError(APIError):
    def __init__(self, message: str = "Invalid API key", details: Any = None):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            error_code="INVALID_API_KEY",
            message=message,
            details=details
        )


class InvalidTokenError(APIError):
    def __init__(self, message: str = "Invalid or expired token", details: Any = None):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            error_code="INVALID_TOKEN",
            message=message,
            details=details
        )


# ==================== Permission Errors ====================

class ForbiddenError(APIError):
    def __init__(self, message: str = "Forbidden", details: Any = None):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            error_code="FORBIDDEN",
            message=message,
            details=details
        )


class APIKeyRevokedError(APIError):
    def __init__(self, message: str = "API key has been revoked", details: Any = None):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            error_code="API_KEY_REVOKED",
            message=message,
            details=details
        )


class WorkspaceInactiveError(APIError):
    def __init__(self, message: str = "Workspace has been deactivated", details: Any = None):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            error_code="WORKSPACE_INACTIVE",
            message=message,
            details=details
        )


class EnvironmentInactiveError(APIError):
    def __init__(self, message: str = "Environment has been deactivated", details: Any = None):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            error_code="ENVIRONMENT_INACTIVE",
            message=message,
            details=details
        )


# ==================== Not Found Errors ====================

class NotFoundError(APIError):
    def __init__(self, message: str = "Resource not found", details: Any = None):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            error_code="NOT_FOUND",
            message=message,
            details=details
        )


class WorkspaceNotFoundError(APIError):
    def __init__(self, message: str = "Workspace not found", details: Any = None):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            error_code="WORKSPACE_NOT_FOUND",
            message=message,
            details=details
        )


class EnvironmentNotFoundError(APIError):
    def __init__(self, message: str = "Environment not found", details: Any = None):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            error_code="ENVIRONMENT_NOT_FOUND",
            message=message,
            details=details
        )


class PolicyNotFoundError(APIError):
    def __init__(self, message: str = "Policy not found", details: Any = None):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            error_code="POLICY_NOT_FOUND",
            message=message,
            details=details
        )


class APIKeyNotFoundError(APIError):
    def __init__(self, message: str = "API key not found", details: Any = None):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            error_code="API_KEY_NOT_FOUND",
            message=message,
            details=details
        )


class UserNotFoundError(APIError):
    def __init__(self, message: str = "User not found", details: Any = None):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            error_code="USER_NOT_FOUND",
            message=message,
            details=details
        )


# ==================== Rate Limit Errors ====================

class RateLimitExceededError(APIError):
    def __init__(self, message: str = "Rate limit exceeded", details: Any = None):
        super().__init__(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            error_code="RATE_LIMIT_EXCEEDED",
            message=message,
            details=details
        )


# ==================== Validation Errors ====================

class ValidationError(APIError):
    def __init__(self, message: str = "Validation error", details: Any = None):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            error_code="VALIDATION_ERROR",
            message=message,
            details=details
        )


class BadRequestError(APIError):
    def __init__(self, message: str = "Bad request", details: Any = None):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            error_code="BAD_REQUEST",
            message=message,
            details=details
        )


class EmailAlreadyExistsError(APIError):
    def __init__(self, message: str = "Email already registered", details: Any = None):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            error_code="EMAIL_ALREADY_EXISTS",
            message=message,
            details=details
        )


class InvalidPasswordError(APIError):
    def __init__(self, message: str = "Invalid password", details: Any = None):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            error_code="INVALID_PASSWORD",
            message=message,
            details=details
        )


class InvalidPlanError(APIError):
    def __init__(self, message: str = "Invalid plan", details: Any = None):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            error_code="INVALID_PLAN",
            message=message,
            details=details
        )


# ==================== Plan Limit Errors ====================

class PlanLimitExceededError(APIError):
    def __init__(self, message: str = "Plan limit exceeded", details: Any = None):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            error_code="PLAN_LIMIT_EXCEEDED",
            message=message,
            details=details
        )


# ==================== Server Errors ====================

class InternalError(APIError):
    def __init__(self, message: str = "Internal server error", details: Any = None):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            error_code="INTERNAL_ERROR",
            message=message,
            details=details
        )
        
        
class EmailNotVerifiedError(APIError):
    def __init__(self, message: str = "Email not verified. Please check your inbox.", details: Any = None):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            error_code="EMAIL_NOT_VERIFIED",
            message=message,
            details=details
        )