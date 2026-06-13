from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SubmissionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    competition_id: int
    file_name: str | None = None
    score: float | None = None
    status: str
    submitted_at: datetime


class LeaderboardEntry(BaseModel):
    rank: int
    user_id: int
    username: str
    score: float | None = None
    submissions: int = 0
    last_updated: datetime | None = None


class Leaderboard(BaseModel):
    competition_id: int | None = None
    metric: str | None = None
    entries: list[LeaderboardEntry]
