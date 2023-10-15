import openai
import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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

@app.post("/videoHighlight")
def highlight_video(video: VideoHighlight):
    """
    For a given video URL, returns a list of highlights
    """
    # response for demo purposes
    response = {
        "highlights": [
            {
                "order_number": 1,
                "start_time": 840,
                "end_time": 1065,
                "highlight": "The span of any set of vectors is a valid subspace",
                "reason_for_highlight": "The video explains that the span of any set of vectors is a valid subspace, using examples and mathematical explanations."
            },
            {
                "order_number": 2,
                "start_time": 1230,
                "end_time": 1350,
                "highlight": "The span of one vector is not always a valid subspace",
                "reason_for_highlight": "The video demonstrates that the span of one vector is not always a valid subspace, using visuals and mathematical explanations."
            },
            {
                "order_number": 3,
                "start_time": 450,
                "end_time": 465,
                "highlight": "The zero vector is always contained in a subspace",
                "reason_for_highlight": "The video explains that the zero vector is always contained in a subspace, regardless of the vector set."
            }
        ]
    }
    return response
