from fastapi import FastAPI, Request, HTTPException, status, Depends
from llmmodel import llm_response,tax_minimalization,business_guild
from websearch import search
from webdetails import extract_from_url
from dbmodel import Business,init_db,TaxPlan,BusinessProgress
import os
from dotenv import load_dotenv
import json
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from concurrent.futures import ThreadPoolExecutor
import multiprocessing
from database import get_db
from sqlalchemy.orm import Session


load_dotenv()

#sbp_fdb6493e30c875d8b70bf199eb82931eaf6568dd  supabase
app = FastAPI()
origins = ["http://localhost:5173"]  # Add your frontend's origin
# executor = ThreadPoolExecutor(max_workers=1000)  # Handle concurrent requests

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  # Allow cookies
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, etc.)
    allow_headers=["*"],  # Allow all headers
)


# app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
#     'pool_size': 100,  # Permanent database connections
#     'max_overflow': 200,  # Additional temporary connections
#     'pool_timeout': 30,  # Seconds to wait for connection
#     'pool_recycle': 1800,  # Recycle connections after 30 minutes
#     'pool_pre_ping': True 
# }
# app.config['SQLALCHEMY_DATABASE_URI'] =os.getenv("DATABASE_URL")
# db.init_app(app)
init_db()

@app.on_event("startup")
async def startup_event():
    # Database is already initialized, no need for await init_db() here
    print("FastAPI app started!")  # Add a print statement to confirm
    pass #remove  await init_db()


@app.get("/")
async def home():
    return "backend is running"

@app.post("/businnesdata/{uids}/{no}")
async def add_business(uids: str, no: str, data: Request, db: Session = Depends(get_db)):
    # Assuming data is in JSON format, use await data.json() to parse it asynchronously
    data = await data.json()
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
            no_business=no,
        )
        db.add(new_business)
        db.commit()
        return {"message": "Business data added successfully", "uid": uids}
    except Exception as e:
        db.rollback()
        print(f"Error adding business: {e}")
        raise HTTPException(status_code=500, detail="Error adding business")


@app.get("/tax_minimalization/{uid}/{no}")
async def tax_plan(uid: str, no: str, db: Session = Depends(get_db)):
    business = db.query(Business).filter_by(uid=uid, no_business=no).first()
    if business:
        business_data = business.to_dict()
        tax_plan =await tax_minimalization(business_data, uid)  # Pass uid to llmmodel
        if tax_plan:
            return tax_plan  # Return tax plan as JSON
        else:
            raise HTTPException(status_code=500, detail="Error generating tax plan")
    else:
        raise HTTPException(status_code=404, detail="Business not found")
    
@app.post("/tax_minimalization/{uid}/{no}")
async def s_tax_plan(uid: str, no: str, tax_plan_data: dict, db: Session = Depends(get_db)):
    business = db.query(Business).filter_by(uid=uid, no_business=no).first()
    if business:
        business_data = business.to_dict()
        Business_no=business_data["id"]
    try:
        existing_tax_plan = db.query(TaxPlan).filter_by(supabase_uid=uid, business_id=Business_no).first()
        if existing_tax_plan:
            if existing_tax_plan.sec_taxplan:
                return {"message": "Tax plan already exists for this business."}
            else:
                existing_tax_plan.sec_taxplan = json.dumps(tax_plan_data)
                db.commit()
                return {"message": "Tax plan updated successfully"}
        else:
            new_tax_plan = TaxPlan(
                supabase_uid=uid,
                business_id=Business_no,
                sec_taxplan=json.dumps(tax_plan_data)
            )
            db.add(new_tax_plan)
            db.commit()
            return {"message": "Tax plan added successfully"}
    except Exception as e:
        db.rollback()
        print(f"Error adding tax plan: {e}")
        raise HTTPException(status_code=500, detail=f"Error adding tax plan: {e}")

@app.get("/get_tax_plan/{supabase_uid}/{no}")
async def get_tax_plan(supabase_uid: str, no: int, db: Session = Depends(get_db)):
    business = db.query(Business).filter_by(uid=supabase_uid, no_business=no).first()
    if business:
        business_data = business.to_dict()
        Business_no=business_data["id"]
    try:
        tax_plan = db.query(TaxPlan).filter_by(supabase_uid=supabase_uid, business_id=Business_no).first()
        if tax_plan:
            tax_plan_data = tax_plan.to_dict()
            if "sec_taxplan" in tax_plan_data and tax_plan_data["sec_taxplan"] is not None:
                return {"sec_taxplan": tax_plan_data["sec_taxplan"]}
            else:
                return {"message": "sec_taxplan not found for this business"}
        else:
            return {"message": "Tax plan not found"}
    except Exception as e:
        print(f"Error retrieving tax plan: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving tax plan")
    

@app.get("/businessstructure/{uid}/{no}")
async def get_businessstructure_doc(uid: str, no: int, db: Session = Depends(get_db)):
    business = db.query(Business).filter_by(uid=uid, no_business=no).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    id = business.id
    business_data=business.to_dict()
    try:
        existing_progress = db.query(BusinessProgress).filter_by(business_id=id).first()
        if existing_progress:
            print(existing_progress)
            business_structure = json.loads(existing_progress.progress)["businessstructure"]
            return business_structure
        else:
            try:
                taxplan = db.query(TaxPlan).filter_by(business_id=id).first()
                print(tax_plan)
                taxset=taxplan.to_dict()
                sec_taxplan=taxset["sec_taxplan"]
            except Exception as e:
                print("sec_plan is on error",e)
            guild_plan=await business_guild(business_data,sec_taxplan,id)
            
            guild_db = BusinessProgress(
            business_id=id,
            progress=json.dumps(guild_plan)
            )
            db.add(guild_db)
            db.commit()
            return guild_plan["businessstructure"] #Return business data if no progress is found

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")
    
