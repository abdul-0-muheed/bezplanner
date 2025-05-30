import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
from websearch import search
from webdetails import extract_from_url
from dbmodel import WebData,db,TaxPlan
load_dotenv()

# #setting the api 
# api_key= os.getenv("api_key")
# genai.configure(api_key=api_key)
# model = genai.GenerativeModel(os.getenv("model_name"))

def llm_response(prompt):
    import os
    import google.generativeai as genai
    from dotenv import load_dotenv
    load_dotenv()
    api_key = os.getenv("api_key")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(os.getenv("model_name"))
    response = model.generate_content(prompt)
    return response.text


def clean_json_response(response_text):
    """
    Removes markdown formatting from JSON responses.
    Specifically targets the ```json and ``` markers.
    """
    # Check if response starts with ```json or similar markdown indicator
    if response_text.strip().startswith("```"):
        # Find the first { which indicates the start of actual JSON
        json_start = response_text.find("{")
        if json_start != -1:
            # Find the last } which indicates the end of JSON
            json_end = response_text.rfind("}")
            if json_end != -1:
                # Extract just the JSON part
                return response_text[json_start:json_end+1]
    
    # If no markdown formatting detected or couldn't parse properly,
    # return the original text
    return response_text


def seach_quearymaker(business_data):
    prompt = f"""
    As a business and tax expert, generate 10 specific search queries to find information about tax minimization, 
    legal requirements, and documentation for the following business:

    Business Details:
    {business_data}

    Generate search queries in these categories:
    1. Tax Registration & Compliance
    2. Industry-Specific Permits
    3. Local Business Licenses
    4. Employment Documentation
    5. Tax Deductions & Credits

    Format your response as a simple JSON array of queries:
    {{
      "queries": [
        "tax registration requirements for [state] [business type]",
        "business permits needed in [city] for [industry]",
        // ... and so on for all 10 queries
      ]
    }}

    Make queries specific to the business location, type, and scale.
    Each query should be concise and focused on one aspect.
    Include the business location in relevant queries.
    
    Remember to replace [state], [city], [business type], and [industry] with the actual values from the business data.
    Ensure your response is valid JSON that can be parsed programmatically.
    """
    
    response = llm_response(prompt)
    res=clean_json_response(response)
    data = json.loads(res)
    
    return data

    

def tax_minimalization(business_data,uids):
    webdata = []
    try:
        business_id = int(business_data["id"])
    except (KeyError, ValueError):
        print("Error: 'id' key not found or not an integer in business_data")
        return None
    existing_web_data = WebData.query.filter_by(business_id=business_id,supabase_uid=uids).first()
    if not existing_web_data:
        try:
            data = seach_quearymaker(business_data)
            for query_data in data["queries"]:  #Use a more descriptive variable name
                results = search(query_data) #results now contains a list of links
                links = results.get("link", []) #Get list of links, default to empty list
                for url in links: #Iterate through each link in the list
                    if url:
                        extracted_data = extract_from_url(url)
                        if extracted_data:
                            webdata.append(extracted_data)
        except Exception as e:
            print(f"Error during web scraping or extraction: {e}")
            return None
        try:
            if webdata:     
                dataset = WebData(
                    business_id=business_id,
                    web_data=json.dumps(webdata),
                    supabase_uid=uids
                )
                db.session.add(dataset)
                db.session.commit()  # Commit the transaction if successful
                print(webdata)
            else:
                print("No webdata extracted, skipping DB insert.")    
               
        except Exception as e:  # Catch any database errors
            db.session.rollback()  # Rollback the transaction if an error occurred
            print(f"Database error: {e}")
            db.session.close()
            return None  #Return None to indicate failure
        #finally:
    else:
        # Use existing web data
        try:
            webdata = json.loads(existing_web_data.web_data)
        except Exception as e:
            print(f"Error loading existing web data: {e}")
            return None    
    try:
        prompt=f"""You are a legal and tax expert assistant. Based on the following business details and the provided web data, give a list of practical tax minimization strategies in simple bullet points.  Use information from your internal knowledge base supplemented by the web data for the most up-to-date information. Do not include any headings, descriptions, or titles.  Return the plan points in JSON format starting with `{{"taxplan": [` and ending with `}}`.
     
        Business Information:
        {business_data}
        Web Data:
        {webdata}
        Example JSON Output:
        {{"taxplan":[
        "idea1",
        "idea2",
        "idea3",
        // ... more bullet points]}}
        """
        taxset=llm_response(prompt)
        print(taxset,"**********")
        res=clean_json_response(taxset)
        try:
            print(res)
            taxplan = json.loads(res)["taxplan"]  # Extract taxplan from JSON response
        except (KeyError, json.JSONDecodeError) as e:
            print(f"Error parsing LLM response or key error: {e}")
            return None   
        try:    
            existing_tax_plan = TaxPlan.query.filter_by(business_id=business_id).first()
            
            # Insert tax plan into database
            if existing_tax_plan:
                return taxplan
            else:
                new_tax_plan = TaxPlan(
                    supabase_uid=uids,
                    business_id=business_id,
                    tax_plan=json.dumps(taxplan)  # Store as JSON string
                )
                db.session.add(new_tax_plan)
                db.session.commit()
                return taxplan #return taxplan data
        except Exception as e:
            db.session.rollback()
            print(f"Database error or other error: {e}")
            db.session.close()
            return None
    except Exception as e:
        print(f"LLM or tax plan generation error: {e}")
        return None

