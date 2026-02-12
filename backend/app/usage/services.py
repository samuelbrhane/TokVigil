from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any

from sqlalchemy.orm import Session
from sqlalchemy import func, Integer

from app.usage.models import UsageRecord
from app.usage.schemas import UsageLogRequest, UsageSummary, UsageByGroup
from app.workspaces.models import Workspace, ApiKey
from app.policies.models import Policy
    


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
        estimated_cost_usd=data.estimated_cost_usd or 0.0,
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
    page: int = 1,
    page_size: int = 20,
    user_id: Optional[str] = None,
    feature: Optional[str] = None,
    model: Optional[str] = None,
    status: Optional[str] = None
) -> dict:
    query = db.query(UsageRecord).filter(
        UsageRecord.workspace_id == workspace_id,
        UsageRecord.environment_id == environment_id
    )
    
    if user_id:
        query = query.filter(UsageRecord.user_id == user_id)
    if feature:
        query = query.filter(UsageRecord.feature == feature)
    if model:
        query = query.filter(UsageRecord.model == model)
    if status:
        query = query.filter(UsageRecord.status == status)
    
    total = query.count()
    total_pages = (total + page_size - 1) // page_size
    
    items = query.order_by(UsageRecord.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    
    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "has_next": page < total_pages,
        "has_prev": page > 1
    }


def get_blocked_requests(
    db: Session,
    workspace_id: int,
    environment_id: int,
    page: int = 1,
    page_size: int = 20
) -> dict:
    query = db.query(UsageRecord).filter(
        UsageRecord.workspace_id == workspace_id,
        UsageRecord.environment_id == environment_id,
        UsageRecord.status == "blocked"
    )
    
    total = query.count()
    total_pages = (total + page_size - 1) // page_size
    
    items = query.order_by(UsageRecord.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    
    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "has_next": page < total_pages,
        "has_prev": page > 1
    }


def get_usage_by_user(
    db: Session,
    workspace_id: int,
    environment_id: int,
    page: int = 1,
    page_size: int = 20
) -> dict:
    query = db.query(
        UsageRecord.user_id,
        func.count(UsageRecord.id).label("requests"),
        func.sum(UsageRecord.total_tokens).label("tokens"),
        func.sum(UsageRecord.estimated_cost_usd).label("cost_usd")
    ).filter(
        UsageRecord.workspace_id == workspace_id,
        UsageRecord.environment_id == environment_id
    ).group_by(UsageRecord.user_id).order_by(func.count(UsageRecord.id).desc())  # Add this!
    
    total = query.count()
    total_pages = (total + page_size - 1) // page_size
    
    results = query.offset((page - 1) * page_size).limit(page_size).all()
    
    items = [
        UsageByGroup(group=r.user_id, requests=r.requests, tokens=r.tokens or 0, cost_usd=r.cost_usd or 0)
        for r in results
    ]
    
    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "has_next": page < total_pages,
        "has_prev": page > 1
    }


def get_usage_by_feature(
    db: Session,
    workspace_id: int,
    environment_id: int,
    page: int = 1,
    page_size: int = 20
) -> dict:
    query = db.query(
        UsageRecord.feature,
        func.count(UsageRecord.id).label("requests"),
        func.sum(UsageRecord.total_tokens).label("tokens"),
        func.sum(UsageRecord.estimated_cost_usd).label("cost_usd")
    ).filter(
        UsageRecord.workspace_id == workspace_id,
        UsageRecord.environment_id == environment_id
    ).group_by(UsageRecord.feature).order_by(func.count(UsageRecord.id).desc())  # Add this!
    
    total = query.count()
    total_pages = (total + page_size - 1) // page_size
    
    results = query.offset((page - 1) * page_size).limit(page_size).all()
    
    items = [
        UsageByGroup(group=r.feature or "unknown", requests=r.requests, tokens=r.tokens or 0, cost_usd=r.cost_usd or 0)
        for r in results
    ]
    
    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "has_next": page < total_pages,
        "has_prev": page > 1
    }
