import time
import uuid
from typing import Optional, List, Dict, Any

import requests as http_requests

from usagesentinel.constants import (
    DEFAULT_BASE_URL,
    ENDPOINTS,
    DEFAULT_TIMEOUT,
    DEFAULT_RETRY_COUNT,
    DEFAULT_RETRY_DELAY,
    USER_AGENT,
)
from usagesentinel.exceptions import (
    UsageSentinelError,
    AuthenticationError,
    RateLimitError,
    ValidationError,
    NotFoundError,
    APIError,
    ConnectionError,
    TimeoutError,
)
from usagesentinel.models import (
    EvaluateResult,
    UsageLogResult,
    UsageRecord,
    UsageSummary,
    UsageByGroup,
    PaginatedResponse,
)


class UsageSentinel:
    """
    UsageSentinel SDK client.
    
    Usage:
        us =UsageSentinel(api_key="us_live_xxx")
        
        # Check if request is allowed
        result = us.evaluate(
            user_id="user_123",
            plan="free",
            feature="chat",
            model="gpt-4o-mini",
            input_tokens=100
        )
        
        if result.allowed:
            # Make your AI call here
            response = openai.chat.completions.create(...)
            
            # Log the usage
            us.log_usage(
                request_id=result.request_id,
                user_id="user_123",
                model="gpt-4o-mini",
                input_tokens=100,
                output_tokens=50,
                status="allowed"
            )
    """
    
    def __init__(
        self,
        api_key: str,
        base_url: str = DEFAULT_BASE_URL,
        timeout: int = DEFAULT_TIMEOUT,
        retry_count: int = DEFAULT_RETRY_COUNT,
        retry_delay: float = DEFAULT_RETRY_DELAY,
    ):
        if not api_key:
            raise AuthenticationError("API key is required")
        
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self.retry_count = retry_count
        self.retry_delay = retry_delay
        
        self._session = http_requests.Session()
        self._session.headers.update({
            "X-API-Key": self.api_key,
            "Content-Type": "application/json",
            "User-Agent": USER_AGENT,
        })
    
    def _request(
        self,
        method: str,
        endpoint: str,
        params: Dict = None,
        json: Dict = None,
    ) -> Dict:
        """Make HTTP request with retry logic."""
        url = f"{self.base_url}{endpoint}"
        
        last_exception = None
        
        for attempt in range(self.retry_count):
            try:
                response = self._session.request(
                    method=method,
                    url=url,
                    params=params,
                    json=json,
                    timeout=self.timeout,
                )
                
                return self._handle_response(response)
            
            except http_requests.exceptions.Timeout:
                last_exception = TimeoutError(f"Request timed out after {self.timeout}s")
            except http_requests.exceptions.ConnectionError:
                last_exception = ConnectionError("Failed to connect to UsageSentinel API")
            except RateLimitError as e:
                # Don't retry rate limits, raise immediately
                raise e
            except UsageSentinelError as e:
                # Don't retry client errors (4xx), raise immediately
                raise e
            except Exception as e:
                last_exception = APIError(f"Unexpected error: {str(e)}")
            
            # Wait before retry
            if attempt < self.retry_count - 1:
                time.sleep(self.retry_delay * (attempt + 1))
        
        raise last_exception
    
    def _handle_response(self, response: http_requests.Response) -> Dict:
        """Handle API response and raise appropriate exceptions."""
        
        # Success
        if response.status_code in (200, 201, 204):
            if response.status_code == 204:
                return {}
            return response.json()
        
        # Parse error response
        try:
            error_data = response.json()
            if isinstance(error_data.get("detail"), dict):
                error_code = error_data["detail"].get("error_code", "UNKNOWN")
                message = error_data["detail"].get("message", "Unknown error")
                details = error_data["detail"].get("details")
            else:
                error_code = "UNKNOWN"
                message = error_data.get("detail", "Unknown error")
                details = None
        except:
            error_code = "UNKNOWN"
            message = response.text or "Unknown error"
            details = None
        
        # Raise appropriate exception
        if response.status_code == 401:
            raise AuthenticationError(message, error_code=error_code, details=details)
        
        if response.status_code == 403:
            raise AuthenticationError(message, error_code=error_code, details=details)
        
        if response.status_code == 404:
            raise NotFoundError(message, error_code=error_code, details=details)
        
        if response.status_code == 422:
            raise ValidationError(message, error_code=error_code, details=details)
        
        if response.status_code == 429:
            retry_after = details.get("retry_after") if details else None
            raise RateLimitError(message, retry_after=retry_after, error_code=error_code, details=details)
        
        raise APIError(message, status_code=response.status_code, error_code=error_code, details=details)
    
    # ==================== Evaluate ====================
    
    def evaluate(
        self,
        user_id: str,
        model: str,
        plan: Optional[str] = None,
        feature: Optional[str] = None,
        input_tokens: Optional[int] = None,
        input_text: Optional[str] = None,
        estimated_output_tokens: Optional[int] = None,
    ) -> EvaluateResult:
        """
        Check if an AI request should be allowed.
        
        Args:
            user_id: Your app's user ID
            model: AI model name (e.g., "gpt-4o-mini", "claude-3-haiku")
            plan: User's plan (e.g., "free", "pro")
            feature: Feature being used (e.g., "chat", "summarize")
            input_tokens: Number of input tokens (if known)
            input_text: Input text (used to estimate tokens if input_tokens not provided)
            estimated_output_tokens: Expected output tokens (default: 500)
        
        Returns:
            EvaluateResult with allowed status and limit information
        
        Example:
            result = us.evaluate(
                user_id="user_123",
                plan="free",
                feature="chat",
                model="gpt-4o-mini",
                input_tokens=100
            )
            
            if result.allowed:
                # Make AI call
            else:
                print(f"Blocked: {result.message}")
        """
        payload = {
            "user_id": user_id,
            "model": model,
        }
        
        if plan:
            payload["plan"] = plan
        if feature:
            payload["feature"] = feature
        if input_tokens:
            payload["input_tokens"] = input_tokens
        if input_text:
            payload["input_text"] = input_text
        if estimated_output_tokens:
            payload["estimated_output_tokens"] = estimated_output_tokens
        
        data = self._request("POST", ENDPOINTS["evaluate"], json=payload)
        return EvaluateResult.from_dict(data)
    
    # ==================== Usage Logging ====================
    
    def log_usage(
        self,
        request_id: str,
        user_id: str,
        model: str,
        input_tokens: int,
        output_tokens: int,
        status: str = "allowed",
        plan: Optional[str] = None,
        feature: Optional[str] = None,
        estimated_cost_usd: Optional[float] = None,
        actual_cost_usd: Optional[float] = None,
        reason_code: Optional[str] = None,
        latency_ms: Optional[int] = None,
        extra_data: Optional[Dict] = None,
    ) -> UsageLogResult:
        """
        Log an AI call after completion.
        
        Args:
            request_id: Unique request ID (use same ID from evaluate)
            user_id: Your app's user ID
            model: AI model name
            input_tokens: Actual input tokens used
            output_tokens: Actual output tokens used
            status: "allowed" or "blocked"
            plan: User's plan
            feature: Feature used
            estimated_cost_usd: Estimated cost
            actual_cost_usd: Actual cost (if known)
            reason_code: Reason for blocking (if blocked)
            latency_ms: Request latency in milliseconds
            extra_data: Additional metadata
        
        Returns:
            UsageLogResult confirming the log
        
        Example:
            us.log_usage(
                request_id="req_123",
                user_id="user_123",
                model="gpt-4o-mini",
                input_tokens=100,
                output_tokens=50,
                status="allowed",
                latency_ms=350
            )
        """
        payload = {
            "request_id": request_id,
            "user_id": user_id,
            "model": model,
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "status": status,
        }
        
        if plan:
            payload["plan"] = plan
        if feature:
            payload["feature"] = feature
        if estimated_cost_usd is not None:
            payload["estimated_cost_usd"] = estimated_cost_usd
        if actual_cost_usd is not None:
            payload["actual_cost_usd"] = actual_cost_usd
        if reason_code:
            payload["reason_code"] = reason_code
        if latency_ms is not None:
            payload["latency_ms"] = latency_ms
        if extra_data:
            payload["extra_data"] = extra_data
        
        data = self._request("POST", ENDPOINTS["usage_log"], json=payload)
        return UsageLogResult.from_dict(data)
    
    # ==================== Helper: Check and Log ====================
    
    def check_and_call(
        self,
        user_id: str,
        model: str,
        ai_function: callable,
        plan: Optional[str] = None,
        feature: Optional[str] = None,
        input_tokens: Optional[int] = None,
        input_text: Optional[str] = None,
        estimated_output_tokens: Optional[int] = None,
    ) -> tuple:
        """
        Evaluate, call AI function if allowed, and log usage automatically.
        
        Args:
            user_id: Your app's user ID
            model: AI model name
            ai_function: Callable that makes the AI request (must return response with usage info)
            plan: User's plan
            feature: Feature being used
            input_tokens: Number of input tokens
            input_text: Input text
            estimated_output_tokens: Expected output tokens
        
        Returns:
            Tuple of (EvaluateResult, AI response or None)
        
        Example:
            def call_openai():
                return openai.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[{"role": "user", "content": "Hello"}]
                )
            
            result, response = us.check_and_call(
                user_id="user_123",
                model="gpt-4o-mini",
                ai_function=call_openai,
                plan="free",
                feature="chat"
            )
            
            if result.allowed:
                print(response.choices[0].message.content)
        """
        request_id = str(uuid.uuid4())
        start_time = time.time()
        
        # Evaluate
        eval_result = self.evaluate(
            user_id=user_id,
            model=model,
            plan=plan,
            feature=feature,
            input_tokens=input_tokens,
            input_text=input_text,
            estimated_output_tokens=estimated_output_tokens,
        )
        
        if not eval_result.allowed:
            # Log blocked request
            self.log_usage(
                request_id=request_id,
                user_id=user_id,
                model=model,
                input_tokens=input_tokens or 0,
                output_tokens=0,
                status="blocked",
                plan=plan,
                feature=feature,
                reason_code=eval_result.reason_code,
            )
            return eval_result, None
        
        # Call AI function
        try:
            response = ai_function()
            latency_ms = int((time.time() - start_time) * 1000)
            
            # Try to extract usage from response (OpenAI format)
            actual_input = input_tokens or 0
            actual_output = 0
            
            if hasattr(response, "usage"):
                actual_input = getattr(response.usage, "prompt_tokens", actual_input)
                actual_output = getattr(response.usage, "completion_tokens", 0)
            
            # Log successful request
            self.log_usage(
                request_id=request_id,
                user_id=user_id,
                model=model,
                input_tokens=actual_input,
                output_tokens=actual_output,
                status="allowed",
                plan=plan,
                feature=feature,
                latency_ms=latency_ms,
            )
            
            return eval_result, response
        
        except Exception as e:
            # Log failed request
            latency_ms = int((time.time() - start_time) * 1000)
            self.log_usage(
                request_id=request_id,
                user_id=user_id,
                model=model,
                input_tokens=input_tokens or 0,
                output_tokens=0,
                status="allowed",
                plan=plan,
                feature=feature,
                latency_ms=latency_ms,
                extra_data={"error": str(e)},
            )
            raise
    
    # ==================== Usage Analytics ====================
    
    def get_usage_summary(
        self,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
    ) -> UsageSummary:
        """
        Get usage summary statistics.
        
        Args:
            start_date: Filter from date (ISO format)
            end_date: Filter to date (ISO format)
        
        Returns:
            UsageSummary with totals
        """
        params = {}
        if start_date:
            params["start_date"] = start_date
        if end_date:
            params["end_date"] = end_date
        
        data = self._request("GET", ENDPOINTS["usage_summary"], params=params)
        return UsageSummary.from_dict(data)
    
    def get_recent_usage(
        self,
        page: int = 1,
        page_size: int = 20,
        user_id: Optional[str] = None,
        feature: Optional[str] = None,
        model: Optional[str] = None,
        status: Optional[str] = None,
    ) -> PaginatedResponse:
        """
        Get recent usage records.
        
        Args:
            page: Page number (starts from 1)
            page_size: Items per page (max 100)
            user_id: Filter by user ID
            feature: Filter by feature
            model: Filter by model
            status: Filter by status ("allowed" or "blocked")
        
        Returns:
            PaginatedResponse with UsageRecord items
        """
        params = {"page": page, "page_size": page_size}
        
        if user_id:
            params["user_id"] = user_id
        if feature:
            params["feature"] = feature
        if model:
            params["model"] = model
        if status:
            params["status"] = status
        
        data = self._request("GET", ENDPOINTS["usage_recent"], params=params)
        
        return PaginatedResponse(
            items=[UsageRecord.from_dict(item) for item in data["items"]],
            total=data["total"],
            page=data["page"],
            page_size=data["page_size"],
            total_pages=data["total_pages"],
            has_next=data["has_next"],
            has_prev=data["has_prev"],
        )
    
    def get_blocked_requests(
        self,
        page: int = 1,
        page_size: int = 20,
    ) -> PaginatedResponse:
        """
        Get blocked requests.
        
        Returns:
            PaginatedResponse with UsageRecord items
        """
        params = {"page": page, "page_size": page_size}
        data = self._request("GET", ENDPOINTS["usage_blocked"], params=params)
        
        return PaginatedResponse(
            items=[UsageRecord.from_dict(item) for item in data["items"]],
            total=data["total"],
            page=data["page"],
            page_size=data["page_size"],
            total_pages=data["total_pages"],
            has_next=data["has_next"],
            has_prev=data["has_prev"],
        )
    
    def get_usage_by_user(
        self,
        page: int = 1,
        page_size: int = 20,
    ) -> PaginatedResponse:
        """
        Get usage grouped by user.
        
        Returns:
            PaginatedResponse with UsageByGroup items
        """
        params = {"page": page, "page_size": page_size}
        data = self._request("GET", ENDPOINTS["usage_by_user"], params=params)
        
        return PaginatedResponse(
            items=[UsageByGroup.from_dict(item) for item in data["items"]],
            total=data["total"],
            page=data["page"],
            page_size=data["page_size"],
            total_pages=data["total_pages"],
            has_next=data["has_next"],
            has_prev=data["has_prev"],
        )
    
    def get_usage_by_feature(
        self,
        page: int = 1,
        page_size: int = 20,
    ) -> PaginatedResponse:
        """
        Get usage grouped by feature.
        
        Returns:
            PaginatedResponse with UsageByGroup items
        """
        params = {"page": page, "page_size": page_size}
        data = self._request("GET", ENDPOINTS["usage_by_feature"], params=params)
        
        return PaginatedResponse(
            items=[UsageByGroup.from_dict(item) for item in data["items"]],
            total=data["total"],
            page=data["page"],
            page_size=data["page_size"],
            total_pages=data["total_pages"],
            has_next=data["has_next"],
            has_prev=data["has_prev"],
        )