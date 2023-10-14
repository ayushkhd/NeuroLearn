import os
import time
from dotenv import load_dotenv
import requests
import glob
from pprint import pprint

load_dotenv()

API_KEY = os.getenv('API_KEY')
API_URL = os.getenv('API_URL')

INDEX_ID = '6529cbc81079b89aaa8fe0d9'

TASKS_URL = f"{API_URL}/tasks"

file_name = "a.webm"
file_path = "./a.webm"
file_stream = open(file_path, 'rb')

headers = {
    "x-api-key": API_KEY
}

data = {
    "index_id": INDEX_ID, 
    "language": "en"
}

file_param=[
    ("video_file", (file_name, file_stream, "application/octet-stream")),]


#change this later to fetch from a url instead
response = requests.post(TASKS_URL, headers=headers, data=data, files=file_param)
TASK_ID = response.json().get("_id")
print (f"Status code: {response.status_code}")
pprint (response.json())

#you need this while loop, to do the video id call
TASK_STATUS_URL = f"{API_URL}/tasks/{TASK_ID}"
while True:
    response = requests.get(TASK_STATUS_URL, headers=headers)
    STATUS = response.json().get("status")
    if STATUS == "ready":
        break
    time.sleep(10)
    
VIDEO_ID = response.json().get('video_id')
print (f"Status code: {STATUS}")
print(f"VIDEO ID: {VIDEO_ID}")
pprint (response.json())