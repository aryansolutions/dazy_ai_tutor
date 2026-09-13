from contextlib import contextmanager
import logging

import psycopg
from psycopg.rows import dict_row

from config import settings


logger = logging.getLogger(
    "dazy.database"
)


@contextmanager
def get_connection():

    conn = psycopg.connect(
        settings.database_url,
        row_factory=dict_row,
        connect_timeout=10
    )

    try:

        yield conn

        conn.commit()

    except Exception:

        conn.rollback()

        raise

    finally:

        conn.close()


def create_tables():

    with get_connection() as conn:

        with conn.cursor() as cursor:

            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS dazy_sessions (

                    session_id UUID PRIMARY KEY,

                    student_name VARCHAR(80)
                        NOT NULL,

                    course VARCHAR(160)
                        NOT NULL,

                    year_stage VARCHAR(60)
                        NOT NULL,

                    subject VARCHAR(160)
                        NOT NULL DEFAULT '',

                    adult_confirmed BOOLEAN
                        NOT NULL DEFAULT TRUE,

                    created_at TIMESTAMPTZ
                        NOT NULL DEFAULT NOW(),

                    updated_at TIMESTAMPTZ
                        NOT NULL DEFAULT NOW()

                );
                """
            )

            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS dazy_messages (

                    id BIGSERIAL PRIMARY KEY,

                    session_id UUID
                        NOT NULL
                        REFERENCES dazy_sessions(session_id)
                        ON DELETE CASCADE,

                    role VARCHAR(20)
                        NOT NULL
                        CHECK (
                            role IN (
                                'user',
                                'assistant'
                            )
                        ),

                    content TEXT
                        NOT NULL,

                    emotion VARCHAR(40),

                    created_at TIMESTAMPTZ
                        NOT NULL DEFAULT NOW()

                );
                """
            )

            cursor.execute(
                """
                CREATE INDEX IF NOT EXISTS
                idx_dazy_messages_session_id_id

                ON dazy_messages (
                    session_id,
                    id
                );
                """
            )


def ping_database():

    try:

        with get_connection() as conn:

            with conn.cursor() as cursor:

                cursor.execute(
                    "SELECT 1 AS ok;"
                )

                result = cursor.fetchone()

                return (
                    result
                    and result["ok"] == 1
                )

    except Exception:

        logger.exception(
            "Database health check failed"
        )

        return False