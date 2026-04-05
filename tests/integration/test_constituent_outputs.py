"""Integration tests for persisted constituent artifacts."""

from __future__ import annotations

from pathlib import Path

import polars as pl

from finance_metrics_fetch.publish.artifacts import (
    write_constituent_snapshot,
    write_constituents,
)


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
        }
    )

    path = write_constituents("sp500", frame)

    assert path.exists()
    content = path.read_text().splitlines()
    assert content[0] == "index_name,symbol,name,sector,sub_industry,source_url"
    assert content[1].startswith("sp500,AAPL,Apple Inc.")

    snapshot_path = write_constituent_snapshot("sp500", "2025-07-01", frame)
    assert snapshot_path == Path("data/constituents/history/sp500/2025-07-01.csv")
    assert snapshot_path.exists()
