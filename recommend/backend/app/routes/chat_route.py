from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict
from bson import ObjectId
import json
from datetime import datetime

router = APIRouter(prefix="/chat", tags=["Chat"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_personal_message(self, message: str, user_id: str):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_text(message)

manager = ConnectionManager()

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Just echo for demo or process json
            try:
                payload = json.loads(data)
                receiver_id = payload.get("receiver_id")
                if receiver_id:
                    await manager.send_personal_message(data, receiver_id)
            except:
                pass
    except WebSocketDisconnect:
        manager.disconnect(user_id)

@router.get("/history/{user_id}")
async def get_history(user_id: str):
    return []

@router.get("/conversations")
async def get_conversations():
    return []

@router.get("/history/{user1_id}/{user2_id}")
async def get_chat_history(user1_id: str, user2_id: str):
    return []

@router.post("/send")
async def send_msg(payload: dict):
    # Dummy broadcast to the receiver
    receiver_id = payload.get("receiver_id")
    if receiver_id in manager.active_connections:
        await manager.send_personal_message(json.dumps({"sender_id": "System", "text": payload.get("text")}), receiver_id)
    return {"status": "ok"}
