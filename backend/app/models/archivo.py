import uuid
from sqlalchemy import Column, String, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.db.session import Base

class Archivo(Base):
    __tablename__ = "archivos"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    caso_id = Column(UUID(as_uuid=True), ForeignKey("casos.id"), nullable=False)
    nombre_original = Column(String, nullable=False)
    ruta_original = Column(String, nullable=False)
    ruta_copia_trabajo = Column(String, nullable=False)
    hash_original = Column(String, nullable=False)
    hash_actual = Column(String, nullable=True)
    metadatos = Column(JSONB, nullable=True)
    subido_en = Column(DateTime(timezone=True), server_default=func.now())