import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
import auth as auth_utils
from ws_manager import manager

router = APIRouter(prefix="/fichas", tags=["fichas"])


def _parse(ficha: models.Ficha) -> schemas.FichaResponse:
    ficha.atributos = json.loads(ficha.atributos or "{}")
    ficha.habilidades = json.loads(ficha.habilidades or "[]")
    ficha.cores = json.loads(ficha.cores or "{}")
    return schemas.FichaResponse.model_validate(ficha)


@router.get("/", response_model=list[schemas.FichaResponse])
def listar(
    current_user: models.User = Depends(auth_utils.get_current_user),
    db: Session = Depends(get_db),
):
    fichas = db.query(models.Ficha).filter(models.Ficha.user_id == current_user.id).all()
    return [_parse(f) for f in fichas]


@router.get("/public", response_model=list[schemas.FichaResponse])
def listar_publico(db: Session = Depends(get_db)):
    fichas = db.query(models.Ficha).all()
    return [_parse(f) for f in fichas]


@router.post("/", response_model=schemas.FichaResponse, status_code=201)
def criar(
    body: schemas.FichaCreate,
    current_user: models.User = Depends(auth_utils.get_current_user),
    db: Session = Depends(get_db),
):
    ficha = models.Ficha(
        user_id=current_user.id,
        nome=body.nome,
        titulo=body.titulo,
        atributos=json.dumps(body.atributos),
        anotacoes=body.anotacoes,
        habilidades=json.dumps(body.habilidades),
        cores=json.dumps(body.cores),
    )
    db.add(ficha)
    db.commit()
    db.refresh(ficha)
    return _parse(ficha)


@router.get("/{ficha_id}", response_model=schemas.FichaResponse)
def obter(
    ficha_id: int,
    current_user: models.User = Depends(auth_utils.get_current_user),
    db: Session = Depends(get_db),
):
    ficha = db.query(models.Ficha).filter(
        models.Ficha.id == ficha_id,
        models.Ficha.user_id == current_user.id,
    ).first()
    if not ficha:
        raise HTTPException(status_code=404, detail="Ficha não encontrada")
    return _parse(ficha)


@router.put("/{ficha_id}", response_model=schemas.FichaResponse)
async def atualizar(
    ficha_id: int,
    body: schemas.FichaUpdate,
    current_user: models.User = Depends(auth_utils.get_current_user),
    db: Session = Depends(get_db),
):
    ficha = db.query(models.Ficha).filter(
        models.Ficha.id == ficha_id,
        models.Ficha.user_id == current_user.id,
    ).first()
    if not ficha:
        raise HTTPException(status_code=404, detail="Ficha não encontrada")

    if body.nome is not None:
        ficha.nome = body.nome
    if body.titulo is not None:
        ficha.titulo = body.titulo
    if body.atributos is not None:
        ficha.atributos = json.dumps(body.atributos)
    if body.anotacoes is not None:
        ficha.anotacoes = body.anotacoes
    if body.habilidades is not None:
        ficha.habilidades = json.dumps(body.habilidades)
    if body.cores is not None:
        ficha.cores = json.dumps(body.cores)

    db.commit()
    db.refresh(ficha)
    result = _parse(ficha)
    await manager.broadcast(ficha_id, result.model_dump(mode="json"))
    return result


@router.delete("/{ficha_id}", status_code=204)
def deletar(
    ficha_id: int,
    current_user: models.User = Depends(auth_utils.get_current_user),
    db: Session = Depends(get_db),
):
    ficha = db.query(models.Ficha).filter(
        models.Ficha.id == ficha_id,
        models.Ficha.user_id == current_user.id,
    ).first()
    if not ficha:
        raise HTTPException(status_code=404, detail="Ficha não encontrada")
    db.delete(ficha)
    db.commit()
