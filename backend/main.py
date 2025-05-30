from flask import Flask,request,jsonify
from llmmodel import llm_response,tax_minimalization,business_guild
from websearch import search
from webdetails import extract_from_url
from dbmodel import db, Business,init_db,TaxPlan,BusinessProgress
import os
from dotenv import load_dotenv
import json
from flask_cors import CORS
from concurrent.futures import ProcessPoolExecutor
import multiprocessing
from tasks import celery_app, tax_minimalization_task
from celery.result import AsyncResult

#sbp_fdb6493e30c875d8b70bf199eb82931eaf6568dd  supabase
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

llm_executor = ProcessPoolExecutor(max_workers=32)    # Handle concurrent requests


load_dotenv()
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'pool_size': 100,  # Permanent database connections
    'max_overflow': 200,  # Additional temporary connections
    'pool_timeout': 30,  # Seconds to wait for connection
    'pool_recycle': 1800,  # Recycle connections after 30 minutes
    'pool_pre_ping': True 
}
app.config['SQLALCHEMY_DATABASE_URI'] =os.getenv("DATABASE_URL")
db.init_app(app)


def tax_minimalization_worker(business_data, uid):
    with app.app_context():
        from llmmodel import tax_minimalization
        return tax_minimalization(business_data, uid)

@app.route("/")
def home():
    return "backend is running"

@app.route("/businnesdata/<string:uids>/<string:no>", methods=["POST"])
def add_business(uids,no):
    data = request.get_json()
    try:
        new_business = Business(
            uid=uids,
            country=data.get("country"),
            state=data.get("state"),
            city=data.get("city"),
            business_idea=data.get("business_idea"),
            ownership_structure=data.get("ownership_structure"),
            sales_model=data.get("sales_model"),
            hire_employees=data.get("hire_employees", {
                "answer": False,
                "number_of_employees": 0,
                "type": ""
            }),
            expected_annual_revenue=data.get("expected_annual_revenue"),
            expected_annual_expenses=data.get("expected_annual_expenses"),
            expected_capital_source=data.get("expected_capital_source", []),
            owner_pay_style=data.get("owner_pay_style"),
            buy_assets=data.get("buy_assets", {
                "answer": False,
                "things": []
            }),
            sell_internationally=data.get("sell_internationally", {
                "answer": False,
                "countries": []
            }),
            tax_priorities=data.get("tax_priorities", []),
            no_business = no,
        )
        db.session.add(new_business)
        db.session.commit()
        return jsonify({"message": "Business data added successfully", "uid": uids}), 201 # Return a JSON response
    except Exception as e:
        db.session.rollback() # Rollback in case of error
        print(f"Error adding business: {e}")
        return jsonify({"error": "Error adding business"}), 500 #Return error


@app.route("/tax_minimalization/<string:uid>/<string:no>", methods=["GET"])
def tax_plan(uid, no):
    business = Business.query.filter_by(uid=uid, no_business=no).first()
    if business:
        business_data = business.to_dict()
        future = llm_executor.submit(tax_minimalization_worker, business_data, uid)
        try:
            tax_plan = future.result()
            if tax_plan:
                return jsonify(tax_plan), 200
            else:
                return jsonify({"error": "Error generating tax plan"}), 500
        except Exception as e:
            return jsonify({"error": f"LLM processing error: {e}"}), 500
    else:
        return jsonify({"error": "Business not found"}), 404
    
