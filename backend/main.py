from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from database import create_tables, ping_database
from routers.chat import router as chat_router


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s"
)

logger = logging.getLogger("dazy")


@asynccontextmanager
async def lifespan(app: FastAPI):

    logger.info("Starting Dazy backend")

    create_tables()

    logger.info("Database ready")

    yield

    logger.info("Stopping Dazy backend")


app = FastAPI(
    title="Dazy AI Tutor API",
    description="AI tutoring backend for Dazy",
    version="1.0.0",
    lifespan=lifespan
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.frontend_urls,
    allow_credentials=True,
    allow_methods=[
        "GET",
        "POST",
        "OPTIONS"
    ],
    allow_headers=["*"]
)


app.include_router(chat_router)


@app.get("/")
def home():

    return {
        "name": "Dazy AI Tutor",
        "status": "running",
        "audience": "18+",
        "model": settings.chat_model
    }


@app.get("/health")
def health():

    database_ok = ping_database()

    return {
        "status": (
            "healthy"
            if database_ok
            else "degraded"
        ),
        "database": (
            "connected"
            if database_ok
            else "unavailable"
        )
    }