from fastapi import APIRouter

router = APIRouter()


@router.get("")
async def list_workspaces():
    return {"message": "Workspaces endpoint"}