from fastapi import APIRouter, Depends
from typing import List

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("")
async def get_notifications():
    return []
