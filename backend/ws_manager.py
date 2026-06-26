from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self._connections: dict[int, list[WebSocket]] = {}

    async def connect(self, ficha_id: int, ws: WebSocket):
        await ws.accept()
        self._connections.setdefault(ficha_id, []).append(ws)

    def disconnect(self, ficha_id: int, ws: WebSocket):
        conns = self._connections.get(ficha_id, [])
        if ws in conns:
            conns.remove(ws)

    async def broadcast(self, ficha_id: int, data: dict):
        for ws in list(self._connections.get(ficha_id, [])):
            try:
                await ws.send_json(data)
            except Exception:
                self.disconnect(ficha_id, ws)

    def viewer_count(self, ficha_id: int) -> int:
        return len(self._connections.get(ficha_id, []))


manager = ConnectionManager()