def business_guild(business,tax_plan,id):
    try:
        webdata_obj = WebData.query.filter_by(business_id=id).first()
        if webdata_obj is None:
            return {"error": f"No web data found for business_id: {id}"}

        webdata = webdata_obj.web_data
        prompt = f"""Generate a list of documents and the process to create them for starting a {business} business. Use real-time data from the following source: {webdata}, supplementing this with your internal knowledge base for a comprehensive response. Optimize the plan to align with the following tax plan: {tax_plan}.

        The response should be in the following JSON format:
        ```json
        {{
          "businessstructure": {{
              "documents": [
              {{"documenttitle": "document_title", "process": "process_description (including how to do it, where to submit it, and the relevant URL for submission)"}}
              ]
          }},
          "legal compliance &licensing documents": {{
              "documents": [
              {{"documenttitle": "document_title", "process": "process_description (including how to do it, where to submit it, and the relevant URL for submission)"}}
              ]
          }},
          "tax & finance documents": {{
              "documents": [
              {{"documenttitle": "document_title", "process": "process_description (including how to do it, where to submit it, and the relevant URL for submission)"}}
              ]
          }},
          "employee related documents(if hiring)": {{
              "documents": [
              {{"documenttitle": "document_title", "process": "process_description (including how to do it, where to submit it, and the relevant URL for submission)"}}
              ]
          }},
          "optional branding/ip documents": {{
              "documents": [
              {{"documenttitle": "document_title", "process": "process_description (including how to do it, where to submit it, and the relevant URL for submission)"}}
              ]
          }}
        }}
        ```

        Each document should include:

        1. The document title.
        2. A clear and concise description of the process to create the document, including how to do it, where to submit it, and the relevant URL for submission.
        3. No extra summaries—just the title and process description. Use plain English and avoid jargon.

        Please ensure the process description is concise and provides clear instructions. Prioritize information found in the provided web data for real-time accuracy, supplementing this with your internal knowledge base where necessary. Align the documents and processes with the tax plan specified in {tax_plan}.
        """

        response = llm_response(prompt)
        res = clean_json_response(response)
        try:
            data = json.loads(res)
            return data
        except json.JSONDecodeError as e:
            return {"error": f"Error decoding JSON response from LLM: {e}"}
    except Exception as e:
        return {"error": f"An unexpected error occurred: {e}"}

