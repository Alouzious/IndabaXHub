from datetime import datetime, timezone


def is_past(value: datetime | None) -> bool:
    """Return True if the given datetime is in the past (tz-safe)."""
    if value is None:
        return False
    if value.tzinfo is None:
        value = value.replace(tzinfo=timezone.utc)
    return value < datetime.now(timezone.utc)
