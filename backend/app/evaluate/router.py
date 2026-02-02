from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.auth import get_api_key_auth, AuthenticatedRequest
from app.evaluate import services
from app.evaluate.schemas import EvaluateRequest, EvaluateResponse

router = APIRouter()


@router.post("", response_model=EvaluateResponse)
def evaluate(
    data: EvaluateRequest,
    auth: AuthenticatedRequest = Depends(get_api_key_auth),
    db: Session = Depends(get_db)
):
    """
    Evaluate if an AI request should be allowed.
    
    Requires X-API-Key header.
    """
    return services.evaluate_request(db, auth.workspace_id, data)