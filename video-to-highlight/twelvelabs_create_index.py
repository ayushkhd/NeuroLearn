import os
from dotenv import load_dotenv
import requests
from pprint import pprint

load_dotenv()

API_KEY = os.getenv('API_KEY')
API_URL = os.getenv('API_URL')

url = f"{API_URL}/indexes"

INDEX_NAME = "test_index"

headers = {
	"x-api-key": API_KEY
}

data = {
  "engine_id": "marengo2.5",
  "index_options": ["visual", "conversation", "text_in_video", "logo"],
  "index_name": INDEX_NAME,
}

response = requests.post(url, headers=headers, json=data)
INDEX_ID = response.json().get('_id')

print (f'Status code: {response.status_code}')
pprint (response.json())
