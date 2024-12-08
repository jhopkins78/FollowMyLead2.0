from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

Base = declarative_base()

_engine = None
_Session = None

def get_db_session():
    global _engine, _Session
    if _engine is None:
        _engine = create_engine(os.environ['DATABASE_URL'])
        Base.metadata.create_all(_engine)
        _Session = sessionmaker(bind=_engine)
    return _Session()
