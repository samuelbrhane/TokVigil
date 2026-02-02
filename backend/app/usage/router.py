from fastapi import APIRouter

router = APIRouter()


@router.get("")
async def list_usage():
    return {"message": "Usage endpoint"}