"""Tests for constituent output schema handling."""

from __future__ import annotations

import polars as pl

from finance_metrics_fetch.publish.artifacts import CONSTITUENT_COLUMNS
from finance_metrics_fetch.transforms.datasets import normalize_constituents


def test_constituent_normalization_produces_expected_schema() -> None:
    """Normalized constituent rows should match the stable export schema."""
    frame = pl.DataFrame(
        {
            "symbol": [" msft "],
            "name": [" Microsoft "],
            "sector": ["Information Technology"],
            "sub_industry": ["Systems Software"],
            "source_url": ["https://example.com"],
            "fetched_at": ["2026-04-05T00:00:00+00:00"],
        }
    )

    normalized = normalize_constituents("nasdaq100", frame)

    assert normalized.columns == CONSTITUENT_COLUMNS
    assert normalized["symbol"].to_list() == ["MSFT"]
    assert normalized["name"].to_list() == ["Microsoft"]
