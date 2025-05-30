from bs4 import BeautifulSoup
from pdfminer.high_level import extract_text
from urllib.parse import urlparse
import requests
import os
import httpx
import aiofiles
import asyncio


def is_pdf_url(url):
    return url.lower().endswith(".pdf")
    
async def download_pdf(url, filename):
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        async with aiofiles.open(filename, "wb") as f:
            await f.write(response.content)
    return filename
    
def extract_text_from_pdf(pdf_path):
    return extract_text(pdf_path)
    
async def extract_text_from_web(url):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
            
            # Remove unwanted elements
        for element in soup.find_all(['nav', 'header', 'footer', 'script', 'style']):
            element.decompose()
            
            # Try to find the main content
        main_content = None
            
            # Common content selectors - adjust based on the website
        content_selectors = [
            'article',
            '.post-content',
            '.entry-content',
            '.article-content',
            '.blog-content',
            'main',
            '#content'
        ]
            
        for selector in content_selectors:
            content = soup.select_one(selector)
            if content:
                main_content = content
                break
            
        if main_content:
                # Get text from main content
            text = ' '.join([p.get_text(strip=True) for p in main_content.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li'])])
        else:
                # Fallback to getting all paragraph text
            text = ' '.join([p.get_text(strip=True) for p in soup.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li'])])
            
        return text.strip()
            
    except Exception as e:
        print(f"Error extracting text from web: {e}")
        return None

async def extract_from_url(url):
    try:
        print(f"Processing: {url}")
        if is_pdf_url(url):
            filename = os.path.basename(urlparse(url).path)
            pdf_path = await download_pdf(url, filename)
            loop = asyncio.get_event_loop()
            text = await loop.run_in_executor(None, extract_text_from_pdf, pdf_path)
            os.remove(pdf_path)
            return text
        else:
            return await extract_text_from_web(url)
    except Exception as e:
        print(f"Failed to process {url}: {e}")
        return None
    
  