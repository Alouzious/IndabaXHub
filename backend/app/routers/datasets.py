from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    Query,
    UploadFile,
    status,
)
from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload

from ..database import get_db
from ..models import Dataset, User
from ..schemas.dataset import DatasetDownload, DatasetRead, PaginatedDatasets
from ..services import sdk_service, storage_service
from ..utils.auth_utils import get_current_user

router = APIRouter(prefix="/datasets", tags=["datasets"])


@router.get("", response_model=PaginatedDatasets)
def list_datasets(
    db: Session = Depends(get_db),
    search: str | None = Query(default=None),
    category: str | None = Query(default=None),
    license: str | None = Query(default=None),
    mine: bool = Query(default=False),
    owner_id: int | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=50, ge=1, le=100),
):
    stmt = select(Dataset).options(joinedload(Dataset.owner))

    if search:
        like = f"%{search.lower()}%"
        stmt = stmt.where(
            func.lower(Dataset.name).like(like)
            | func.lower(Dataset.description).like(like)
            | func.lower(Dataset.tags).like(like)
        )
    if category:
        stmt = stmt.where(Dataset.category == category)
    if license:
        stmt = stmt.where(Dataset.license == license)
    if owner_id:
        stmt = stmt.where(Dataset.owner_id == owner_id)

    count_stmt = select(func.count()).select_from(stmt.subquery())
    total = db.scalar(count_stmt) or 0

    stmt = (
        stmt.order_by(Dataset.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    items = db.scalars(stmt).unique().all()

    return PaginatedDatasets(
        items=[DatasetRead.model_validate(d) for d in items],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/{dataset_id}", response_model=DatasetRead)
def get_dataset(dataset_id: int, db: Session = Depends(get_db)):
    dataset = db.scalar(
        select(Dataset)
        .options(joinedload(Dataset.owner))
        .where(Dataset.id == dataset_id)
    )
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return dataset


@router.post("", response_model=DatasetRead, status_code=status.HTTP_201_CREATED)
def upload_dataset(
    name: str = Form(...),
    description: str = Form(""),
    category: str = Form(""),
    license: str = Form(""),
    tags: str = Form(""),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Determine size by seeking to the end of the uploaded stream.
    file.file.seek(0, 2)
    size = file.file.tell()
    file.file.seek(0)

    key = storage_service.build_key("datasets", file.filename or name)
    file_url = storage_service.upload_file_to_s3(
        file.file, key, content_type=file.content_type
    )

    dataset = Dataset(
        name=name,
        slug=sdk_service.unique_slug(db, name),
        description=description,
        category=category or None,
        license=license or None,
        tags=tags,
        file_url=file_url,
        file_name=file.filename,
        size=size,
        downloads=0,
        owner_id=current_user.id,
    )
    db.add(dataset)
    db.commit()
    db.refresh(dataset)
    return dataset


@router.get("/{dataset_id}/download", response_model=DatasetDownload)
def download_dataset(dataset_id: int, db: Session = Depends(get_db)):
    dataset = db.get(Dataset, dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    if not dataset.file_url:
        raise HTTPException(status_code=404, detail="No file attached")

    dataset.downloads = (dataset.downloads or 0) + 1
    db.commit()

    url = storage_service.generate_presigned_url(dataset.file_url)
    return DatasetDownload(url=url)
