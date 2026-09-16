from typing import Literal
from uuid import UUID

from pydantic import (
    BaseModel,
    Field,
    field_validator,
)


StudyMode = Literal[
    "Teach",
    "Quiz",
    "Interview",
    "Revision",
    "Exam Sprint",
]


class ChatRequest(BaseModel):

    student_name: str = Field(
        min_length=2,
        max_length=80,
    )

    course: str = Field(
        min_length=2,
        max_length=160,
    )

    year: str = Field(
        min_length=1,
        max_length=60,
    )

    subject: str = Field(
        default="",
        max_length=160,
    )

    study_mode: StudyMode = "Teach"

    message: str = Field(
        min_length=1,
        max_length=4000,
    )

    session_id: UUID

    adult_confirmed: bool

    @field_validator(
        "student_name",
        "course",
        "year",
        "subject",
        "message",
    )
    @classmethod
    def clean_text(
        cls,
        value: str,
    ):
        return value.strip()


class ChatResponse(BaseModel):

    response: str

    emotion: Literal[
        "explaining",
        "thinking",
        "encouraging",
    ]

    session_id: UUID