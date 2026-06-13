from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Competition, Submission, User
from ..schemas.submission import Leaderboard, LeaderboardEntry
from ..utils.metrics import HIGHER_IS_BETTER

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])


def _best_per_user(db: Session, competition: Competition) -> list[LeaderboardEntry]:
    higher = HIGHER_IS_BETTER.get(competition.metric, True)

    rows = db.execute(
        select(
            Submission.user_id,
            User.username,
            func.max(Submission.score).label("best")
            if higher
            else func.min(Submission.score).label("best"),
            func.count(Submission.id).label("count"),
            func.max(Submission.submitted_at).label("last"),
        )
        .join(User, User.id == Submission.user_id)
        .where(
            Submission.competition_id == competition.id,
            Submission.score.is_not(None),
        )
        .group_by(Submission.user_id, User.username)
    ).all()

    ordered = sorted(
        rows,
        key=lambda r: (r.best if r.best is not None else 0),
        reverse=higher,
    )

    return [
        LeaderboardEntry(
            rank=idx + 1,
            user_id=r.user_id,
            username=r.username,
            score=r.best,
            submissions=r.count,
            last_updated=r.last,
        )
        for idx, r in enumerate(ordered)
    ]


@router.get("", response_model=Leaderboard)
def global_leaderboard(db: Session = Depends(get_db)):
    """Aggregate ranking across all competitions by average best score.

    Members are ranked by their mean of best per-competition scores, with the
    number of scored submissions as a tiebreaker.
    """
    rows = db.execute(
        select(
            Submission.user_id,
            User.username,
            func.avg(Submission.score).label("avg_score"),
            func.count(Submission.id).label("count"),
            func.max(Submission.submitted_at).label("last"),
        )
        .join(User, User.id == Submission.user_id)
        .where(Submission.score.is_not(None))
        .group_by(Submission.user_id, User.username)
    ).all()

    ordered = sorted(
        rows,
        key=lambda r: (r.avg_score or 0, r.count),
        reverse=True,
    )

    entries = [
        LeaderboardEntry(
            rank=idx + 1,
            user_id=r.user_id,
            username=r.username,
            score=round(r.avg_score, 6) if r.avg_score is not None else None,
            submissions=r.count,
            last_updated=r.last,
        )
        for idx, r in enumerate(ordered)
    ]
    return Leaderboard(competition_id=None, metric=None, entries=entries)


@router.get("/{competition_id}", response_model=Leaderboard)
def competition_leaderboard(competition_id: int, db: Session = Depends(get_db)):
    competition = db.get(Competition, competition_id)
    if not competition:
        raise HTTPException(status_code=404, detail="Competition not found")
    entries = _best_per_user(db, competition)
    return Leaderboard(
        competition_id=competition_id,
        metric=competition.metric,
        entries=entries,
    )
