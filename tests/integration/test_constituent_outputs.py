"""Integration tests for persisted constituent artifacts."""

from __future__ import annotations

from pathlib import Path

import polars as pl

from finance_metrics_fetch.publish.artifacts import write_constituents


def test_write_constituents_persists_stable_schema(tmp_path: Path, monkeypatch) -> None:
    """Constituent exports should persist a stable column order."""
    monkeypatch.chdir(tmp_path)
    frame = pl.DataFrame(
        {
            "index_name": ["sp500"],
            "symbol": ["AAPL"],
            "name": ["Apple Inc."],
            "sector": ["Information Technology"],
            "sub_industry": ["Technology Hardware, Storage & Peripherals"],
            "source_url": ["https://example.com"],
            "fetched_at": ["2026-04-05T00:00:00+00:00"],
        }
    )

    path = write_constituents("sp500", frame)

    assert path.exists()
    content = path.read_text().splitlines()
    assert (
        content[0] == "index_name,symbol,name,sector,sub_industry,source_url,fetched_at"
    )
    assert content[1].startswith("sp500,AAPL,Apple Inc.")
