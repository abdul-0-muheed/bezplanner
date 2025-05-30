import requests
from concurrent.futures import ThreadPoolExecutor

URL = "http://127.0.0.1:5000/tax_minimalization/1/0"  # Change to your endpoint

def hit():
    try:
        r = requests.get(URL)
        print(r.status_code, r.text[:100])
    except Exception as e:
        print("Error:", e)

with ThreadPoolExecutor(max_workers=30) as executor:
    for _ in range(30):
        executor.submit(hit)