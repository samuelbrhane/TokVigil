from datetime import datetime, timedelta
from typing import Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func

from app.models.models import Policy, UsageLog, Workspace
from app.schemas.schemas import PolicyEvaluationRequest


class PolicyEngine:
    """Engine for evaluating usage policies."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def evaluate(
        self,
        request: PolicyEvaluationRequest,
    ) -> Tuple[bool, Optional[str], Optional[str], Optional[str]]:
        """
        Evaluate if a request should be allowed based on policies.
        
        Returns:
            Tuple of (allowed, reason_code, message, policy_id)
        """
        # Get active policies for workspace, ordered by priority (descending)
        result = await self.db.execute(
            select(Policy)
            .where(
                and_(
                    Policy.workspace_id == request.workspace_id,
                    Policy.is_active == True
                )
            )
            .order_by(Policy.priority.desc())
        )
        policies = result.scalars().all()
        
        if not policies:
            # No policies defined, allow by default
            return True, None, "No policies defined, request allowed", None
        
        # Evaluate each policy
        for policy in policies:
            allowed, reason_code, message = await self._evaluate_policy(policy, request)
            if not allowed:
                return False, reason_code, message, policy.id
        
        # All policies passed
        return True, None, "All policies passed", None
    
    async def _evaluate_policy(
        self,
        policy: Policy,
        request: PolicyEvaluationRequest,
    ) -> Tuple[bool, Optional[str], Optional[str]]:
        """
        Evaluate a single policy.
        
        Returns:
            Tuple of (allowed, reason_code, message)
        """
        # Check allowed models
        if policy.allowed_models is not None and len(policy.allowed_models) > 0:
            if request.model not in policy.allowed_models:
                return (
                    False,
                    "model_not_allowed",
                    f"Model '{request.model}' is not in the allowed list"
                )
        
        # Check blocked models
        if policy.blocked_models is not None and len(policy.blocked_models) > 0:
            if request.model in policy.blocked_models:
                return (
                    False,
                    "model_blocked",
                    f"Model '{request.model}' is blocked by policy"
                )
        
        # Check max tokens per request
        if policy.max_tokens_per_request is not None and request.estimated_tokens is not None:
            if request.estimated_tokens > policy.max_tokens_per_request:
                return (
                    False,
                    "token_limit_exceeded",
                    f"Estimated tokens ({request.estimated_tokens}) exceeds limit ({policy.max_tokens_per_request})"
                )
        
        # Check rate limits (requests per hour)
        if policy.max_requests_per_hour is not None:
            one_hour_ago = datetime.utcnow() - timedelta(hours=1)
            result = await self.db.execute(
                select(func.count(UsageLog.id))
                .where(
                    and_(
                        UsageLog.workspace_id == request.workspace_id,
                        UsageLog.created_at >= one_hour_ago,
                        UsageLog.was_allowed == True
                    )
                )
            )
            request_count = result.scalar()
            
            if request_count >= policy.max_requests_per_hour:
                return (
                    False,
                    "rate_limit_exceeded",
                    f"Request rate limit exceeded ({request_count}/{policy.max_requests_per_hour} per hour)"
                )
        
        # Check cost limits (cost per hour)
        if policy.max_cost_per_hour is not None:
            one_hour_ago = datetime.utcnow() - timedelta(hours=1)
            result = await self.db.execute(
                select(func.sum(UsageLog.estimated_cost))
                .where(
                    and_(
                        UsageLog.workspace_id == request.workspace_id,
                        UsageLog.created_at >= one_hour_ago,
                        UsageLog.was_allowed == True
                    )
                )
            )
            total_cost = result.scalar() or 0.0
            
            if total_cost >= policy.max_cost_per_hour:
                return (
                    False,
                    "cost_limit_exceeded",
                    f"Cost limit exceeded (${total_cost:.4f}/${policy.max_cost_per_hour:.4f} per hour)"
                )
        
        return True, None, None
