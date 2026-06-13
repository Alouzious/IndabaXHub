"""Helpers that power the Python SDK / programmatic dataset access."""

from __future__ import annotations

import re

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models import Dataset


def slugify(name: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", (name or "").lower()).strip("-")
    return slug or "dataset"


def unique_slug(db: Session, name: str) -> str:
    base = slugify(name)
    slug = base
    counter = 2
    while db.scalar(select(Dataset.id).where(Dataset.slug == slug)) is not None:
        slug = f"{base}-{counter}"
        counter += 1
    return slug


def get_dataset_by_slug(db: Session, slug: str) -> Dataset | None:
    return db.scalar(select(Dataset).where(Dataset.slug == slug))


def build_sdk_snippet(slug: str) -> str:
    """Return the copy-paste SDK usage snippet for a dataset."""
    return (
        "from indabaxhub import load_dataset\n\n"
        f'data = load_dataset("{slug}")\n'
        "print(data.head())"
    )
