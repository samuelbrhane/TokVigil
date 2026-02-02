"""
Policies endpoints.

Policies define rules for AI usage limits, budgets, and enforcement.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db

router = APIRouter()


@router.get("")
async def list_policies(db: Session = Depends(get_db)):
    """
    List all policies.
    
    TODO: Implement with actual database query.
    """
    return {
        "message": "Policies endpoint - to be implemented",
        "endpoints": [
            "GET /policies - List policies",
            "POST /policies - Create policy",
            "GET /policies/{id} - Get policy",
            "PUT /policies/{id} - Update policy",
            "DELETE /policies/{id} - Delete policy",
            "POST /policies/test - Test policy evaluation",
        ]
    }


@router.post("")
async def create_policy(db: Session = Depends(get_db)):
    """Create a new policy."""
    return {"message": "Create policy - to be implemented"}


@router.get("/{policy_id}")
async def get_policy(policy_id: int, db: Session = Depends(get_db)):
    """Get policy by ID."""
    return {"message": f"Get policy {policy_id} - to be implemented"}


@router.put("/{policy_id}")
async def update_policy(policy_id: int, db: Session = Depends(get_db)):
    """Update policy."""
    return {"message": f"Update policy {policy_id} - to be implemented"}


@router.delete("/{policy_id}")
async def delete_policy(policy_id: int, db: Session = Depends(get_db)):
    """Delete policy."""
    return {"message": f"Delete policy {policy_id} - to be implemented"}