# business = "Restaurant"
# tax_plan = """
#     - Minimize income tax through deductions.
#     - Comply with all relevant tax regulations.
#     - Maintain accurate financial records.
# """
# business_id = 1  # Replace with an actual business ID from your database
# webdata_text = """reign entities conducting business there to register with the California Secretary of State and pay the franchise
# taxes. Employment Taxes and Withholding Requirements If you employ workers in California, you’re responsible for withholding and paying several types ofemployment taxes, including: State Income Tax Withholding (PIT):Withheld from employee wages based on state income tax brackets. Unemployment Insurance (UI):Paid by employers to fund state unemployment benefits. Employment Training Tax (ETT):Supports workforce training programs. State Disability Insurance (SDI):Typically withheld from employee wages. Employers must register with theEmployment Development Department (EDD)and report wages quarterly. Late or incorrect filings can lead to penalties, so it’s crucial to remain compliant with employment tax regulations. Corporate Entities: Taxed on Net Earnings or $800 A corporation is a legal entity separate and apart from its owner. The corporation is taxed like an individual. The tax rate in California is 8.84% for non-pass-through entities. For example, if a company has net earnings of $500,000, the franchise tax would be $44,200 paid to the California Franchise Tax Board. However, if you form a business under an LLC, LP, or LLP in California before December 31, 2023, thenyou do not have to pay the $800 minimum annual franchise taxfor the first taxable year. Before the new law, only corporations were exempt from the franchise tax in the first year after their registration with the state. This change removes an obstacle to the creation of small businesses. Regardless of whether your corporation is operating at a loss or fully active, it must still pay the franchise tax. Estimated Tax Payments and Filing Deadlines California requires small business owners—especially sole proprietors, partners, and S corporation shareholders—to makeestimated tax paymentsif they expect to owe more than $500 in taxes ($250 for individuals). These payments are typically due: April 15 June 15 September 15 January 15 (of the following year) Missing these deadlines can result in penalties and interest. Corporations must also make estimated payments based on their expected annual income, using Form 100-ES. Franchise Taxes and Pass-Through Entities In successful companies, after paying expenses and taxes, dividends are often paid to owners. This leads to double taxation,
# where the corporate shareholders are taxed at an individual level while the corporation’s earnings were already taxed at the corporate level. The California tax system applies pass-through taxation to limited partnerships, limited liability partnerships, and limited liability companies are taxed as partnerships. Limited liability companies
# (LLCs) Limited liability companies also pay the franchise tax. However, they are taxed at flat dollar amounts based on the LLC's annual gross income tiers. The level of taxation depends on the tier. For instance, a business generating a gross income between $50,000 and $99,999 pays $2,500. Small businesses still pay the minimum franchise tax of $850, even if their gross income is less than $250,000. Business owners must pay marginal taxes
# on their net income at rates ranging from 1% to 12.3% for an LLC. Partnerships Limited liability partnerships (LLPs) and limited partnerships (LP) have to pay franchise taxes of $800. Business owners must file individual tax returns for any income that passes through those partnerships. S Corporations An S corporation pays a lower tax rate of 1.5% on net corporate income instead of the corporate tax of 8.84% for traditional corporations, passing the profits to the business owners. California is unusual in that while it recognizes an S-corporation as a
# business organization, it doesn’t recognize an S-corporation as a pass-through business. S corporations in California have to pay a 1.5% franchise tax on net income, with a minimum threshold of $800. For example, 1.5% of an S corporation’s net income of $100,000, or $15,000, goes towards California state income tax. Further, any individual
# shareholder has to pay tax on their share of an S corporation's income for their personal tax returns, respectively. Tax Credits and Incentives for California Businesses California offers severaltax credits and deductionsto reduce small business tax liability. Key incentives include: New Employment Credit:Available to businesses hiring qualified full-time employees in designated geographic areas. California Competes Tax Credit (CCTC):A competitive tax credit for businesses that want to grow and remain in California. Disabled Access Credit:Helps small businesses cover expenses related to accessibility improvements. Research & Development Credit:Offsets the cost of qualified R&D activities conducted in the state. These credits can significantly reduce your overall tax burden but require proper documentation and timely application. Understanding business entities and taxes for small businesses While most corporations must pay the franchise tax, S corporations are not taxed the same way. You should explore the taxation system or hire an expert to determine which entity works best for your business. You can work with an accountant and a tax attorney to better understand how to operate your business best so that you’re not paying unnecessary taxes. Tax Filing and Compliance Tips for California Small Businesses To stay compliant and avoid audits or penalties, small business owners in California should: Register with all appropriate agencies(FTB, CDTFA, EDD). Keep
# meticulous financial recordsand retain documentation for at least four years. Separate personal and business financesto simplify reporting and reduce legal exposure. Use accounting softwareor work with a CPA to ensure accurate quarterly and annual filings. Understand industry-specific obligations, such as excise taxes for alcohol or fuel, or local business license fees. Frequently Asked Questions Do all California small businesses have to pay the $800
# franchise tax?Most do, but some new businesses are exempt in their first year, depending on their formation date and entity type. How do I register for sales tax in California?You must apply for a seller’s permit through the CDTFA before selling taxable goods or services. What happens if I miss an estimated tax payment?The FTB may assess penalties and interest on any late or underpaid estimated taxes. Are LLCs taxed differently from corporations in California?Yes. LLCs may be subject to both the franchise tax and an additional fee based on gross income, while corporations pay the corporate tax rate on net earnings. What payroll taxes do I need to withhold as an employer?You must withhold state income tax and SDI from employee wages and pay UI and ETT as an employer. If you need help with understanding small business taxes in California, you canpost your legal needon UpCounsel’s marketplace. UpCounsel accepts only the top 5 percent of lawyers to its site. Lawyers on UpCounsel come from law schools such as Harvard Law and Yale Law and average 14 years of legal experience, including work with or on behalf of companies like Google, Menlo Ventures, and Airbnb. Dean Sage UpCounsel has successfully supported over 10853 clients in navigating
# Business Formation,\nconnecting them with a network of 925 specialized Business Formation lawyers ready
# to assist you every day.\nWith4435client reviews,\nyou can confidently find the right lawyer to meet your needs.\nClients have consistently rated our lawyers highly for their expertise in Business Formation,\nreflecting a strong overall satisfaction score of 4.9. Sale of Business Sale of Corporation What Does Sale of Assets Mean Tax Implications of an LLC Selling S Corp Stock Transfer of Ownership Contract Template California Corporate Tax Return Instructions $800 Minimum Franchise Tax Corporate Franchise Tax California Corporate Tax Rate California LLC Tax First Year California LLC Tax Rate California LLC Fee Nevada Corporation Doing Business in California Texas Corporate Tax"""# Replace with actual web data

# business_guild(business, tax_plan, webdata_text)  