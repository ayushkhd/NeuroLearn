# Video To Highlight

## Video to Highlights API

Get personalised video highlights explaining why it's important or useful.

```
POST /videoHighlight
{
    "videoToHighlight": "https://www.youtube.com/watch?v=QVKj3LADCnA&list=PL49CF3715CB9EF31D",
    "objective": "I want to build a project on video search. My background is a Javascript developer.",
}

Response:
{
    "highlights": [
        {
            "order_number": 1,
            "start_time": "",
            "end_time": "",
            "reason_for_highlight": ""
        },

    ],
}
```

```
POST /chatQuery
{
    "query": "What does CSS mean ?",
}

Response:
{
    "response": "CSS stands for \"Cascading Style Sheets.\" It's a fundamental technology used in web development to define the visual presentation of a web page written in HTML or XML. CSS is used to specify how elements on a web page should be styled, including aspects like layout, colors, fonts, and spacing. By separating the content (HTML) from its presentation (CSS), web developers can create attractive and consistent web designs while maintaining a clear structure and readability in the underlying code. It's an essential part of modern web design and is used to control the look and feel of websites."

}
```
