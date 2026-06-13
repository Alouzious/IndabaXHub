from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Competition, Submission, User
from ..schemas.competition import (
    CompetitionCreate,
    CompetitionRead,
    CompetitionUpdate,
)
from ..utils.auth_utils import get_current_admin

router = APIRouter(prefix="/competitions", tags=["competitions"])


def _participant_count(db: Session, competition_id: int) -> int:
    return (
        db.scalar(
            select(func.count(func.distinct(Submission.user_id))).where(
                Submission.competition_id == competition_id
            )
        )
        or 0
    )


def _serialize(db: Session, competition: Competition) -> CompetitionRead:
    data = CompetitionRead.model_validate(competition)
    data.participants = _participant_count(db, competition.id)
    return data


@router.get("", response_model=list[CompetitionRead])
def list_competitions(db: Session = Depends(get_db)):
    competitions = db.scalars(
        select(Competition).order_by(Competition.created_at.desc())
    ).all()
    return [_serialize(db, c) for c in competitions]


@router.get("/{competition_id}", response_model=CompetitionRead)
def get_competition(competition_id: int, db: Session = Depends(get_db)):
    competition = db.get(Competition, competition_id)
    if not competition:
        raise HTTPException(status_code=404, detail="Competition not found")
    return _serialize(db, competition)


@router.post("", response_model=CompetitionRead, status_code=status.HTTP_201_CREATED)
def create_competition(
    payload: CompetitionCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    competition = Competition(**payload.model_dump())
    db.add(competition)
    db.commit()
    db.refresh(competition)
    return _serialize(db, competition)


@router.patch("/{competition_id}", response_model=CompetitionRead)
def update_competition(
    competition_id: int,
    payload: CompetitionUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    competition = db.get(Competition, competition_id)
    if not competition:
        raise HTTPException(status_code=404, detail="Competition not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(competition, field, value)
    db.commit()
    db.refresh(competition)
    return _serialize(db, competition)
