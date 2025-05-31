# Import necessary libraries for SQLAlchemy
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Float
from sqlalchemy.dialects.postgresql import JSON, ARRAY
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine, inspect
from sqlalchemy.sql import func
import json
import os
from dotenv import load_dotenv

# Create declarative base
Base = declarative_base()

# Database initialization
def init_db():
    load_dotenv()
    DATABASE_URL = os.getenv("DATABASE_URL")
    engine = create_engine(
        DATABASE_URL,
        pool_size=100,
        max_overflow=200,
        pool_timeout=30,
        pool_recycle=1800,
        pool_pre_ping=True
    )
    
    inspector = inspect(engine)
    if not inspector.has_table('businesses') and not inspector.has_table('web_data'):
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully!")
    else:
        print("Tables already exist!")
    return engine 


class Business(Base):
    __tablename__ = 'businesses'
    
    id = Column(Integer, primary_key=True)
    uid = Column(String(200), unique=True, nullable=False)
    country = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    city = Column(String(100), nullable=False)
    business_idea = Column(Text, nullable=False)
    ownership_structure = Column(String(100), nullable=False)
    sales_model = Column(String(100), nullable=False)
    hire_employees = Column(JSON, nullable=False)
    expected_annual_revenue = Column(Float, nullable=False)
    expected_annual_expenses = Column(Float, nullable=False)
    expected_capital_source = Column(ARRAY(String), nullable=False)
    owner_pay_style = Column(String(100), nullable=False)
    buy_assets = Column(JSON, nullable=False)
    sell_internationally = Column(JSON, nullable=False)
    tax_priorities = Column(ARRAY(String), nullable=False)
    no_business = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "uid": self.uid,
            "country": self.country,
            "state": self.state,
            "city": self.city,
            "business_idea": self.business_idea,
            "ownership_structure": self.ownership_structure,
            "sales_model": self.sales_model,
            "hire_employees": self.hire_employees,
            "expected_annual_revenue": self.expected_annual_revenue,
            "expected_annual_expenses": self.expected_annual_expenses,
            "expected_capital_source": self.expected_capital_source,
            "owner_pay_style": self.owner_pay_style,
            "buy_assets": self.buy_assets,
            "sell_internationally": self.sell_internationally,
            "tax_priorities": self.tax_priorities,
            "no_business": self.no_business,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
    


class WebData(Base):
    __tablename__ = 'web_data'
    id = Column(Integer, primary_key=True)
    business_id = Column(Integer, nullable=False, unique=True)
    web_data = Column(Text, nullable=False)
    supabase_uid = Column(String(200), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "business_id": self.business_id,
            "web_data": self.web_data,
            "supabase_uid": self.supabase_uid
        }

class TaxPlan(Base):
    __tablename__ = 'tax_plans'
    id = Column(Integer, primary_key=True)
    business_id = Column(Integer, ForeignKey('businesses.id'), nullable=False, unique=True)
    supabase_uid = Column(String(200), nullable=False)
    tax_plan = Column(Text, nullable=False)
    sec_taxplan = Column(Text, nullable=True)

    business = relationship("Business", backref="tax_plans")

    def to_dict(self):
        return {
            "tax_plan": json.loads(self.tax_plan) if self.tax_plan else None,
            "sec_taxplan": json.loads(self.sec_taxplan) if self.sec_taxplan else None
        }

class BusinessProgress(Base):
    __tablename__ = 'business_progress'
    id = Column(Integer, primary_key=True)
    business_id = Column(Integer, ForeignKey('businesses.id'), nullable=False)
    progress = Column(Text, nullable=False)

    def to_dict(self):
        return {"progress_text": self.progress}