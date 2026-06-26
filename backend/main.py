from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models  # noqa: F401 — garante que os modelos são registrados
from routes import auth, fichas, ws

Base.metadata.create_all(bind=engine)

app = FastAPI(title="RPG Ficha API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(fichas.router)
app.include_router(ws.router)


@app.get("/")
def root():
    return {"status": "ok", "docs": "/docs"}
