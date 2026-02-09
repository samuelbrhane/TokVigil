from datetime import datetime
from typing import Optional, List

from sqlalchemy.orm import Session

from app.policies.models import Policy
from app.policies.schemas import PolicyCreate, PolicyUpdate
from app.db.redis import cache_get, cache_set, cache_delete_pattern
from app.audit.services import create_audit_log


def create_policy(db: Session, workspace_id: int, data: PolicyCreate, user_id: int = None, user_email: str = None) -> Policy:
    policy = Policy(
        workspace_id=workspace_id,
        name=data.name,
        plan=data.plan,
        feature=data.feature,
        user_id=data.user_id,
        requests_per_day=data.requests_per_day,
        requests_per_month=data.requests_per_month,
        tokens_per_day=data.tokens_per_day,
        tokens_per_month=data.tokens_per_month,
        budget_per_day_usd=data.budget_per_day_usd,
        budget_per_month_usd=data.budget_per_month_usd,
        max_cost_per_request_usd=data.max_cost_per_request_usd,
        allowed_models=data.allowed_models,
        priority=data.priority,
    )
    db.add(policy)
    db.commit()
    db.refresh(policy)
    invalidate_policy_cache(workspace_id)
    
    # Add audit log
    create_audit_log(
        db=db,
        action="CREATED",
        resource_type="POLICY",
        user_id=user_id,
        user_email=user_email,
        workspace_id=workspace_id,
        resource_id=policy.id,
        resource_name=policy.name,
        new_values=data.model_dump()
    )
    return policy


def get_policy(db: Session, policy_id: int, workspace_id: int) -> Optional[Policy]:
    return db.query(Policy).filter(
        Policy.id == policy_id,
        Policy.workspace_id == workspace_id,
        Policy.is_deleted == False
    ).first()


def get_policies(db: Session, workspace_id: int) -> List[Policy]:
    return db.query(Policy).filter(
        Policy.workspace_id == workspace_id,
        Policy.is_deleted == False
    ).order_by(Policy.priority.desc()).all()


def update_policy(db: Session, policy_id: int, workspace_id: int, data: PolicyUpdate) -> Optional[Policy]:
    policy = get_policy(db, policy_id, workspace_id)
    if not policy:
        return None
    
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(policy, field, value)
    
    db.commit()
    db.refresh(policy)
    invalidate_policy_cache(workspace_id)
    return policy


def delete_policy(db: Session, policy_id: int, workspace_id: int) -> bool:
    policy = get_policy(db, policy_id, workspace_id)
    if not policy:
        return False
    
    policy.is_deleted = True
    policy.deleted_at = datetime.utcnow()
    db.commit()
    invalidate_policy_cache(workspace_id)
    return True


def find_matching_policy(
    db: Session,
    workspace_id: int,
    plan: Optional[str] = None,
    feature: Optional[str] = None,
    user_id: Optional[str] = None
) -> Optional[Policy]:
    
    # Try cache first
    cache_key = f"policy:{workspace_id}:{plan}:{feature}:{user_id}"
    cached = cache_get(cache_key)
    if cached is not None:
        if cached == "none":
            return None
        return db.query(Policy).filter(Policy.id == cached["id"]).first()
    
    # Query database
    policies = db.query(Policy).filter(
        Policy.workspace_id == workspace_id,
        Policy.is_active == True,
        Policy.is_deleted == False
    ).all()
    
    best_match = None
    best_score = -1
    
    for policy in policies:
        if policy.user_id and policy.user_id != user_id:
            continue
        if policy.plan and policy.plan != plan:
            continue
        if policy.feature and policy.feature != feature:
            continue
        
        score = policy.priority
        if policy.user_id == user_id and user_id:
            score += 1000
        if policy.feature == feature and feature:
            score += 100
        if policy.plan == plan and plan:
            score += 10
        
        if score > best_score:
            best_score = score
            best_match = policy
    
    # Cache result
    if best_match:
        cache_set(cache_key, {"id": best_match.id}, ttl=60)
    else:
        cache_set(cache_key, "none", ttl=60)
    
    return best_match


def invalidate_policy_cache(workspace_id: int):
    """Clear all cached policies for a workspace."""
    cache_delete_pattern(f"policy:{workspace_id}:*")