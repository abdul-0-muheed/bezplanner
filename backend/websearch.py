import requests
from bs4 import BeautifulSoup

def search(query):
    url = "https://html.duckduckgo.com/html/"
    headers = {'User-Agent': 'Mozilla/5.0'}
    data = {'q': query}
    
    response = requests.post(url, headers=headers, data=data)
    soup = BeautifulSoup(response.text, 'html.parser')

    results = []
    for result in soup.find_all('a', {'class': 'result__a'}, limit=10):
        title = result.get_text()
        link = result['href']
        snippet_tag = result.find_parent('div', class_='result__body')
        snippet = snippet_tag.get_text(strip=True) if snippet_tag else ""
        results.append({
            'title': title,
            'link': link,
            'snippet': snippet
        })
    if results:
        links = [result.get("link", "") for result in results]  #Safely extract link if it exists
        return {"link": links}
    else:
        return {"link": []}
