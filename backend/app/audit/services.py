from typing import Optional, Any, List
from sqlalchemy.orm import Session
from app.audit.models import AuditLog


def create_audit_log(
    db: Session,
    action: str,
    resource_type: str,
    user_id: Optional[int] = None,
    user_email: Optional[str] = None,
    workspace_id: Optional[int] = None,
    resource_id: Optional[int] = None,
    resource_name: Optional[str] = None,
    old_values: Optional[dict] = None,
    new_values: Optional[dict] = None,
    ip_address: Optional[str] = None
) -> AuditLog:
    log = AuditLog(
        user_id=user_id,
        user_email=user_email,
        workspace_id=workspace_id,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        resource_name=resource_name,
        old_values=old_values,
        new_values=new_values,
        ip_address=ip_address
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


def get_audit_logs(
    db: Session,
    workspace_id: int,
    page: int = 1,
    page_size: int = 20,
    action: str = None,
    resource_type: str = None,
    user_email: str = None
) -> dict:
    query = db.query(AuditLog).filter(
        AuditLog.workspace_id == workspace_id
    )
    
    if action:
        query = query.filter(AuditLog.action == action)
    if resource_type:
        query = query.filter(AuditLog.resource_type == resource_type)
    if user_email:
        query = query.filter(AuditLog.user_email == user_email)
    
    total = query.count()
    total_pages = (total + page_size - 1) // page_size
    
    items = query.order_by(AuditLog.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    
    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "has_next": page < total_pages,
        "has_prev": page > 1
    }