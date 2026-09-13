import logging

from fastapi import (
    APIRouter,
    HTTPException,
    status
)

from schemas import (
    ChatRequest,
    ChatResponse
)

from services.gemini_service import (
    generate_tutor_response
)

from services.memory_service import (
    upsert_session,
    get_recent_messages,
    save_turn
)


logger = logging.getLogger(
    "dazy.chat"
)


router = APIRouter(
    tags=["Dazy"]
)


def detect_emotion(
    message: str
):

    text = message.lower()


    encouraging_phrases = (
        "quiz me",
        "interview me",
        "test me",
        "i understand",
        "i got it"
    )


    thinking_phrases = (
        "why",
        "how",
        "calculate",
        "derive",
        "solve",
        "compare",
        "difference"
    )


    if any(
        phrase in text
        for phrase in encouraging_phrases
    ):

        return "encouraging"


    if any(
        phrase in text
        for phrase in thinking_phrases
    ):

        return "thinking"


    return "explaining"


@router.post(
    "/chat",
    response_model=ChatResponse
)
def chat(
    request: ChatRequest
):

    if not request.adult_confirmed:

        raise HTTPException(

            status_code=
                status.HTTP_403_FORBIDDEN,

            detail=(
                "Dazy is currently available "
                "only to users aged 18 or older."
            )
        )


    try:

        upsert_session(

            session_id=
                request.session_id,

            student_name=
                request.student_name,

            course=
                request.course,

            year=
                request.year,

            subject=
                request.subject
        )


        history = (
            get_recent_messages(
                request.session_id
            )
        )


        answer = (
            generate_tutor_response(

                student_name=
                    request.student_name,

                course=
                    request.course,

                year=
                    request.year,

                subject=
                    request.subject,

                history=
                    history,

                message=
                    request.message
            )
        )


        emotion = (
            detect_emotion(
                request.message
            )
        )


        save_turn(

            session_id=
                request.session_id,

            user_message=
                request.message,

            assistant_message=
                answer,

            emotion=
                emotion
        )


        return ChatResponse(

            response=
                answer,

            emotion=
                emotion,

            session_id=
                request.session_id
        )


    except RuntimeError as error:

        raise HTTPException(

            status_code=
                status.HTTP_503_SERVICE_UNAVAILABLE,

            detail=
                str(error)
        )


    except HTTPException:

        raise


    except Exception:

        logger.exception(
            "Unexpected Dazy chat error"
        )


        raise HTTPException(

            status_code=
                status.HTTP_500_INTERNAL_SERVER_ERROR,

            detail=(
                "Something went wrong while "
                "processing your message."
            )
        )