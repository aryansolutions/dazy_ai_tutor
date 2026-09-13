from uuid import UUID

from config import settings
from database import get_connection


def upsert_session(
    session_id: UUID,
    student_name: str,
    course: str,
    year: str,
    subject: str,
):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO dazy_sessions (
                    session_id,
                    student_name,
                    course,
                    year_stage,
                    subject,
                    adult_confirmed
                )
                VALUES (
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    TRUE
                )

                ON CONFLICT (session_id)

                DO UPDATE SET
                    student_name = EXCLUDED.student_name,
                    course = EXCLUDED.course,
                    year_stage = EXCLUDED.year_stage,
                    subject = EXCLUDED.subject,
                    adult_confirmed = TRUE,
                    updated_at = NOW();
                """,
                (
                    session_id,
                    student_name,
                    course,
                    year,
                    subject,
                ),
            )


def get_recent_messages(
    session_id: UUID,
):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    role,
                    content

                FROM (
                    SELECT
                        id,
                        role,
                        content

                    FROM dazy_messages

                    WHERE session_id = %s

                    ORDER BY id DESC

                    LIMIT %s
                ) AS recent_messages

                ORDER BY id ASC;
                """,
                (
                    session_id,
                    settings.memory_messages,
                ),
            )

            return cursor.fetchall()


def save_turn(
    session_id: UUID,
    user_message: str,
    assistant_message: str,
    emotion: str,
):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO dazy_messages (
                    session_id,
                    role,
                    content
                )
                VALUES (
                    %s,
                    'user',
                    %s
                );
                """,
                (
                    session_id,
                    user_message,
                ),
            )

            cursor.execute(
                """
                INSERT INTO dazy_messages (
                    session_id,
                    role,
                    content,
                    emotion
                )
                VALUES (
                    %s,
                    'assistant',
                    %s,
                    %s
                );
                """,
                (
                    session_id,
                    assistant_message,
                    emotion,
                ),
            )

            cursor.execute(
                """
                UPDATE dazy_sessions

                SET updated_at = NOW()

                WHERE session_id = %s;
                """,
                (
                    session_id,
                ),
            )