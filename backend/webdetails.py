from bs4 import BeautifulSoup
from pdfminer.high_level import extract_text
from urllib.parse import urlparse
import requests
import os
import multiprocessing
from concurrent.futures import ThreadPoolExecutor
import logging
import asyncio
import aiohttp


# Configure logging at the top of the file
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def is_pdf_url(url):
    return url.lower().endswith(".pdf")
    
async def download_pdf(url, filename):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            with open(filename, "wb") as f:
                f.write(await response.read())
    return filename
    
async def extract_text_from_pdf(pdf_path):
    loop = asyncio.get_running_loop()
    with ThreadPoolExecutor() as pool:
        text = await loop.run_in_executor(pool, extract_text, pdf_path)
    return text
    
async def extract_text_from_web(url):
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                text = await response.text()
                soup = BeautifulSoup(text, 'html.parser')
            
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

async def process_url(url):
    try:
        print(f"Processing: {url}")
        if is_pdf_url(url):
            filename = os.path.basename(urlparse(url).path)
            pdf_path = await download_pdf(url, filename)
            text = await extract_text_from_pdf(pdf_path)
            os.remove(pdf_path)
            return text
        else:
            return await extract_text_from_web(url)
    except Exception as e:
        print(f"Failed to process {url}: {e}")
        return None
    
async def extract_from_url(urls):
    #add a quaue
    # Configure logging
    logging.basicConfig(level=logging.INFO,
                       format='%(asctime)s - %(levelname)s - %(message)s')
    # Handle single URL input
    if isinstance(urls, str):
        urls = [urls]

    if not urls:
        return []
    
    results = await asyncio.gather(*(process_url(url) for url in urls))
    return [r for r in results if r is not None]

    #flask code
    # # Configure parallel processing parameters
    # cpu_count = multiprocessing.cpu_count()
    # max_processes = min(1000, len(urls))
    # chunk_size = max(1, len(urls) // (cpu_count * 4))    

    # try:
    #     with multiprocessing.Pool(processes=min(cpu_count * 2, max_processes)) as process_pool:
    #         with ThreadPoolExecutor(max_workers=max_processes) as thread_pool:
    #             # Process URLs in parallel
    #             results = list(process_pool.imap_unordered(
    #                 process_url,
    #                 urls,
    #                 chunksize=chunk_size
    #             ))
                
    #             return [r for r in results if r is not None]
                
    # except Exception as e:
    #     logging.error(f"Parallel processing failed: {e}")
    #     return []