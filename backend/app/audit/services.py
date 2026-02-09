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
    limit: int = 50,
    offset: int = 0
) -> List[AuditLog]:
    return db.query(AuditLog).filter(
        AuditLog.workspace_id == workspace_id
    ).order_by(AuditLog.created_at.desc()).offset(offset).limit(limit).all()