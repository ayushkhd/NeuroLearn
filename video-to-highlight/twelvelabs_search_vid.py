import os
from dotenv import load_dotenv
import requests
import glob
from pprint import pprint

load_dotenv()

API_KEY = os.getenv("API_KEY")
API_URL = os.getenv("API_URL")

INDEX_ID = "6529cbc81079b89aaa8fe0d9"

SEARCH_URL = f"{API_URL}/search"

headers = {"x-api-key": API_KEY}

data = {
    "query": "winner of the whole event. best gamer in the world",
    "index_id": INDEX_ID,
    "search_options": ["visual", "conversation"],
    "operator": "or",
}

response = requests.post(SEARCH_URL, headers=headers, json=data)
print(f"Status code: {response.status_code}")
pprint(response.json())
