"""Custom exceptions for the AI Usage Control SDK."""


class AIUsageControlException(Exception):
    """Base exception for all AI Usage Control SDK errors."""
    pass


class PolicyViolationException(AIUsageControlException):
    """Raised when a policy evaluation fails."""
    
    def __init__(self, message: str, reason_code: str = None, policy_id: str = None):
        super().__init__(message)
        self.reason_code = reason_code
        self.policy_id = policy_id


class AuthenticationException(AIUsageControlException):
    """Raised when authentication fails."""
    pass


class APIException(AIUsageControlException):
    """Raised when an API request fails."""
    
    def __init__(self, message: str, status_code: int = None):
        super().__init__(message)
        self.status_code = status_code
