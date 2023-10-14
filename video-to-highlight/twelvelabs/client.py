import requests
import os
from dotenv import load_dotenv

load_dotenv()

class Client:
    def __init__(self, api_url: str):
        self.api_url = api_url
        self.headers = {
            "x-api-key": os.getenv('TWELVE_LABS_API_KEY')
        }


    def highlight(self, video_id: str, type: str="highlight"):
        url = f"{self.api_url}/summarize"
        data = {
            "video_id": video_id,
            "type": type
        }
        response = requests.post(url, 
                                 headers=self.headers, json=data)
        return response.json()
