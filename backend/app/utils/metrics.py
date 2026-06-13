"""Pure-numpy scoring metrics used by the evaluator service."""

from __future__ import annotations

import numpy as np

EPS = 1e-15


def accuracy(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    y_true = np.asarray(y_true).ravel()
    y_pred = np.asarray(y_pred).ravel()
    if y_true.size == 0:
        return 0.0
    return float(np.mean(y_true == y_pred))


def f1_score(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    """Macro-averaged F1 score across all observed classes."""
    y_true = np.asarray(y_true).ravel()
    y_pred = np.asarray(y_pred).ravel()
    classes = np.unique(np.concatenate([y_true, y_pred]))
    if classes.size == 0:
        return 0.0

    f1s = []
    for cls in classes:
        tp = np.sum((y_pred == cls) & (y_true == cls))
        fp = np.sum((y_pred == cls) & (y_true != cls))
        fn = np.sum((y_pred != cls) & (y_true == cls))
        precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
        recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
        if precision + recall == 0:
            f1s.append(0.0)
        else:
            f1s.append(2 * precision * recall / (precision + recall))
    return float(np.mean(f1s))


def rmse(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    y_true = np.asarray(y_true, dtype=float).ravel()
    y_pred = np.asarray(y_pred, dtype=float).ravel()
    if y_true.size == 0:
        return 0.0
    return float(np.sqrt(np.mean((y_true - y_pred) ** 2)))


def log_loss(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    """Binary/clipped log loss. Predictions are treated as probabilities."""
    y_true = np.asarray(y_true, dtype=float).ravel()
    y_pred = np.asarray(y_pred, dtype=float).ravel()
    if y_true.size == 0:
        return 0.0
    y_pred = np.clip(y_pred, EPS, 1 - EPS)
    return float(
        -np.mean(y_true * np.log(y_pred) + (1 - y_true) * np.log(1 - y_pred))
    )


METRICS = {
    "accuracy": accuracy,
    "f1_score": f1_score,
    "rmse": rmse,
    "log_loss": log_loss,
}

# Whether a higher score is better — drives leaderboard ordering.
HIGHER_IS_BETTER = {
    "accuracy": True,
    "f1_score": True,
    "rmse": False,
    "log_loss": False,
}


def compute_metric(metric: str, y_true, y_pred) -> float:
    fn = METRICS.get(metric)
    if fn is None:
        raise ValueError(f"Unsupported metric: {metric}")
    return fn(y_true, y_pred)
