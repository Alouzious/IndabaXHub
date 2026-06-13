from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

from .user import UserRead


class DatasetBase(BaseModel):
    name: str = Field(min_length=2, max_length=160)
    description: str | None = ""
    category: str | None = None
    license: str | None = None
    tags: list[str] = Field(default_factory=list)


class DatasetCreate(DatasetBase):
    """Metadata supplied on upload (the file arrives separately as multipart)."""


class DatasetUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=160)
    description: str | None = None
    category: str | None = None
    license: str | None = None
    tags: list[str] | None = None


class DatasetRead(DatasetBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    file_name: str | None = None
    size: int = 0
    downloads: int = 0
    owner_id: int
    owner: UserRead | None = None
    created_at: datetime

    @field_validator("tags", mode="before")
    @classmethod
    def split_tags(cls, value):
        if value is None or value == "":
            return []
        if isinstance(value, str):
            return [t.strip() for t in value.split(",") if t.strip()]
        return value


class DatasetDownload(BaseModel):
    url: str
    expires_in: int = 3600


class PaginatedDatasets(BaseModel):
    items: list[DatasetRead]
    total: int
    page: int
    page_size: int
