import openai
import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

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


def make_chat_completion_request(prompt: str):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt},
        ],
    )
    return response.choices[0].message.content

def explain(highlight: str, prompt: str):
    response = make_chat_completion_request(
        f"""Purpose: {prompt}
Highlight: {highlight}
Can you explain why this highlight is relevant for my purpose.
Give a concise reason in 1 or 2 sentences.
Let's think step by step.
Reason:"""
    )
    return response

class Highlight(BaseModel):
    order_number: int
    start_time: int
    end_time: int
    highlight: str
    reason_for_highlight: str
    question: str

class VideoHighlightResponse(BaseModel):
    highlights: List[Highlight]

@app.post("/videoHighlight", response_model=VideoHighlightResponse)
def highlight_video(video: VideoHighlight):
    """
    For a given video URL, returns a list of highlights
    """
    # hardcoded response for video demo
    # TODO: Make objective relevant for each
    # if video.objective == "learn":
    response = VideoHighlightResponse(
        highlights=[
            Highlight(
                order_number=1,
                start_time=840,
                end_time=1065,
                highlight="The span of any set of vectors is a valid subspace",
                reason_for_highlight="The video explains that the span of any set of vectors is a valid subspace, using examples and mathematical explanations.",
                question="What makes the span of any set of vectors a valid subspace?"
            ),
            Highlight(
                order_number=2,
                start_time=1230,
                end_time=1350,
                highlight="The span of one vector is not always a valid subspace",
                reason_for_highlight="The video demonstrates that the span of one vector is not always a valid subspace, using visuals and mathematical explanations.",
                question="Under what conditions would the span of one vector not be a valid subspace?"
            ),
            Highlight(
                order_number=3,
                start_time=450,
                end_time=465,
                highlight="The zero vector is always contained in a subspace",
                reason_for_highlight="The video explains that the zero vector is always contained in a subspace, regardless of the vector set.",
                question="Why is the zero vector always contained in a subspace?"
            )
        ]
    )
    return response
