"""Yahoo Finance source adapter."""

from __future__ import annotations

from collections.abc import Iterable
from datetime import date, datetime

import polars as pl
import yfinance as yf

from finance_metrics_fetch.transforms.datasets import normalize_market_history


def fetch_history(symbol: str, period: str = "max") -> pl.DataFrame:
    """Fetch and normalize Yahoo Finance history for one ticker."""
    history = yf.Ticker(symbol).history(period=period)
    if history.empty:
        return pl.DataFrame(
            schema={
                "date": pl.Date,
                "symbol": pl.Utf8,
                "open": pl.Float64,
                "high": pl.Float64,
                "low": pl.Float64,
                "close": pl.Float64,
                "volume": pl.Int64,
                "quote_volume": pl.Float64,
            }
        )

    frame = pl.from_records(_history_records(history.reset_index().to_dict("records")))
    return normalize_market_history(symbol, frame)


def _history_records(records: Iterable[dict[str, object]]) -> list[dict[str, object]]:
    """Convert Yahoo history rows into normalization input records."""
    normalized_records: list[dict[str, object]] = []
    for record in records:
        normalized_records.append(
            {
                "date": _coerce_date(record.get("Date")),
                "open": float(record.get("Open", 0.0)),
                "high": float(record.get("High", 0.0)),
                "low": float(record.get("Low", 0.0)),
                "close": float(record.get("Close", 0.0)),
                "volume": int(record.get("Volume", 0)),
            }
        )
    return normalized_records


def _coerce_date(value: object) -> date:
    """Convert supported date-like values into plain dates."""
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, date):
        return value
    if hasattr(value, "to_pydatetime"):
        return value.to_pydatetime().date()
    raise ValueError(f"Unsupported Yahoo Finance date value: {value!r}")
