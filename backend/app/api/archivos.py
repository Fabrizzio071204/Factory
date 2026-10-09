from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.db.session import get_db
from app.schemas.archivo import ArchivoOut
from app.models.caso import Caso
from app.models.archivo import Archivo
from app.models.log_custodia import LogCustodia, AccionEnum
from app.models.usuario import RolEnum
from app.core.security import get_current_user
from app.services.storage_service import guardar_archivo
from app.services.hashing_service import calcular_sha256

router = APIRouter(tags=["archivos"])


@router.post(
    "/casos/{caso_id}/archivos",
    response_model=ArchivoOut,
    status_code=status.HTTP_201_CREATED,
)
def subir_archivo(
    caso_id: UUID,
    archivo: UploadFile = File(...),
    db: Session = Depends(get_db),
    usuario_actual=Depends(get_current_user),
):
    caso = db.query(Caso).filter(Caso.id == caso_id).first()
    if not caso:
        raise HTTPException(status_code=404, detail="Caso no encontrado.")
    if usuario_actual.rol != RolEnum.admin and caso.usuario_id != usuario_actual.id:
        raise HTTPException(status_code=404, detail="Caso no encontrado.")

    ruta_original, ruta_copia = guardar_archivo(
        str(caso_id), archivo.filename, archivo.file
    )
    hash_copia = calcular_sha256(ruta_copia)

    nuevo = Archivo(
        caso_id=caso_id,
        nombre_original=archivo.filename,
        ruta_original=ruta_original,
        ruta_copia_trabajo=ruta_copia,
        hash_original=hash_copia,
        hash_actual=hash_copia,
        metadatos={"content_type": archivo.content_type},
    )
    db.add(nuevo)
    db.flush()

    db.add(
        LogCustodia(
            archivo_id=nuevo.id,
            usuario_id=usuario_actual.id,
            accion=AccionEnum.subida,
            resultado="íntegro",
        )
    )
    db.commit()
    db.refresh(nuevo)
    return nuevo