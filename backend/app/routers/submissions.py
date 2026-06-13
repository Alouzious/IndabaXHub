import io

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
    status,
)
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from ..database import get_db
from ..models import Competition, Submission, User
from ..schemas.submission import SubmissionRead
from ..services import storage_service
from ..services.evaluator_service import safe_evaluate
from ..utils.auth_utils import get_current_user
from ..utils.helpers_time import is_past

router = APIRouter(prefix="/submissions", tags=["submissions"])


@router.post("", response_model=SubmissionRead, status_code=status.HTTP_201_CREATED)
def create_submission(
    competition_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    competition = db.get(Competition, competition_id)
    if not competition:
        raise HTTPException(status_code=404, detail="Competition not found")
    if not competition.is_active or is_past(competition.deadline):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This competition is closed for submissions.",
        )

    raw = file.file.read()
    file.file.seek(0)

    # Persist the submission file.
    key = storage_service.build_key(
        f"submissions/{competition_id}", file.filename or "submission.csv"
    )
    file_url = storage_service.upload_file_to_s3(
        io.BytesIO(raw), key, content_type=file.content_type
    )

    # Score against the hidden ground truth when available.
    score, sub_status = None, "pending"
    if competition.ground_truth_url:
        truth_path = storage_service.get_local_path(competition.ground_truth_url)
        truth_source = str(truth_path) if truth_path else competition.ground_truth_url
        score, sub_status = safe_evaluate(
            io.BytesIO(raw), truth_source, competition.metric
        )

    submission = Submission(
        user_id=current_user.id,
        competition_id=competition_id,
        file_url=file_url,
        file_name=file.filename,
        score=score,
        status=sub_status,
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission


@router.get("/me", response_model=list[SubmissionRead])
def my_submissions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    submissions = db.scalars(
        select(Submission)
        .options(joinedload(Submission.competition))
        .where(Submission.user_id == current_user.id)
        .order_by(Submission.submitted_at.desc())
    ).all()
    return submissions
