from fastapi import APIRouter

router = APIRouter()


@router.get("")
async def list_policies():
    return {"message": "Policies endpoint"}