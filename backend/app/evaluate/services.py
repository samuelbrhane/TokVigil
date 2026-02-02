from typing import Optional

from sqlalchemy.orm import Session

from app.core.constants import get_model_pricing
from app.policies.services import find_matching_policy
from app.usage.services import get_user_usage_today, get_user_usage_month
from app.evaluate.schemas import EvaluateRequest, EvaluateResponse, LimitState


def estimate_cost(model: str, input_tokens: int, output_tokens: int) -> float:
    pricing = get_model_pricing(model)
    input_cost = (input_tokens / 1000) * pricing["input"]
    output_cost = (output_tokens / 1000) * pricing["output"]
    return round(input_cost + output_cost, 6)


def estimate_tokens_from_text(text: str) -> int:
    if not text:
        return 0
    return len(text) // 4


def evaluate_request(
    db: Session,
    workspace_id: int,
    data: EvaluateRequest
) -> EvaluateResponse:
    
    policy = find_matching_policy(
        db,
        workspace_id=workspace_id,
        plan=data.plan,
        feature=data.feature,
        user_id=data.user_id
    )
    
    if not policy:
        return EvaluateResponse(
            allowed=True,
            reason_code="NO_POLICY",
            message="No policy found, request allowed",
            limit_state=LimitState(),
            estimated_cost_usd=None,
            policy_id=None
        )
    
    input_tokens = data.input_tokens
    if not input_tokens and data.input_text:
        input_tokens = estimate_tokens_from_text(data.input_text)
    input_tokens = input_tokens or 0
    
    output_tokens = data.estimated_output_tokens or 500
    estimated_cost = estimate_cost(data.model, input_tokens, output_tokens)
    
    usage_today = get_user_usage_today(db, workspace_id, data.user_id)
    usage_month = get_user_usage_month(db, workspace_id, data.user_id)
    
    limit_state = LimitState(
        requests_today=usage_today["requests_today"],
        requests_limit_daily=policy.requests_per_day,
        requests_this_month=usage_month["requests_month"],
        requests_limit_monthly=policy.requests_per_month,
        tokens_today=usage_today["tokens_today"],
        tokens_limit_daily=policy.tokens_per_day,
        tokens_this_month=usage_month["tokens_month"],
        tokens_limit_monthly=policy.tokens_per_month,
        cost_today_usd=usage_today["cost_today_usd"],
        cost_limit_daily_usd=policy.budget_per_day_usd,
        cost_this_month_usd=usage_month["cost_month_usd"],
        cost_limit_monthly_usd=policy.budget_per_month_usd,
    )
    
    # Check model allowed
    if policy.allowed_models and data.model not in policy.allowed_models:
        return _blocked_response("MODEL_NOT_ALLOWED", f"Model '{data.model}' is not allowed", limit_state, estimated_cost, policy.id)
    
    # Check per-request cost cap
    if policy.max_cost_per_request_usd and estimated_cost > policy.max_cost_per_request_usd:
        return _blocked_response("REQUEST_COST_EXCEEDED", f"Estimated cost ${estimated_cost:.4f} exceeds limit ${policy.max_cost_per_request_usd:.4f}", limit_state, estimated_cost, policy.id)
    
    # Check daily request limit
    if policy.requests_per_day and usage_today["requests_today"] >= policy.requests_per_day:
        return _blocked_response("DAILY_REQUEST_LIMIT_EXCEEDED", f"Daily request limit ({policy.requests_per_day}) exceeded", limit_state, estimated_cost, policy.id)
    
    # Check monthly request limit
    if policy.requests_per_month and usage_month["requests_month"] >= policy.requests_per_month:
        return _blocked_response("MONTHLY_REQUEST_LIMIT_EXCEEDED", f"Monthly request limit ({policy.requests_per_month}) exceeded", limit_state, estimated_cost, policy.id)
    
    # Check daily token limit
    if policy.tokens_per_day and usage_today["tokens_today"] >= policy.tokens_per_day:
        return _blocked_response("DAILY_TOKEN_LIMIT_EXCEEDED", f"Daily token limit ({policy.tokens_per_day}) exceeded", limit_state, estimated_cost, policy.id)
    
    # Check monthly token limit
    if policy.tokens_per_month and usage_month["tokens_month"] >= policy.tokens_per_month:
        return _blocked_response("MONTHLY_TOKEN_LIMIT_EXCEEDED", f"Monthly token limit ({policy.tokens_per_month}) exceeded", limit_state, estimated_cost, policy.id)
    
    # Check daily budget
    if policy.budget_per_day_usd and usage_today["cost_today_usd"] >= policy.budget_per_day_usd:
        return _blocked_response("DAILY_BUDGET_EXCEEDED", f"Daily budget (${policy.budget_per_day_usd:.2f}) exceeded", limit_state, estimated_cost, policy.id)
    
    # Check monthly budget
    if policy.budget_per_month_usd and usage_month["cost_month_usd"] >= policy.budget_per_month_usd:
        return _blocked_response("MONTHLY_BUDGET_EXCEEDED", f"Monthly budget (${policy.budget_per_month_usd:.2f}) exceeded", limit_state, estimated_cost, policy.id)
    
    return EvaluateResponse(
        allowed=True,
        reason_code="ALLOWED",
        message="Request allowed",
        limit_state=limit_state,
        estimated_cost_usd=estimated_cost,
        policy_id=policy.id
    )


def _blocked_response(reason_code: str, message: str, limit_state: LimitState, estimated_cost: float, policy_id: int) -> EvaluateResponse:
    return EvaluateResponse(
        allowed=False,
        reason_code=reason_code,
        message=message,
        limit_state=limit_state,
        estimated_cost_usd=estimated_cost,
        policy_id=policy_id
    )