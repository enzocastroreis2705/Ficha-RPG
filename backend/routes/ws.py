import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from database import get_db
import models
from ws_manager import manager

router = APIRouter(tags=["websocket"])


def _serialize(ficha: models.Ficha) -> dict:
    return {
        "id": ficha.id,
        "nome": ficha.nome,
        "titulo": ficha.titulo,
        "atributos": json.loads(ficha.atributos or "{}"),
        "anotacoes": ficha.anotacoes,
        "habilidades": json.loads(ficha.habilidades or "[]"),
        "cores": json.loads(ficha.cores or "{}"),
    }


@router.websocket("/ws/ficha/{ficha_id}")
async def ws_viewer(
    ficha_id: int,
    websocket: WebSocket,
    db: Session = Depends(get_db),
):
    ficha = db.query(models.Ficha).filter(models.Ficha.id == ficha_id).first()
    if not ficha:
        await websocket.close(code=4004)
        return

    await manager.connect(ficha_id, websocket)
    try:
        # Envia estado atual assim que o viewer conecta
        await websocket.send_json(_serialize(ficha))
        while True:
            # Mantém conexão viva; ignora mensagens do cliente
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(ficha_id, websocket)
