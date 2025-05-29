from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import JSON, ARRAY  # Import JSON and ARRAY types
from sqlalchemy import inspect, Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
import json

db = SQLAlchemy()
def init_db(app):
    with app.app_context():
        # Create inspector to check for existing tables
        inspector = inspect(db.engine)
        #db.create_all()
        # Check if our table exists
        if not inspector.has_table('businesses') and not inspector.has_table('web_data'):
            db.create_all()
            print("Database tables created successfully!")
        else:
            print("Tables already exist!")    


class Business(db.Model):  # Capitalize class name and use Model not model
    __tablename__ = 'businesses'
    
    id = db.Column(db.Integer, primary_key=True)  # Remove trailing comma
    uid = db.Column(db.String(200), unique=True, nullable=False)  # Remove trailing comma
    country = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    business_idea = db.Column(db.Text, nullable=False)  # Use Text for longer strings
    ownership_structure = db.Column(db.String(100), nullable=False)
    sales_model = db.Column(db.String(100), nullable=False)
    hire_employees = db.Column(JSON, nullable=False, default={
        "answer": False,
        "number_of_employees": 0,
        "type": "part_time"
    })
    expected_annual_revenue = db.Column(db.Float, nullable=False)
    expected_annual_expenses = db.Column(db.Float, nullable=False)
    expected_capital_source = db.Column(ARRAY(db.String), nullable=False)  # Changed to array for multiple sources
    owner_pay_style = db.Column(db.String(100), nullable=False)
    buy_assets = db.Column(JSON, nullable=False, default={  # Fixed spelling of 'assets'
        "answer": False,
        "things": []
    })
    sell_internationally = db.Column(JSON, nullable=False, default={
        "answer": False,
        "countries": []
    })
    tax_priorities = db.Column(ARRAY(db.String), nullable=False)
    no_business = db.Column(db.Integer, nullable=False)  
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

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
            "buy_assets": self.buy_assets,  # Fixed spelling
            "sell_internationally": self.sell_internationally,
            "tax_priorities": self.tax_priorities,
            "no_business": self.no_business,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
    
class WebData(db.Model):
    __tablename__ = 'web_data'
    id = db.Column(db.Integer, primary_key=True)
    business_id = db.Column(db.Integer, nullable=False,unique=True)
    web_data = db.Column(db.Text, nullable=False) # You can adjust the data type as needed
    supabase_uid = db.Column(db.String(200), unique=False, nullable=False) #Allow null if not always present


class TaxPlan(db.Model):
    __tablename__ = 'tax_plans'
    id = Column(Integer, primary_key=True)
    business_id = Column(Integer, ForeignKey('businesses.id'), nullable=False,unique=True)
    supabase_uid = Column(String(200), nullable=False)  # Supabase UID
    tax_plan = Column(Text, nullable=False)
    sec_taxplan = Column(Text,nullable=True)  # The tax minimization plan (JSON or text)

    business = relationship("Business", backref="tax_plans") #add relationship with business

    def to_dict(self):
        return {
            "tax_plan": json.loads(self.tax_plan) if self.tax_plan else None, #handle None case
            "sec_taxplan": json.loads(self.sec_taxplan) if self.sec_taxplan else None #handle None case

        }

class BusinessProgress(db.Model):
    __tablename__ ='business_progress'
    id = Column(Integer, primary_key=True)
    business_id = Column(Integer, ForeignKey('businesses.id'), nullable=False)
    progress = Column(Text, nullable=False)

    def to_dict(self):
        return {"progress_text": self.progress_text}