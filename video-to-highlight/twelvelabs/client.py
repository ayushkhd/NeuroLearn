import requests
import os
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from typing import List

load_dotenv()


class Highlight(BaseModel):
    start: int
    end: int
    highlight: str
    highlight_summary: str


class HighlightVideoResponse(BaseModel):
    id: str
    highlights: List[Highlight]


class HighlightVideoBody(BaseModel):
    video_id: str
    prompt: str
    type: str = "highlight"


class Client:
    def __init__(self):
        self.api_url = os.getenv("TWELVE_LABS_BASE_URL")
        self.headers = {"x-api-key": os.getenv("TWELVE_LABS_API_KEY")}

    def index_youtube_video(self, index_id: str, youtube_url: str):
        task_url = f"{self.api_url}/tasks/external-provider"
        data = {
            "index_id": index_id,
            "url": youtube_url,
        }
        response = requests.post(task_url, headers=self.headers, json=data)
        # you can get the video ID from video_id
        return response.json()

    def highlight_video(self, body: HighlightVideoBody) -> HighlightVideoResponse:
        url = f"{self.api_url}/summarize"
        data = body.dict()
        response = requests.post(url, headers=self.headers, json=data)
        return HighlightVideoResponse(**response.json())
