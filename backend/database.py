from sqlalchemy.orm import sessionmaker, scoped_session
from contextlib import contextmanager
from dbmodel import init_db
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
# Create engine
engine = init_db()

# Create scoped session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class AsyncSession:
    async def __aenter__(self):
        self.session = SessionLocal()
        return self.session

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        try:
            if exc_type is None:
                self.session.commit()
            else:
                self.session.rollback()
        finally:
            self.session.close()

async def get_db():
    async with AsyncSession() as db:  # AsyncSession is now the context manager
        return db # Directly return the database session
