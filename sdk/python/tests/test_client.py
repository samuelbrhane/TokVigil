import pytest
import responses
from tokvigil import TokVigil, EvaluateResult, AuthenticationError, RateLimitError


class TestTokVigil:
    
    def test_init_requires_api_key(self):
        with pytest.raises(AuthenticationError):
            TokVigil(api_key="")
    
    def test_init_with_api_key(self):
        tv = TokVigil(api_key="tv_test_xxx")
        assert tv.api_key == "tv_test_xxx"
    
    def test_init_custom_base_url(self):
        tv = TokVigil(api_key="tv_test_xxx", base_url="http://localhost:8000")
        assert tv.base_url == "http://localhost:8000"
    
    @responses.activate
    def test_evaluate_allowed(self):
        responses.add(
            responses.POST,
            "https://api.tokvigil.com/api/v1/evaluate",
            json={
                "allowed": True,
                "reason_code": "ALLOWED",
                "message": "Request allowed",
                "limit_state": {
                    "requests_today": 10,
                    "requests_limit_daily": 50,
                },
                "estimated_cost_usd": 0.001,
                "policy_id": 1,
            },
            status=200,
        )
        
        tv = TokVigil(api_key="tv_test_xxx")
        result = tv.evaluate(user_id="user_123", model="gpt-4o-mini")
        
        assert result.allowed is True
        assert result.reason_code == "ALLOWED"
        assert result.limit_state.requests_today == 10
    
    @responses.activate
    def test_evaluate_blocked(self):
        responses.add(
            responses.POST,
            "https://api.tokvigil.com/api/v1/evaluate",
            json={
                "allowed": False,
                "reason_code": "DAILY_REQUEST_LIMIT_EXCEEDED",
                "message": "Daily request limit (50) exceeded",
                "limit_state": {
                    "requests_today": 50,
                    "requests_limit_daily": 50,
                },
                "estimated_cost_usd": 0.001,
                "policy_id": 1,
            },
            status=200,
        )
        
        tv = TokVigil(api_key="tv_test_xxx")
        result = tv.evaluate(user_id="user_123", model="gpt-4o-mini")
        
        assert result.allowed is False
        assert result.reason_code == "DAILY_REQUEST_LIMIT_EXCEEDED"
    
    @responses.activate
    def test_evaluate_invalid_api_key(self):
        responses.add(
            responses.POST,
            "https://api.tokvigil.com/api/v1/evaluate",
            json={
                "detail": {
                    "error_code": "INVALID_API_KEY",
                    "message": "Invalid API key",
                }
            },
            status=401,
        )
        
        tv = TokVigil(api_key="tv_test_invalid")
        
        with pytest.raises(AuthenticationError) as exc:
            tv.evaluate(user_id="user_123", model="gpt-4o-mini")
        
        assert exc.value.error_code == "INVALID_API_KEY"
    
    @responses.activate
    def test_rate_limit_error(self):
        responses.add(
            responses.POST,
            "https://api.tokvigil.com/api/v1/evaluate",
            json={
                "detail": {
                    "error_code": "RATE_LIMIT_EXCEEDED",
                    "message": "Too many requests",
                    "details": {"retry_after": 30},
                }
            },
            status=429,
        )
        
        tv = TokVigil(api_key="tv_test_xxx")
        
        with pytest.raises(RateLimitError) as exc:
            tv.evaluate(user_id="user_123", model="gpt-4o-mini")
        
        assert exc.value.retry_after == 30
    
    @responses.activate
    def test_log_usage(self):
        responses.add(
            responses.POST,
            "https://api.tokvigil.com/api/v1/usage",
            json={
                "id": 1,
                "request_id": "req_123",
                "recorded": True,
                "message": "Usage logged successfully",
            },
            status=201,
        )
        
        tv = TokVigil(api_key="tv_test_xxx")
        result = tv.log_usage(
            request_id="req_123",
            user_id="user_123",
            model="gpt-4o-mini",
            input_tokens=100,
            output_tokens=50,
            status="allowed",
        )
        
        assert result.recorded is True
        assert result.request_id == "req_123"