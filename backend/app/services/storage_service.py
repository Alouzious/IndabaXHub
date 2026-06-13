"""Object storage abstraction.

Uses S3 (or any S3-compatible endpoint) when credentials are configured,
otherwise falls back to local disk so the platform runs out-of-the-box in
development.
"""

from __future__ import annotations

import os
import shutil
import uuid
from pathlib import Path

from ..config import settings

try:  # boto3 is optional at import time (local fallback works without it)
    import boto3
    from botocore.exceptions import BotoCoreError, ClientError
except Exception:  # pragma: no cover - boto3 always in requirements
    boto3 = None
    BotoCoreError = ClientError = Exception


def _s3_client():
    if boto3 is None:
        raise RuntimeError("boto3 is not installed")
    return boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_REGION,
        endpoint_url=settings.S3_ENDPOINT_URL,
    )


def _local_dir() -> Path:
    path = Path(settings.LOCAL_STORAGE_DIR)
    path.mkdir(parents=True, exist_ok=True)
    return path


def build_key(prefix: str, filename: str) -> str:
    safe = os.path.basename(filename or "file")
    return f"{prefix}/{uuid.uuid4().hex}_{safe}"


def upload_file_to_s3(file_obj, key: str, content_type: str | None = None) -> str:
    """Upload a file-like object and return a storage URL/key.

    Falls back to local disk when S3 is not configured.
    """
    if settings.s3_configured and boto3 is not None:
        extra = {"ContentType": content_type} if content_type else {}
        try:
            _s3_client().upload_fileobj(
                file_obj, settings.S3_BUCKET_NAME, key, ExtraArgs=extra
            )
            return f"s3://{settings.S3_BUCKET_NAME}/{key}"
        except (BotoCoreError, ClientError) as exc:  # pragma: no cover
            raise RuntimeError(f"S3 upload failed: {exc}") from exc

    # Local fallback
    dest = _local_dir() / key
    dest.parent.mkdir(parents=True, exist_ok=True)
    file_obj.seek(0)
    with open(dest, "wb") as out:
        shutil.copyfileobj(file_obj, out)
    return f"local://{key}"


def generate_presigned_url(file_url: str, expires_in: int = 3600) -> str:
    """Return a time-limited download URL for a stored object."""
    if file_url and file_url.startswith("s3://") and settings.s3_configured:
        key = file_url.split(f"s3://{settings.S3_BUCKET_NAME}/", 1)[-1]
        try:
            return _s3_client().generate_presigned_url(
                "get_object",
                Params={"Bucket": settings.S3_BUCKET_NAME, "Key": key},
                ExpiresIn=expires_in,
            )
        except (BotoCoreError, ClientError) as exc:  # pragma: no cover
            raise RuntimeError(f"Could not presign URL: {exc}") from exc

    # Local fallback — served by the API's /files route.
    if file_url and file_url.startswith("local://"):
        key = file_url.replace("local://", "", 1)
        return f"{settings.API_PREFIX}/files/{key}"
    return file_url


def get_local_path(file_url: str) -> Path | None:
    if file_url and file_url.startswith("local://"):
        return _local_dir() / file_url.replace("local://", "", 1)
    return None


def delete_file(file_url: str) -> None:
    if not file_url:
        return
    if file_url.startswith("s3://") and settings.s3_configured:
        key = file_url.split(f"s3://{settings.S3_BUCKET_NAME}/", 1)[-1]
        try:
            _s3_client().delete_object(Bucket=settings.S3_BUCKET_NAME, Key=key)
        except (BotoCoreError, ClientError):  # pragma: no cover
            pass
    elif file_url.startswith("local://"):
        path = get_local_path(file_url)
        if path and path.exists():
            path.unlink()