@app.route("/tax_minimalization/<string:uid>/<string:no>", methods=["post"])   
def s_tax_plan(uid,no):
    try:
        tax_plan_data = request.get_json()
        # Validate that tax_plan_data is a dictionary.
        if not isinstance(tax_plan_data, dict):
            return jsonify({"error": "Invalid tax plan data format. Must be a JSON object."}), 400

        # Check if a TaxPlan entry already exists for this business_id and supabase_uid.
        existing_tax_plan = TaxPlan.query.filter_by(supabase_uid=uid, business_id=no).first()
        if existing_tax_plan:
            #Check if sec_taxplan already exists and is not None
            if existing_tax_plan.sec_taxplan:
                return jsonify({"message": "Tax plan already exists for this business."}), 200
            else: #update existing tax plan
                existing_tax_plan.sec_taxplan = json.dumps(tax_plan_data)
                db.session.commit()
                return jsonify({"message": "Tax plan updated successfully"}), 200
        else: #create a new tax plan
            new_tax_plan = TaxPlan(
                supabase_uid=uid,
                business_id=no,
                sec_taxplan=json.dumps(tax_plan_data)  # Store as JSON string
            )
            db.session.add(new_tax_plan)
            db.session.commit()
            return jsonify({"message": "Tax plan added successfully"}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error adding tax plan: {e}")
        return jsonify({"error": f"Error adding tax plan: {e}"}), 500

@app.route("/get_tax_plan/<string:supabase_uid>/<int:no>", methods=["GET"])
def get_tax_plan(supabase_uid, no):
    try:
        tax_plan = TaxPlan.query.filter_by(supabase_uid=supabase_uid, business_id=no).first()
        if tax_plan:
            tax_plan_data = tax_plan.to_dict()
            if "sec_taxplan" in tax_plan_data and tax_plan_data["sec_taxplan"] is not None:
                return jsonify({"sec_taxplan": tax_plan_data["sec_taxplan"]}), 200
            else:
                return jsonify({"message": "sec_taxplan not found for this business"}), 404
        else:
            return jsonify({"message": "Tax plan not found"}), 404
    except Exception as e:
        print(f"Error retrieving tax plan: {e}")
        return jsonify({"error": "Error retrieving tax plan"}), 500
    

@app.route("/businessstructure/<string:uid>/<int:no>", methods=["GET"])  # Corrected data type for id
def get_businessstructure_doc(uid,no):
    business = Business.query.filter_by(uid=uid, no_business=no).first()
    if not business:
        return jsonify({"error": "Business not found"}), 404
        
    id = business.id 
    try:
        existing_progress = BusinessProgress.query.filter_by(business_id=id).first()
        if existing_progress:
            #Update existing record if it exists
            business_structure = json.loads(existing_progress.progress)["businessstructure"]
            
            return jsonify(business_structure), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500


    return jsonify(business.to_dict())
    

@app.route("/legalcompliance&licensingdocuments/<string:uid>/<int:no>")
def get_legalcompliancelicensingdocuments(uid,no):
    business = Business.query.filter_by(uid=uid, no_business=no).first()
    if not business:
        return jsonify({"error": "Business not found"}), 404
        
    id = business.id 
    try:
        existing_progress = BusinessProgress.query.filter_by(business_id=id).first()
        if existing_progress:
            #Update existing record if it exists
            business_structure = json.loads(existing_progress.progress)["legal compliance &licensing documents"]
            
            return jsonify(business_structure), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route("/tax&financedocuments/<string:uid>/<int:no>")
def  get_taxfinancedocuments(uid,no):
    business = Business.query.filter_by(uid=uid, no_business=no).first()
    if not business:
        return jsonify({"error": "Business not found"}), 404
        
    id = business.id
    try:
        existing_progress = BusinessProgress.query.filter_by(business_id=id).first()
        if existing_progress:
            #Update existing record if it exists
            business_structure = json.loads(existing_progress.progress)[ "tax & finance documents"]
            
            return jsonify(business_structure), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
    
@app.route("/employeerelateddocuments/<string:uid>/<int:no>")
def  get_employeerelateddocuments(uid,no):
    business = Business.query.filter_by(uid=uid, no_business=no).first()
    if not business:
        return jsonify({"error": "Business not found"}), 404
        
    id = business.id
    try:
        existing_progress = BusinessProgress.query.filter_by(business_id=id).first()
        if existing_progress:
            #Update existing record if it exists
            business_structure = json.loads(existing_progress.progress)["employee related documents(if hiring)"]
            
            return jsonify(business_structure), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
    
@app.route("/optionalbrandingipdocuments/<string:uid>/<int:no>")
def  getoptionalbrandingipdocuments(uid,id):
    business = Business.query.filter_by(uid=uid, no_business=no).first()
    if not business:
        return jsonify({"error": "Business not found"}), 404
        
    id = business.id
    try:
        existing_progress = BusinessProgress.query.filter_by(business_id=id).first()
        if existing_progress:
            #Update existing record if it exists
            business_structure = json.loads(existing_progress.progress)["optional branding/ip documents"]
            
            return jsonify(business_structure), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500   
    

if __name__ == "__main__":
    init_db(app)
    app.run(debug=True, host='127.0.0.1', port=int(os.getenv("PORT",5000)))

