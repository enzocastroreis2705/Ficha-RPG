from pydantic import BaseModel, EmailStr
from typing import Any
from datetime import datetime


# ── Auth ──────────────────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


# ── Fichas ────────────────────────────────────────────────────────────────────

class FichaCreate(BaseModel):
    nome: str
    titulo: str = ""
    atributos: dict[str, Any] = {}
    anotacoes: str = ""
    habilidades: list[Any] = []
    cores: dict[str, Any] = {}


class FichaUpdate(BaseModel):
    nome: str | None = None
    titulo: str | None = None
    atributos: dict[str, Any] | None = None
    anotacoes: str | None = None
    habilidades: list[Any] | None = None
    cores: dict[str, Any] | None = None


class FichaResponse(BaseModel):
    id: int
    user_id: int
    nome: str
    titulo: str
    atributos: dict[str, Any]
    anotacoes: str
    habilidades: list[Any]
    cores: dict[str, Any]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
