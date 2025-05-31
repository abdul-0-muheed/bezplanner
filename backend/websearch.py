import asyncio
import aiohttp
from bs4 import BeautifulSoup

#fastapi code

async def search(query):
    url = "https://html.duckduckgo.com/html/"
    headers = {'User-Agent': 'Mozilla/5.0'}
    data = {'q': query}

    async with aiohttp.ClientSession() as session:
        async with session.post(url, headers=headers, data=data) as response:
            response.raise_for_status()
            text = await response.text()
            soup = BeautifulSoup(text, 'html.parser')

            results = []
            for result in soup.find_all('a', {'class': 'result__a'}, limit=3):
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
                links = [result["link"] for result in results if "link" in result]  # Safely access "link"
                links = [result.get("link", "") for result in results]
                return {"link": links}
            else:
                return {"link": []}


#flask code base 
# def search(query):
#     url = "https://html.duckduckgo.com/html/"
#     headers = {'User-Agent': 'Mozilla/5.0'}
#     data = {'q': query}
    
#     response = requests.post(url, headers=headers, data=data)
#     soup = BeautifulSoup(response.text, 'html.parser')

#     results = []
#     for result in soup.find_all('a', {'class': 'result__a'}, limit=3):
#         title = result.get_text()
#         link = result['href']
#         snippet_tag = result.find_parent('div', class_='result__body')
#         snippet = snippet_tag.get_text(strip=True) if snippet_tag else ""
#         results.append({
#             'title': title,
#             'link': link,
#             'snippet': snippet
#         })
#     if results:
#         links = [result.get("link", "") for result in results] 
#         # print(links) #Safely extract link if it exists
#         return {"link": links}
#     else:
#         return {"link": []}
