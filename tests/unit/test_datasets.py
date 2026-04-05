"""Tests for shared dataset normalization helpers."""

from __future__ import annotations

from datetime import date

import polars as pl

from finance_metrics_fetch.transforms.datasets import (
    dataframe_to_json_records,
    normalize_constituents,
    normalize_market_history,
)


def test_normalize_market_history_adds_symbol_and_quote_volume() -> None:
    """Market normalization should produce the project schema."""
    frame = pl.DataFrame(
        {
            "date": [date(2026, 4, 1), date(2026, 4, 2)],
            "open": [100.0, 101.0],
            "high": [101.0, 103.0],
            "low": [99.0, 100.5],
            "close": [100.5, 102.0],
            "volume": [10, 20],
        }
    )

    normalized = normalize_market_history("voo", frame)

    assert normalized.columns == [
        "date",
        "symbol",
        "open",
        "high",
        "low",
        "close",
        "volume",
        "quote_volume",
    ]
    assert normalized["symbol"].to_list() == ["VOO", "VOO"]
    assert normalized["quote_volume"].to_list() == [1005.0, 2040.0]


def test_normalize_market_history_rounds_prices_and_dollar_volume() -> None:
    """Market normalization should clamp float precision before persistence."""
    frame = pl.DataFrame(
        {
            "date": [date(2026, 4, 1)],
            "open": [100.12349],
            "high": [101.98764],
            "low": [99.11119],
            "close": [100.55551],
            "volume": [11],
        }
    )

    normalized = normalize_market_history("intc", frame)

    assert normalized["open"].to_list() == [100.123]
    assert normalized["high"].to_list() == [101.988]
    assert normalized["low"].to_list() == [99.111]
    assert normalized["close"].to_list() == [100.556]
    assert normalized["quote_volume"].to_list() == [1106.12]


def test_normalize_constituents_and_json_records() -> None:
    """Constituent normalization should trim values and produce JSON-safe rows."""
    frame = pl.DataFrame(
        {
            "symbol": [" voo "],
            "name": [" Vanguard "],
            "sector": [" ETF "],
        }
    )

    normalized = normalize_constituents("sp500", frame)
    records = dataframe_to_json_records(normalized)

    assert normalized["symbol"].to_list() == ["VOO"]
    assert normalized["name"].to_list() == ["Vanguard"]
    assert records[0]["index_name"] == "sp500"
    assert records[0]["symbol"] == "VOO"
