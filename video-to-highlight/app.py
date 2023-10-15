from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

