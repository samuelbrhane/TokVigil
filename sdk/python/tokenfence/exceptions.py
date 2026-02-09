class TokenFenceError(Exception):
    """Base exception for TokenFence SDK."""
    def __init__(self, message: str, error_code: str = None, details: dict = None):
        self.message = message
        self.error_code = error_code
        self.details = details or {}
        super().__init__(self.message)


class AuthenticationError(TokenFenceError):
    """Invalid or missing API key."""
    pass


class RateLimitError(TokenFenceError):
    """Rate limit exceeded."""
    def __init__(self, message: str, retry_after: int = None, **kwargs):
        super().__init__(message, **kwargs)
        self.retry_after = retry_after


class ValidationError(TokenFenceError):
    """Invalid request parameters."""
    pass


class NotFoundError(TokenFenceError):
    """Resource not found."""
    pass


class APIError(TokenFenceError):
    """General API error."""
    def __init__(self, message: str, status_code: int = None, **kwargs):
        super().__init__(message, **kwargs)
        self.status_code = status_code


class ConnectionError(TokenFenceError):
    """Failed to connect to API."""
    pass


class TimeoutError(TokenFenceError):
    """Request timed out."""
    pass