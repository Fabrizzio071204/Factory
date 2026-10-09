from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional, Any


class ArchivoOut(BaseModel):
    id: UUID
    caso_id: UUID
    nombre_original: str
    hash_original: str
    hash_actual: Optional[str] = None
    metadatos: Optional[Any] = None
    subido_en: datetime

    class Config:
        from_attributes = True