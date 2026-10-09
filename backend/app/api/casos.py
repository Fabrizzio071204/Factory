from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.db.session import get_db
from app.schemas.caso import CasoCreate, CasoOut
from app.models.caso import Caso, EstadoCasoEnum
from app.models.usuario import EspecialidadEnum, RolEnum
from typing import List, Optional
from app.core.security import get_current_user

router = APIRouter(prefix="/casos", tags=["casos"])

@router.post("", response_model=CasoOut, status_code=status.HTTP_201_CREATED)
def crear_caso(
    payload: CasoCreate,
    db: Session = Depends(get_db),
    usuario_actual=Depends(get_current_user),
):
    existe = db.query(Caso).filter(Caso.numero_caso == payload.numero_caso).first()
    if existe:
        raise HTTPException(status_code=409, detail="Ya existe un caso con ese número.")

    nuevo_caso = Caso(
        numero_caso=payload.numero_caso,
        especialidad=payload.especialidad,
        usuario_id=usuario_actual.id,
    )
    db.add(nuevo_caso)
    try:
        db.commit()
        db.refresh(nuevo_caso)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Ya existe un caso con ese número.")

    return nuevo_caso

@router.get("", response_model=List[CasoOut])
def listar_casos(
    especialidad: Optional[EspecialidadEnum] = None,
    estado: Optional[EstadoCasoEnum] = None,
    db: Session = Depends(get_db),
    usuario_actual=Depends(get_current_user),
):
    query = db.query(Caso)

    if usuario_actual.rol != RolEnum.admin:
        query = query.filter(Caso.usuario_id == usuario_actual.id)

    if especialidad:
        query = query.filter(Caso.especialidad == especialidad)
    if estado:
        query = query.filter(Caso.estado == estado)

    return query.order_by(Caso.creado_en.desc()).all()
