from sqlalchemy import Column, Integer, String
from database import Base

class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    doctor_name = Column(String)
    summary = Column(String)
    product = Column(String)