def get_usage_summary(
    db: Session,
    workspace_id: int,
    environment_id: int,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
) -> UsageSummary:
    query = db.query(
        func.count(UsageRecord.id).label("total_requests"),
        func.coalesce(func.sum(UsageRecord.total_tokens), 0).label("total_tokens"),
        func.coalesce(func.sum(UsageRecord.estimated_cost_usd), 0).label("total_cost_usd"),
        func.sum(func.cast(UsageRecord.status == "allowed", Integer)).label("allowed_count"),
        func.sum(func.cast(UsageRecord.status == "blocked", Integer)).label("blocked_count"),
    ).filter(
        UsageRecord.workspace_id == workspace_id,
        UsageRecord.environment_id == environment_id
    )

    if start_date:
        query = query.filter(UsageRecord.created_at >= start_date)
    if end_date:
        query = query.filter(UsageRecord.created_at <= end_date)

    r = query.one()

    return UsageSummary(
        total_requests=r.total_requests,
        total_tokens=int(r.total_tokens),
        total_cost_usd=float(r.total_cost_usd),
        allowed_count=int(r.allowed_count or 0),
        blocked_count=int(r.blocked_count or 0),
    )


def get_user_usage_today(
    db: Session,
    workspace_id: int,
    environment_id: int,
    user_id: str
) -> Dict[str, Any]:
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

    r = db.query(
        func.count(UsageRecord.id).label("requests_today"),
        func.coalesce(func.sum(UsageRecord.total_tokens), 0).label("tokens_today"),
        func.coalesce(func.sum(UsageRecord.estimated_cost_usd), 0).label("cost_today_usd"),
    ).filter(
        UsageRecord.workspace_id == workspace_id,
        UsageRecord.environment_id == environment_id,
        UsageRecord.user_id == user_id,
        UsageRecord.status == "allowed",
        UsageRecord.created_at >= today_start
    ).one()

    return {
        "requests_today": r.requests_today,
        "tokens_today": int(r.tokens_today),
        "cost_today_usd": float(r.cost_today_usd),
    }


def get_user_usage_month(
    db: Session,
    workspace_id: int,
    environment_id: int,
    user_id: str
) -> Dict[str, Any]:
    month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    r = db.query(
        func.count(UsageRecord.id).label("requests_month"),
        func.coalesce(func.sum(UsageRecord.total_tokens), 0).label("tokens_month"),
        func.coalesce(func.sum(UsageRecord.estimated_cost_usd), 0).label("cost_month_usd"),
    ).filter(
        UsageRecord.workspace_id == workspace_id,
        UsageRecord.environment_id == environment_id,
        UsageRecord.user_id == user_id,
        UsageRecord.status == "allowed",
        UsageRecord.created_at >= month_start
    ).one()

    return {
        "requests_month": r.requests_month,
        "tokens_month": int(r.tokens_month),
        "cost_month_usd": float(r.cost_month_usd),
    }
    
    
def get_global_usage_summary(
    db: Session,
    user_id: int,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
) -> dict:
    
    workspace_ids = db.query(Workspace.id).filter(
        Workspace.owner_id == user_id,
        Workspace.is_deleted == False
    ).all()
    workspace_ids = [w[0] for w in workspace_ids]
    
    workspace_count = len(workspace_ids)
    
    if not workspace_ids:
        return {
            "total_requests": 0,
            "total_tokens": 0,
            "total_cost_usd": 0.0,
            "allowed_count": 0,
            "blocked_count": 0,
            "workspace_count": 0,
            "policy_count": 0,
            "api_key_count": 0,
        }
    
    # Policy count
    policy_count = db.query(Policy).filter(
        Policy.workspace_id.in_(workspace_ids),
        Policy.is_deleted == False,
        Policy.is_active == True
    ).count()
    
    # API key count
    api_key_count = db.query(ApiKey).filter(
        ApiKey.workspace_id.in_(workspace_ids),
        ApiKey.is_deleted == False,
        ApiKey.is_active == True
    ).count()
    
    query = db.query(
        func.count(UsageRecord.id).label("total_requests"),
        func.coalesce(func.sum(UsageRecord.total_tokens), 0).label("total_tokens"),
        func.coalesce(func.sum(UsageRecord.estimated_cost_usd), 0).label("total_cost_usd"),
        func.sum(func.cast(UsageRecord.status == "allowed", Integer)).label("allowed_count"),
        func.sum(func.cast(UsageRecord.status == "blocked", Integer)).label("blocked_count"),
    ).filter(
        UsageRecord.workspace_id.in_(workspace_ids)
    )
    
    if start_date:
        query = query.filter(UsageRecord.created_at >= start_date)
    if end_date:
        query = query.filter(UsageRecord.created_at <= end_date)
    
    r = query.one()
    
    return {
        "total_requests": r.total_requests,
        "total_tokens": int(r.total_tokens),
        "total_cost_usd": float(r.total_cost_usd),
        "allowed_count": int(r.allowed_count or 0),
        "blocked_count": int(r.blocked_count or 0),
        "workspace_count": workspace_count,
        "policy_count": policy_count,
        "api_key_count": api_key_count,
    }
    
    
