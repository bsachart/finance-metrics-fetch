"""Artifact writing helpers for normalized datasets."""

from __future__ import annotations

import json
from datetime import UTC, date, datetime
from pathlib import Path

import polars as pl

from finance_metrics_fetch.models import RefreshRunResult
from finance_metrics_fetch.transforms.datasets import dataframe_to_json_records

DATA_DIR = Path("data")
MARKET_DIR = DATA_DIR / "market"
CONSTITUENTS_DIR = DATA_DIR / "constituents"
CONSTITUENT_HISTORY_DIR = CONSTITUENTS_DIR / "history"
STATUS_DIR = DATA_DIR / "status"
CONSTITUENT_COLUMNS = [
    "index_name",
    "symbol",
    "name",
    "sector",
    "sub_industry",
    "source_url",
]
MARKET_COLUMNS = [
    "date",
    "symbol",
    "open",
    "high",
    "low",
    "close",
    "volume",
    "quote_volume",
]


def write_market_history(symbol: str, frame: pl.DataFrame) -> Path:
    """Write a normalized market history CSV."""
    MARKET_DIR.mkdir(parents=True, exist_ok=True)
    path = MARKET_DIR / f"{symbol.upper()}.csv"
    frame.select(MARKET_COLUMNS).write_csv(path)
    return path


def write_constituents(index_name: str, frame: pl.DataFrame) -> Path:
    """Write a normalized constituent CSV."""
    CONSTITUENTS_DIR.mkdir(parents=True, exist_ok=True)
    path = CONSTITUENTS_DIR / f"{index_name}.csv"
    frame.select(CONSTITUENT_COLUMNS).sort("symbol").write_csv(path)
    return path


def write_constituent_snapshot(
    index_name: str,
    snapshot_date: date | datetime | str,
    frame: pl.DataFrame,
) -> Path:
    """Write a dated constituent snapshot CSV."""
    if isinstance(snapshot_date, datetime):
        snapshot_label = snapshot_date.astimezone(UTC).date().isoformat()
    elif isinstance(snapshot_date, date):
        snapshot_label = snapshot_date.isoformat()
    else:
        snapshot_label = snapshot_date

    snapshot_dir = CONSTITUENT_HISTORY_DIR / index_name
    snapshot_dir.mkdir(parents=True, exist_ok=True)
    path = snapshot_dir / f"{snapshot_label}.csv"
    frame.select(CONSTITUENT_COLUMNS).sort("symbol").write_csv(path)
    return path


def write_json_records(path: Path | str, frame: pl.DataFrame) -> Path:
    """Write dataframe rows as JSON records."""
    output_path = Path(path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(dataframe_to_json_records(frame), indent=2))
    return output_path


def write_refresh_status(result: RefreshRunResult) -> Path:
    """Write refresh status metadata."""
    STATUS_DIR.mkdir(parents=True, exist_ok=True)
    path = STATUS_DIR / "latest.json"
    path.write_text(json.dumps(result.to_dict(), indent=2))
    return path