@app.get("/legalcompliance&licensingdocuments/{uid}/{no}")
async def get_legalcompliancelicensingdocuments(uid: str, no: int, db: Session = Depends(get_db)):
    business = db.query(Business).filter_by(uid=uid, no_business=no).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")

    id = business.id
    try:
        existing_progress = db.query(BusinessProgress).filter_by(business_id=id).first()
        if existing_progress:
            business_structure = json.loads(existing_progress.progress)["legal compliance &licensing documents"]
            return business_structure
        else:
            return {"message": "No legal compliance documents found"} # Return informative message instead of error

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")

@app.get("/tax&financedocuments/{uid}/{no}")
async def get_taxfinancedocuments(uid:str, no: int, db: Session = Depends(get_db)):
    business = db.query(Business).filter_by(uid=uid, no_business=no).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")

    id = business.id
    try:
        existing_progress = db.query(BusinessProgress).filter_by(business_id=id).first()
        if existing_progress:
            business_structure = json.loads(existing_progress.progress)["tax & finance documents"]
            return business_structure
        else:
            return {"message": "No tax & finance documents found"}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")

@app.get("/employeerelateddocuments/{uid}/{no}")
async def get_employeerelateddocuments(uid: str, no: int, db: Session = Depends(get_db)):
    business = db.query(Business).filter_by(uid=uid, no_business=no).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")

    id = business.id
    try:
        existing_progress = db.query(BusinessProgress).filter_by(business_id=id).first()
        if existing_progress:
            business_structure = json.loads(existing_progress.progress)["employee related documents(if hiring)"]
            return business_structure
        else:
            return {"message": "No employee related documents found"}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")


@app.get("/optionalbrandingipdocuments/{uid}/{no}")
async def getoptionalbrandingipdocuments(uid: str, no: int, db: Session = Depends(get_db)):
    business = db.query(Business).filter_by(uid=uid, no_business=no).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")

    id = business.id
    try:
        existing_progress = db.query(BusinessProgress).filter_by(business_id=id).first()
        if existing_progress:
            business_structure = json.loads(existing_progress.progress)["optional branding/ip documents"]
            return business_structure
        else:
            return {"message": "No optional branding/IP documents found"}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")



#flask code
# @app.route("/legalcompliance&licensingdocuments/<string:uid>/<int:no>")
# def get_legalcompliancelicensingdocuments(uid,no):
#     business = Business.query.filter_by(uid=uid, no_business=no).first()
#     if not business:
#         return jsonify({"error": "Business not found"}), 404
        
#     id = business.id 
#     try:
#         existing_progress = BusinessProgress.query.filter_by(business_id=id).first()
#         if existing_progress:
#             #Update existing record if it exists
#             business_structure = json.loads(existing_progress.progress)["legal compliance &licensing documents"]
            
#             return jsonify(business_structure), 200
#     except Exception as e:
#         print(f"Error: {e}")
#         return jsonify({"error": "An unexpected error occurred"}), 500

# @app.route("/tax&financedocuments/<string:uid>/<int:no>")
# def  get_taxfinancedocuments(uid,no):
#     business = Business.query.filter_by(uid=uid, no_business=no).first()
#     if not business:
#         return jsonify({"error": "Business not found"}), 404
        
#     id = business.id
#     try:
#         existing_progress = BusinessProgress.query.filter_by(business_id=id).first()
#         if existing_progress:
#             #Update existing record if it exists
#             business_structure = json.loads(existing_progress.progress)[ "tax & finance documents"]
            
#             return jsonify(business_structure), 200
#     except Exception as e:
#         print(f"Error: {e}")
#         return jsonify({"error": "An unexpected error occurred"}), 500
    
# @app.route("/employeerelateddocuments/<string:uid>/<int:no>")
# def  get_employeerelateddocuments(uid,no):
#     business = Business.query.filter_by(uid=uid, no_business=no).first()
#     if not business:
#         return jsonify({"error": "Business not found"}), 404
        
#     id = business.id
#     try:
#         existing_progress = BusinessProgress.query.filter_by(business_id=id).first()
#         if existing_progress:
#             #Update existing record if it exists
#             business_structure = json.loads(existing_progress.progress)["employee related documents(if hiring)"]
            
#             return jsonify(business_structure), 200
#     except Exception as e:
#         print(f"Error: {e}")
#         return jsonify({"error": "An unexpected error occurred"}), 500
    
# @app.route("/optionalbrandingipdocuments/<string:uid>/<int:no>")
# def  getoptionalbrandingipdocuments(uid,id):
#     business = Business.query.filter_by(uid=uid, no_business=no).first()
#     if not business:
#         return jsonify({"error": "Business not found"}), 404
        
#     id = business.id
#     try:
#         existing_progress = BusinessProgress.query.filter_by(business_id=id).first()
#         if existing_progress:
#             #Update existing record if it exists
#             business_structure = json.loads(existing_progress.progress)["optional branding/ip documents"]
            
#             return jsonify(business_structure), 200
#     except Exception as e:
#         print(f"Error: {e}")
#         return jsonify({"error": "An unexpected error occurred"}), 500   
    

# if __name__ == "__main__":
#     init_db(app)
#     http_server = WSGIServer(('0.0.0.0', 8000), app)
#     http_server.serve_forever()