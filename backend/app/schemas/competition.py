from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CompetitionBase(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    description: str | None = ""
    rules: str | None = ""
    metric: str = "accuracy"
    deadline: datetime | None = None


class CompetitionCreate(CompetitionBase):
    pass


class CompetitionUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=200)
    description: str | None = None
    rules: str | None = None
    metric: str | None = None
    deadline: datetime | None = None
    is_active: bool | None = None


class CompetitionRead(CompetitionBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    is_active: bool
    participants: int = 0
    created_at: datetime
