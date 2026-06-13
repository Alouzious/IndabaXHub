"""Automated scoring of competition submissions."""

from __future__ import annotations

import io
from pathlib import Path

import numpy as np
import pandas as pd

from ..utils.metrics import compute_metric


def _read_tabular(source) -> pd.DataFrame:
    """Read a CSV/JSON file from a path, bytes, or file-like object."""
    if isinstance(source, (str, Path)):
        path = str(source)
        if path.endswith(".json"):
            return pd.read_json(path)
        return pd.read_csv(path)
    if isinstance(source, (bytes, bytearray)):
        return pd.read_csv(io.BytesIO(source))
    # file-like
    source.seek(0)
    return pd.read_csv(source)


def _extract_columns(df: pd.DataFrame) -> tuple[str, str]:
    """Pick (id_column, target_column) heuristically."""
    cols = list(df.columns)
    target_candidates = [
        c for c in cols if c.lower() in {"target", "label", "prediction", "y", "pred", "value"}
    ]
    target = target_candidates[0] if target_candidates else cols[-1]
    id_candidates = [c for c in cols if c.lower() in {"id", "index", "row_id"}]
    id_col = id_candidates[0] if id_candidates else (cols[0] if cols[0] != target else None)
    return id_col, target


def evaluate_submission(submission_file, ground_truth_file, metric: str) -> float:
    """Score a submission against the ground truth using the given metric.

    Both files are expected to share an id column and a target column.
    Predictions are aligned to the ground truth by id when possible.
    """
    pred_df = _read_tabular(submission_file)
    truth_df = _read_tabular(ground_truth_file)

    if pred_df.empty or truth_df.empty:
        raise ValueError("Submission or ground-truth file is empty.")

    pred_id, pred_target = _extract_columns(pred_df)
    truth_id, truth_target = _extract_columns(truth_df)

    if pred_id and truth_id and pred_id in pred_df and truth_id in truth_df:
        merged = truth_df[[truth_id, truth_target]].merge(
            pred_df[[pred_id, pred_target]],
            left_on=truth_id,
            right_on=pred_id,
            how="inner",
        )
        if merged.empty:
            raise ValueError("No overlapping ids between submission and truth.")
        y_true = merged[truth_target].to_numpy()
        y_pred = merged[pred_target].to_numpy()
    else:
        n = min(len(pred_df), len(truth_df))
        y_true = truth_df[truth_target].to_numpy()[:n]
        y_pred = pred_df[pred_target].to_numpy()[:n]

    # Cast types depending on metric family.
    if metric in {"rmse", "log_loss"}:
        y_true = y_true.astype(float)
        y_pred = y_pred.astype(float)

    score = compute_metric(metric, y_true, y_pred)
    return round(float(score), 6)


def safe_evaluate(submission_file, ground_truth_file, metric: str) -> tuple[float | None, str]:
    """Evaluate without raising; returns (score, status)."""
    try:
        score = evaluate_submission(submission_file, ground_truth_file, metric)
        return score, "scored"
    except Exception as exc:  # noqa: BLE001 - surfaced as submission status
        return None, f"error: {exc}"
