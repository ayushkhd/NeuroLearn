from fastapi import FastAPI
from pydantic import BaseModel
from twelvelabs.client import Client

app = FastAPI()


class VideoHighlight(BaseModel):
    videoToHighlight: str
    objective: str


@app.post("/videoHighlight")
def highlight_video(video: VideoHighlight):
    """
    For a given video URL, returns a list of highlights
    """
    return {
        "highlights": [
            {
                "order_number": 1,
                "start_time": "00:00:10",
                "end_time": "00:00:20",
                "reason_for_highlight": "Interesting conversation",
            }
        ]
    }
