from .langchain_helper.helper import get_response_from_query
import openai
import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from .twelvelabs.client import *

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
    mock: bool = True

def make_chat_completion_request(prompt: str):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a reasoning expert."},
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
    questions: list

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
    if video.mock:
        response = VideoHighlightResponse(
            highlights=[
                Highlight(
                    order_number=1,
                    start_time=840,
                    end_time=1065,
                    highlight="The span of any set of vectors is a valid subspace",
                    reason_for_highlight="The video explains that the span of any set of vectors is a valid subspace, using examples and mathematical explanations.",
                    questions=["What makes the span of any set of vectors a valid subspace?"]
                ),
                Highlight(
                    order_number=2,
                    start_time=1230,
                    end_time=1350,
                    highlight="The span of one vector is not always a valid subspace",
                    reason_for_highlight="The video demonstrates that the span of one vector is not always a valid subspace, using visuals and mathematical explanations.",
                    questions=["Under what conditions would the span of one vector not be a valid subspace?"]
                ),
                Highlight(
                    order_number=3,
                    start_time=450,
                    end_time=465,
                    highlight="The zero vector is always contained in a subspace",
                    reason_for_highlight="The video explains that the zero vector is always contained in a subspace, regardless of the vector set.",
                    questions=["Why is the zero vector always contained in a subspace?"]
                )
            ]
        )
        return response
    else:
        client = Client()
        body = HighlightVideoBody(**{
            "video_id": video.videoToHighlight,
            "type": "highlight",
            "prompt": video.objective
        })
        response: HighlightVideoResponse = client.highlight_video(body)
        highlights = []
        for i, h in enumerate(response.highlights):
            explained_reason = client.explain_highlights([h], body.prompt)[0].highlight_summary
            question = make_chat_completion_request(
                f"""Based on the given summary {h.highlight}, can you please give me a question? Only return the question. Question:"""
            )
            highlights.append(
                Highlight(
                    order_number=i,
                    start_time=h.start,
                    end_time=h.end,
                    highlight=h.highlight,
                    reason_for_highlight=explained_reason,
                    questions=[question]
                )
            )
        return VideoHighlightResponse(highlights=highlights)

class ChatQueryRequest(BaseModel):
    query: str


@app.post("/chatQuery/")
def generate_response(request_body: ChatQueryRequest):
    # Here, you can process the query and generate a response.
    # For simplicity, I'll just return the query as the response.
    query = request_body.query
    response = get_response_from_query(query)
    return {"response": response}