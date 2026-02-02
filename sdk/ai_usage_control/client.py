"""Client for the AI Usage Control Platform."""

import requests
from typing import Dict, Any, Optional, Callable
from functools import wraps

from .exceptions import (
    PolicyViolationException,
    AuthenticationException,
    APIException,
)


class AIUsageControlClient:
    """Client for interacting with the AI Usage Control Platform."""
    
    def __init__(self, api_key: str, base_url: str = "http://localhost:8000"):
        """
        Initialize the AI Usage Control client.
        
        Args:
            api_key: API key for authentication
            base_url: Base URL of the AI Usage Control Platform API
        """
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.session = requests.Session()
        self.session.headers.update({"X-API-Key": api_key})
    
    def _make_request(
        self,
        method: str,
        endpoint: str,
        json: Optional[Dict[str, Any]] = None,
        params: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Make an HTTP request to the API."""
        url = f"{self.base_url}/api/v1{endpoint}"
        
        try:
            response = self.session.request(
                method=method,
                url=url,
                json=json,
                params=params,
                timeout=30,
            )
            
            if response.status_code == 401:
                raise AuthenticationException("Invalid or missing API key")
            
            if response.status_code >= 400:
                error_detail = response.json().get("detail", "Unknown error")
                raise APIException(
                    f"API request failed: {error_detail}",
                    status_code=response.status_code,
                )
            
            return response.json()
        
        except requests.RequestException as e:
            raise APIException(f"Request failed: {str(e)}")
    
    def evaluate_policy(
        self,
        model: str,
        operation: str = "chat.completion",
        estimated_tokens: Optional[int] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Evaluate if a request should be allowed based on policies.
        
        Args:
            model: Model name (e.g., "gpt-4", "claude-3")
            operation: Operation type (e.g., "chat.completion", "embedding")
            estimated_tokens: Estimated number of tokens for the request
            metadata: Additional metadata for the request
        
        Returns:
            Policy evaluation result
        
        Raises:
            PolicyViolationException: If the request is not allowed
        """
        payload = {
            "workspace_id": "",  # Will be filled by the server based on API key
            "model": model,
            "operation": operation,
            "estimated_tokens": estimated_tokens,
            "metadata": metadata,
        }
        
        result = self._make_request("POST", "/evaluate", json=payload)
        
        if not result.get("allowed", False):
            raise PolicyViolationException(
                message=result.get("message", "Policy violation"),
                reason_code=result.get("reason_code"),
                policy_id=result.get("policy_id"),
            )
        
        return result
    
    def log_usage(
        self,
        model: str,
        operation: str,
        prompt_tokens: int = 0,
        completion_tokens: int = 0,
        total_tokens: int = 0,
        estimated_cost: float = 0.0,
        was_allowed: bool = True,
        reason_code: Optional[str] = None,
        policy_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Log usage information.
        
        Args:
            model: Model name
            operation: Operation type
            prompt_tokens: Number of prompt tokens
            completion_tokens: Number of completion tokens
            total_tokens: Total number of tokens
            estimated_cost: Estimated cost in USD
            was_allowed: Whether the request was allowed
            reason_code: Reason code if request was blocked
            policy_id: ID of the policy that was applied
            metadata: Additional metadata
        
        Returns:
            Created usage log entry
        """
        payload = {
            "workspace_id": "",  # Will be filled by the server based on API key
            "model": model,
            "operation": operation,
            "prompt_tokens": prompt_tokens,
            "completion_tokens": completion_tokens,
            "total_tokens": total_tokens,
            "estimated_cost": estimated_cost,
            "was_allowed": was_allowed,
            "reason_code": reason_code,
            "policy_id": policy_id,
            "request_metadata": metadata,
        }
        
        return self._make_request("POST", "/usage-logs", json=payload)
    
    def get_usage_logs(
        self,
        skip: int = 0,
        limit: int = 100,
    ) -> list:
        """
        Get usage logs for the authenticated workspace.
        
        Args:
            skip: Number of records to skip (pagination)
            limit: Maximum number of records to return
        
        Returns:
            List of usage log entries
        """
        params = {"skip": skip, "limit": limit}
        return self._make_request("GET", "/usage-logs", params=params)
    
    def wrap_llm_call(
        self,
        model: str,
        operation: str = "chat.completion",
        estimate_tokens: Optional[Callable[[Any], int]] = None,
    ):
        """
        Decorator to wrap LLM calls with policy evaluation and usage logging.
        
        Args:
            model: Model name
            operation: Operation type
            estimate_tokens: Optional function to estimate tokens from function args
        
        Returns:
            Decorator function
        
        Example:
            @client.wrap_llm_call(model="gpt-4", operation="chat.completion")
            def call_openai(prompt):
                response = openai.ChatCompletion.create(
                    model="gpt-4",
                    messages=[{"role": "user", "content": prompt}]
                )
                return response
        """
        def decorator(func):
            @wraps(func)
            def wrapper(*args, **kwargs):
                # Estimate tokens if estimator function provided
                estimated_tokens = None
                if estimate_tokens:
                    try:
                        estimated_tokens = estimate_tokens(*args, **kwargs)
                    except Exception:
                        pass  # If estimation fails, continue without it
                
                # Evaluate policy before making the call
                try:
                    self.evaluate_policy(
                        model=model,
                        operation=operation,
                        estimated_tokens=estimated_tokens,
                    )
                except PolicyViolationException as e:
                    # Log the blocked request
                    self.log_usage(
                        model=model,
                        operation=operation,
                        was_allowed=False,
                        reason_code=e.reason_code,
                        policy_id=e.policy_id,
                    )
                    raise
                
                # Make the actual LLM call
                try:
                    result = func(*args, **kwargs)
                    
                    # Extract token usage if available (OpenAI format)
                    prompt_tokens = 0
                    completion_tokens = 0
                    total_tokens = 0
                    
                    if hasattr(result, "usage"):
                        usage = result.usage
                        prompt_tokens = getattr(usage, "prompt_tokens", 0)
                        completion_tokens = getattr(usage, "completion_tokens", 0)
                        total_tokens = getattr(usage, "total_tokens", 0)
                    elif isinstance(result, dict) and "usage" in result:
                        usage = result["usage"]
                        prompt_tokens = usage.get("prompt_tokens", 0)
                        completion_tokens = usage.get("completion_tokens", 0)
                        total_tokens = usage.get("total_tokens", 0)
                    
                    # Calculate estimated cost (rough estimate)
                    # These are example rates - adjust based on actual pricing
                    cost_per_1k_tokens = {
                        "gpt-4": 0.03,
                        "gpt-3.5-turbo": 0.002,
                        "claude-3": 0.015,
                    }
                    rate = cost_per_1k_tokens.get(model, 0.01)
                    estimated_cost = (total_tokens / 1000.0) * rate
                    
                    # Log successful usage
                    self.log_usage(
                        model=model,
                        operation=operation,
                        prompt_tokens=prompt_tokens,
                        completion_tokens=completion_tokens,
                        total_tokens=total_tokens,
                        estimated_cost=estimated_cost,
                        was_allowed=True,
                    )
                    
                    return result
                
                except Exception as e:
                    # Log failed usage
                    self.log_usage(
                        model=model,
                        operation=operation,
                        was_allowed=True,
                        metadata={"error": str(e)},
                    )
                    raise
            
            return wrapper
        return decorator
