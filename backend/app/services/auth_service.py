from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from ..models import User
from ..schemas.user import UserCreate
from ..utils.auth_utils import (
    create_access_token,
    hash_password,
    verify_password,
)


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.scalar(select(User).where(User.email == email))


def get_user_by_username(db: Session, username: str) -> User | None:
    return db.scalar(select(User).where(User.username == username))


def create_user(db: Session, payload: UserCreate) -> User:
    """Create a new user, enforcing unique email and username."""
    existing = db.scalar(
        select(User).where(
            or_(User.email == payload.email, User.username == payload.username)
        )
    )
    if existing:
        field = "email" if existing.email == payload.email else "username"
        raise ValueError(f"A user with this {field} already exists.")

    user = User(
        email=payload.email,
        username=payload.username,
        hashed_password=hash_password(payload.password),
        # First registered user becomes an admin for convenience.
        is_admin=db.scalar(select(User.id)) is None,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


def issue_token(user: User) -> str:
    return create_access_token(subject=user.id)
