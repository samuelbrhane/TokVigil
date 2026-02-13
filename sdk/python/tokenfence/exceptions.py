class TokVigilError(Exception):
    """Base exception for TokVigil SDK."""
    def __init__(self, message: str, error_code: str = None, details: dict = None):
        self.message = message
        self.error_code = error_code
        self.details = details or {}
        super().__init__(self.message)


class AuthenticationError(TokVigilError):
    """Invalid or missing API key."""
    pass


class RateLimitError(TokVigilError):
    """Rate limit exceeded."""
    def __init__(self, message: str, retry_after: int = None, **kwargs):
        super().__init__(message, **kwargs)
        self.retry_after = retry_after


class ValidationError(TokVigilError):
    """Invalid request parameters."""
    pass


class NotFoundError(TokVigilError):
    """Resource not found."""
    pass


class APIError(TokVigilError):
    """General API error."""
    def __init__(self, message: str, status_code: int = None, **kwargs):
        super().__init__(message, **kwargs)
        self.status_code = status_code


class ConnectionError(TokVigilError):
    """Failed to connect to API."""
    pass


class TimeoutError(TokVigilError):
    """Request timed out."""
    pass