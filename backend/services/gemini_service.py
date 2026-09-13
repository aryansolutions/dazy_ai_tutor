import logging

from google import genai
from google.genai import types

from config import settings
from prompts import (
    SYSTEM_PROMPT,
    build_chat_prompt,
)

logger = logging.getLogger("dazy.gemini")

client = genai.Client(
    api_key=settings.gemini_api_key
)


def generate_tutor_response(
    student_name,
    course,
    year,
    subject,
    history,
    message,
):
    prompt = build_chat_prompt(
        student_name=student_name,
        course=course,
        year=year,
        subject=subject,
        history=history,
        message=message,
    )

    try:
        response = client.models.generate_content(
            model=settings.chat_model,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                temperature=0.4,
                max_output_tokens=1800,
            ),
        )

    except Exception as error:
        logger.exception("Gemini request failed.")

        raise RuntimeError(
            "Dazy's AI service is temporarily unavailable."
        ) from error

    text = (
        response.text.strip()
        if response.text
        else ""
    )

    if not text:
        raise RuntimeError(
            "Dazy received an empty AI response."
        )

    return text