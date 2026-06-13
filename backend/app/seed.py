"""Idempotent demo data so the platform is functional on first run."""

from __future__ import annotations

import io
from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import Competition, Dataset, Submission, User
from .services import sdk_service, storage_service
from .services.evaluator_service import safe_evaluate
from .utils.auth_utils import hash_password

DEMO_USERS = [
    {"username": "kabale_admin", "email": "admin@indabaxhub.org", "password": "indabax2026", "is_admin": True},
    {"username": "ada_nakato", "email": "ada@kab.ac.ug", "password": "password123"},
    {"username": "moses_okello", "email": "moses@kab.ac.ug", "password": "password123"},
    {"username": "fatima_zawedde", "email": "fatima@kab.ac.ug", "password": "password123"},
]

DEMO_DATASETS = [
    {
        "name": "Uganda Crop Disease",
        "description": "Labeled leaf images for detecting common crop diseases across Ugandan smallholder farms. Includes cassava, maize, and banana classes.",
        "category": "Agriculture",
        "license": "CC BY 4.0",
        "tags": "agriculture,vision,uganda,classification",
        "size": 1_843_200_000,
        "downloads": 1284,
    },
    {
        "name": "Luganda Sentiment Corpus",
        "description": "A curated corpus of Luganda social-media posts annotated for sentiment polarity (positive, neutral, negative).",
        "category": "Natural Language Processing",
        "license": "CC BY-SA 4.0",
        "tags": "nlp,luganda,sentiment,low-resource",
        "size": 56_400_000,
        "downloads": 642,
    },
    {
        "name": "East Africa Climate Daily",
        "description": "Daily temperature, rainfall, and humidity readings from weather stations across East Africa (2015-2025).",
        "category": "Climate",
        "license": "CC0 1.0",
        "tags": "climate,timeseries,weather,tabular",
        "size": 312_000_000,
        "downloads": 388,
    },
    {
        "name": "Kabale Malaria Cases",
        "description": "Anonymized weekly malaria case counts and environmental covariates for the Kabale district health facilities.",
        "category": "Healthcare",
        "license": "CC BY 4.0",
        "tags": "health,epidemiology,tabular,uganda",
        "size": 8_900_000,
        "downloads": 211,
    },
]


def _make_ground_truth_csv(n: int = 60) -> bytes:
    lines = ["id,target"]
    for i in range(n):
        lines.append(f"{i},{i % 2}")
    return ("\n".join(lines)).encode()


def _make_prediction_csv(n: int, correct_ratio: float) -> bytes:
    lines = ["id,prediction"]
    threshold = int(n * correct_ratio)
    for i in range(n):
        truth = i % 2
        pred = truth if i < threshold else 1 - truth
        lines.append(f"{i},{pred}")
    return ("\n".join(lines)).encode()


def seed_demo_data(db: Session) -> None:
    if db.scalar(select(User.id)) is not None:
        return  # already seeded

    users: list[User] = []
    for spec in DEMO_USERS:
        user = User(
            username=spec["username"],
            email=spec["email"],
            hashed_password=hash_password(spec["password"]),
            is_admin=spec.get("is_admin", False),
        )
        db.add(user)
        users.append(user)
    db.flush()

    for idx, spec in enumerate(DEMO_DATASETS):
        owner = users[idx % len(users)]
        dataset = Dataset(
            name=spec["name"],
            slug=sdk_service.unique_slug(db, spec["name"]),
            description=spec["description"],
            category=spec["category"],
            license=spec["license"],
            tags=spec["tags"],
            size=spec["size"],
            downloads=spec["downloads"],
            file_url=None,
            file_name=f"{sdk_service.slugify(spec['name'])}.zip",
            owner_id=owner.id,
        )
        db.add(dataset)

    # Competition with a hidden ground-truth file stored locally.
    n = 60
    truth_key = storage_service.build_key("ground_truth", "crop_truth.csv")
    truth_url = storage_service.upload_file_to_s3(
        io.BytesIO(_make_ground_truth_csv(n)), truth_key, "text/csv"
    )

    competition = Competition(
        title="Crop Disease Challenge 2026",
        description="Build a model that classifies crop leaf images as healthy or diseased. Predictions are scored on a hidden test set.",
        rules="Submit a CSV with columns 'id' and 'prediction'. Only your best score counts. Multiple submissions are allowed.",
        metric="f1_score",
        deadline=datetime.now(timezone.utc) + timedelta(days=30),
        is_active=True,
        ground_truth_url=truth_url,
    )
    db.add(competition)

    past_competition = Competition(
        title="Luganda Sentiment Sprint",
        description="A weekend sprint to benchmark sentiment classifiers on the Luganda corpus.",
        rules="Submit a CSV with 'id' and 'prediction'. Accuracy is the evaluation metric.",
        metric="accuracy",
        deadline=datetime.now(timezone.utc) - timedelta(days=5),
        is_active=False,
        ground_truth_url=truth_url,
    )
    db.add(past_competition)
    db.flush()

    # Scored submissions for the active competition.
    ratios = {users[1].id: 0.92, users[2].id: 0.81, users[3].id: 0.74}
    truth_path = storage_service.get_local_path(truth_url)
    truth_source = str(truth_path) if truth_path else truth_url

    for user_id, ratio in ratios.items():
        pred_bytes = _make_prediction_csv(n, ratio)
        score, sub_status = safe_evaluate(
            io.BytesIO(pred_bytes), truth_source, competition.metric
        )
        sub_key = storage_service.build_key(
            f"submissions/{competition.id}", "submission.csv"
        )
        file_url = storage_service.upload_file_to_s3(
            io.BytesIO(pred_bytes), sub_key, "text/csv"
        )
        db.add(
            Submission(
                user_id=user_id,
                competition_id=competition.id,
                file_url=file_url,
                file_name="submission.csv",
                score=score,
                status=sub_status,
            )
        )

    db.commit()
