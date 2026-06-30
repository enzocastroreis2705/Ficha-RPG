from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
import auth as auth_utils

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=schemas.TokenResponse, status_code=201)
def register(body: schemas.UserRegister, db: Session = Depends(get_db)):
    if db.query(models.User).first():
        raise HTTPException(status_code=403, detail="Cadastro indisponível")

    if db.query(models.User).filter(models.User.email == body.email).first():
        raise HTTPException(status_code=400, detail="Email já cadastrado")

    user = models.User(
        name=body.name,
        email=body.email,
        hashed_password=auth_utils.hash_password(body.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = auth_utils.create_access_token(user.id)
    return {
        "access_token": token,
        "user": {"id": user.id, "name": user.name, "email": user.email},
    }


@router.post("/login", response_model=schemas.TokenResponse)
def login(body: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == body.email).first()
    if not user or not auth_utils.verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Email ou senha incorretos")

    token = auth_utils.create_access_token(user.id)
    return {
        "access_token": token,
        "user": {"id": user.id, "name": user.name, "email": user.email},
    }


@router.get("/me")
def me(current_user: models.User = Depends(auth_utils.get_current_user)):
    return {"id": current_user.id, "name": current_user.name, "email": current_user.email}
