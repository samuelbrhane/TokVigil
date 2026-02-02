from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.evaluate import services
from app.evaluate.schemas import EvaluateRequest, EvaluateResponse

router = APIRouter()


@router.post("/{workspace_id}", response_model=EvaluateResponse)
def evaluate(
    workspace_id: int,
    data: EvaluateRequest,
    db: Session = Depends(get_db)
):
    """
    Evaluate if an AI request should be allowed.
    
    SDK calls this before making LLM request.
    Returns decision with reason code and current usage state.
    """
    return services.evaluate_request(db, workspace_id, data)