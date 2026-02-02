from fastapi import APIRouter

router = APIRouter()


@router.post("")
async def evaluate():
    return {"message": "Evaluate endpoint"}