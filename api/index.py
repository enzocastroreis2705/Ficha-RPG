import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'backend'))

from main import app as fastapi_app  # noqa: E402


class StripApiPrefix:
    """A Vercel encaminha o path completo (/api/fichas/...) para esta function,
    mas as rotas do FastAPI são definidas sem o prefixo /api (para bater com o
    proxy do Vite em dev, que já remove esse prefixo). Remove o /api aqui antes
    de delegar ao app."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http" and scope["path"].startswith("/api"):
            scope = dict(scope)
            scope["path"] = scope["path"][len("/api"):] or "/"
            if scope.get("raw_path"):
                scope["raw_path"] = scope["raw_path"][len(b"/api"):] or b"/"
        await self.app(scope, receive, send)


app = StripApiPrefix(fastapi_app)  # noqa: F811 — Vercel usa esta variável `app`
