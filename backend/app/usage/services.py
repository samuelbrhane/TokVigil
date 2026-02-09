from datetime import datetime
from typing import Optional, List, Dict, Any

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.usage.models import UsageRecord
from app.usage.schemas import UsageLogRequest, UsageSummary, UsageByGroup


def log_usage(
    db: Session,
    workspace_id: int,
    environment_id: int,
    data: UsageLogRequest
) -> Optional[UsageRecord]:
    existing = db.query(UsageRecord).filter(
        UsageRecord.request_id == data.request_id
    ).first()
    if existing:
        return existing
    
    record = UsageRecord(
        workspace_id=workspace_id,
        environment_id=environment_id,
        request_id=data.request_id,
        user_id=data.user_id,
        plan=data.plan,
        feature=data.feature,
        model=data.model,
        input_tokens=data.input_tokens,
        output_tokens=data.output_tokens,
        total_tokens=data.input_tokens + data.output_tokens,
        estimated_cost_usd=data.estimated_cost_usd,
        actual_cost_usd=data.actual_cost_usd,
        status=data.status,
        reason_code=data.reason_code,
        latency_ms=data.latency_ms,
        extra_data=data.extra_data,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def get_recent_usage(
    db: Session,
    workspace_id: int,
    environment_id: int,
    limit: int = 50,
    offset: int = 0,
    user_id: Optional[str] = None,
    feature: Optional[str] = None
) -> List[UsageRecord]:
    query = db.query(UsageRecord).filter(
        UsageRecord.workspace_id == workspace_id,
        UsageRecord.environment_id == environment_id
    )
    
    if user_id:
        query = query.filter(UsageRecord.user_id == user_id)
    if feature:
        query = query.filter(UsageRecord.feature == feature)
    
    return query.order_by(UsageRecord.created_at.desc()).offset(offset).limit(limit).all()


def get_blocked_requests(
    db: Session,
    workspace_id: int,
    environment_id: int,
    limit: int = 50,
    offset: int = 0
) -> List[UsageRecord]:
    return db.query(UsageRecord).filter(
        UsageRecord.workspace_id == workspace_id,
        UsageRecord.environment_id == environment_id,
        UsageRecord.status == "blocked"
    ).order_by(UsageRecord.created_at.desc()).offset(offset).limit(limit).all()


def get_usage_summary(
    db: Session,
    workspace_id: int,
    environment_id: int,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
) -> UsageSummary:
    query = db.query(UsageRecord).filter(
        UsageRecord.workspace_id == workspace_id,
        UsageRecord.environment_id == environment_id
    )
    
    if start_date:
        query = query.filter(UsageRecord.created_at >= start_date)
    if end_date:
        query = query.filter(UsageRecord.created_at <= end_date)
    
    records = query.all()
    
    return UsageSummary(
        total_requests=len(records),
        total_tokens=sum(r.total_tokens for r in records),
        total_cost_usd=sum(r.estimated_cost_usd for r in records),
        allowed_count=len([r for r in records if r.status == "allowed"]),
        blocked_count=len([r for r in records if r.status == "blocked"]),
    )


def get_usage_by_user(db: Session, workspace_id: int, environment_id: int) -> List[UsageByGroup]:
    results = db.query(
        UsageRecord.user_id,
        func.count(UsageRecord.id).label("requests"),
        func.sum(UsageRecord.total_tokens).label("tokens"),
        func.sum(UsageRecord.estimated_cost_usd).label("cost_usd")
    ).filter(
        UsageRecord.workspace_id == workspace_id,
        UsageRecord.environment_id == environment_id
    ).group_by(UsageRecord.user_id).all()
    
    return [
        UsageByGroup(group=r.user_id, requests=r.requests, tokens=r.tokens or 0, cost_usd=r.cost_usd or 0)
        for r in results
    ]


def get_usage_by_feature(db: Session, workspace_id: int, environment_id: int) -> List[UsageByGroup]:
    results = db.query(
        UsageRecord.feature,
        func.count(UsageRecord.id).label("requests"),
        func.sum(UsageRecord.total_tokens).label("tokens"),
        func.sum(UsageRecord.estimated_cost_usd).label("cost_usd")
    ).filter(
        UsageRecord.workspace_id == workspace_id,
        UsageRecord.environment_id == environment_id
    ).group_by(UsageRecord.feature).all()
    
    return [
        UsageByGroup(group=r.feature or "unknown", requests=r.requests, tokens=r.tokens or 0, cost_usd=r.cost_usd or 0)
        for r in results
    ]


def get_user_usage_today(
    db: Session,
    workspace_id: int,
    environment_id: int,
    user_id: str
) -> Dict[str, Any]:
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    
    records = db.query(UsageRecord).filter(
        UsageRecord.workspace_id == workspace_id,
        UsageRecord.environment_id == environment_id,
        UsageRecord.user_id == user_id,
        UsageRecord.status == "allowed",
        UsageRecord.created_at >= today_start
    ).all()
    
    return {
        "requests_today": len(records),
        "tokens_today": sum(r.total_tokens for r in records),
        "cost_today_usd": sum(r.estimated_cost_usd for r in records),
    }


def get_user_usage_month(
    db: Session,
    workspace_id: int,
    environment_id: int,
    user_id: str
) -> Dict[str, Any]:
    month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    records = db.query(UsageRecord).filter(
        UsageRecord.workspace_id == workspace_id,
        UsageRecord.environment_id == environment_id,
        UsageRecord.user_id == user_id,
        UsageRecord.status == "allowed",
        UsageRecord.created_at >= month_start
    ).all()
    
    return {
        "requests_month": len(records),
        "tokens_month": sum(r.total_tokens for r in records),
        "cost_month_usd": sum(r.estimated_cost_usd for r in records),
    }