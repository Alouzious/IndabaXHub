from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .config import settings
from .database import SessionLocal, get_db, init_db
from .models import Competition, Dataset, Submission, User
from .routers import auth, competitions, datasets, leaderboard, submissions
from .services import storage_service
from .seed import seed_demo_data


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables and seed demo content on startup.
    try:
        init_db()
        with SessionLocal() as db:
            seed_demo_data(db)
    except Exception as exc:  # noqa: BLE001 - don't crash if DB is unreachable
        print(f"[startup] database initialization skipped: {exc}")
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api = settings.API_PREFIX

app.include_router(auth.router, prefix=api)
app.include_router(datasets.router, prefix=api)
app.include_router(competitions.router, prefix=api)
app.include_router(submissions.router, prefix=api)
app.include_router(leaderboard.router, prefix=api)


@app.get("/")
def root():
    return {"message": "IndabaXHub API is live", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get(f"{api}/stats")
def stats(db: Session = Depends(get_db)):
    return {
        "datasets": db.scalar(select(func.count(Dataset.id))) or 0,
        "users": db.scalar(select(func.count(User.id))) or 0,
        "submissions": db.scalar(select(func.count(Submission.id))) or 0,
        "competitions": db.scalar(select(func.count(Competition.id))) or 0,
    }


@app.get(api + "/files/{file_path:path}")
def serve_local_file(file_path: str):
    """Serve files stored on the local disk (development fallback)."""
    path = storage_service.get_local_path(f"local://{file_path}")
    if not path or not path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(path, filename=path.name)
