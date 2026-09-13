import os
from pathlib import Path

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent

load_dotenv(BASE_DIR / ".env")


class Settings:

    def __init__(self):

        self.environment = os.getenv(
            "ENVIRONMENT",
            "development"
        )

        self.database_url = os.getenv(
            "DATABASE_URL",
            ""
        )

        self.gemini_api_key = os.getenv(
            "GEMINI_API_KEY",
            ""
        )

        self.chat_model = os.getenv(
            "CHAT_MODEL",
            "gemini-3.6-flash"
        )

        self.memory_messages = int(
            os.getenv(
                "MEMORY_MESSAGES",
                "12"
            )
        )

        frontend_urls = os.getenv(
            "FRONTEND_URLS",
            "http://localhost:5173,http://127.0.0.1:5173"
        )

        self.frontend_urls = [
            url.strip()
            for url in frontend_urls.split(",")
            if url.strip()
        ]

        self.validate()


    def validate(self):

        missing = []

        if not self.database_url:
            missing.append(
                "DATABASE_URL"
            )

        if not self.gemini_api_key:
            missing.append(
                "GEMINI_API_KEY"
            )

        if missing:

            raise RuntimeError(
                "Missing environment variables: "
                + ", ".join(missing)
            )


settings = Settings()