def get_global_recent_usage(
    db: Session,
    user_id: int,
    page: int = 1,
    page_size: int = 10
) -> dict:
    from app.workspaces.models import Workspace
    
    workspace_ids = db.query(Workspace.id).filter(
        Workspace.owner_id == user_id,
        Workspace.is_deleted == False
    ).all()
    workspace_ids = [w[0] for w in workspace_ids]
    
    if not workspace_ids:
        return {
            "items": [],
            "total": 0,
            "page": page,
            "page_size": page_size,
            "total_pages": 0,
            "has_next": False,
            "has_prev": False,
        }
    
    query = db.query(UsageRecord).filter(
        UsageRecord.workspace_id.in_(workspace_ids)
    )
    
    total = query.count()
    total_pages = (total + page_size - 1) // page_size
    
    items = query.order_by(UsageRecord.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    
    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "has_next": page < total_pages,
        "has_prev": page > 1,
    }


def get_global_top_users(
    db: Session,
    user_id: int,
    limit: int = 5
) -> list:
    from app.workspaces.models import Workspace
    
    workspace_ids = db.query(Workspace.id).filter(
        Workspace.owner_id == user_id,
        Workspace.is_deleted == False
    ).all()
    workspace_ids = [w[0] for w in workspace_ids]
    
    if not workspace_ids:
        return []
    
    results = db.query(
        UsageRecord.user_id,
        func.count(UsageRecord.id).label("requests"),
        func.coalesce(func.sum(UsageRecord.total_tokens), 0).label("tokens"),
        func.coalesce(func.sum(UsageRecord.estimated_cost_usd), 0).label("cost_usd"),
        func.sum(func.cast(UsageRecord.status == "blocked", Integer)).label("blocked"),
    ).filter(
        UsageRecord.workspace_id.in_(workspace_ids)
    ).group_by(
        UsageRecord.user_id
    ).order_by(
        func.count(UsageRecord.id).desc()
    ).limit(limit).all()
    
    return [
        {
            "user_id": r.user_id,
            "requests": r.requests,
            "tokens": int(r.tokens),
            "cost_usd": float(r.cost_usd),
            "blocked": int(r.blocked or 0),
        }
        for r in results
    ]

    
def get_global_daily_usage(
    db: Session,
    user_id: int,
    days: int = 7
) -> list:
    from app.workspaces.models import Workspace
    
    workspace_ids = db.query(Workspace.id).filter(
        Workspace.owner_id == user_id,
        Workspace.is_deleted == False
    ).all()
    workspace_ids = [w[0] for w in workspace_ids]
    
    if not workspace_ids:
        return []
    
    start_date = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    start_date = start_date - timedelta(days=days - 1)
    
    results = db.query(
        func.date(UsageRecord.created_at).label("day"),
        func.count(UsageRecord.id).label("requests"),
        func.coalesce(func.sum(UsageRecord.total_tokens), 0).label("tokens"),
        func.coalesce(func.sum(UsageRecord.estimated_cost_usd), 0).label("cost_usd"),
    ).filter(
        UsageRecord.workspace_id.in_(workspace_ids),
        UsageRecord.created_at >= start_date
    ).group_by(
        func.date(UsageRecord.created_at)
    ).order_by(
        func.date(UsageRecord.created_at)
    ).all()
    
    # Fill missing days with zeros
    result_map = {str(r.day): r for r in results}
    daily = []
    for i in range(days):
        day = start_date + timedelta(days=i)
        day_str = str(day.date())
        if day_str in result_map:
            r = result_map[day_str]
            daily.append({
                "date": day_str,
                "requests": r.requests,
                "tokens": int(r.tokens),
                "cost_usd": float(r.cost_usd),
            })
        else:
            daily.append({
                "date": day_str,
                "requests": 0,
                "tokens": 0,
                "cost_usd": 0.0,
            })
    
    # Aggregate into weeks for 90d
    if days > 30:
        weekly = []
        for i in range(0, len(daily), 7):
            chunk = daily[i:i + 7]
            if not chunk:
                continue
            weekly.append({
                "date": chunk[0]["date"],
                "requests": sum(d["requests"] for d in chunk),
                "tokens": sum(d["tokens"] for d in chunk),
                "cost_usd": sum(d["cost_usd"] for d in chunk),
            })
        return weekly
    
    return daily