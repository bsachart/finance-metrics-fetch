"""Tests for the Yahoo Finance source adapter."""

from __future__ import annotations

from datetime import UTC, datetime

from finance_metrics_fetch.sources import yahoo


class FakeTicker:
    """Minimal Yahoo ticker stub."""

    def __init__(self, symbol: str) -> None:
        self.symbol = symbol

    def history(self, period: str = "max") -> "_FakeHistoryFrame":
        assert period == "max"
        return _fake_history_frame()


def test_fetch_history_normalizes_yahoo_data(monkeypatch) -> None:
    """The Yahoo adapter should normalize rows into project schema."""
    monkeypatch.setattr(yahoo.yf, "Ticker", FakeTicker)

    frame = yahoo.fetch_history("voo")

    assert frame.columns == [
        "date",
        "symbol",
        "open",
        "high",
        "low",
        "close",
        "volume",
        "quote_volume",
    ]
    assert frame["symbol"].to_list() == ["VOO", "VOO"]
    assert frame["quote_volume"].to_list() == [1005.0, 2040.0]


def _fake_history_frame() -> "_FakeHistoryFrame":
    return _FakeHistoryFrame(
        [
            {
                "Date": datetime(2026, 4, 1, tzinfo=UTC),
                "Open": 100.0,
                "High": 101.0,
                "Low": 99.0,
                "Close": 100.5,
                "Volume": 10,
            },
            {
                "Date": datetime(2026, 4, 2, tzinfo=UTC),
                "Open": 101.0,
                "High": 103.0,
                "Low": 100.5,
                "Close": 102.0,
                "Volume": 20,
            },
        ]
    )


class _FakeHistoryFrame:
    """Tiny stub that mimics the pandas frame shape used by yfinance."""

    def __init__(self, records: list[dict[str, object]]) -> None:
        self._records = records
        self.empty = not records

    def reset_index(self) -> "_FakeHistoryFrame":
        return self

    def to_dict(self, orient: str) -> list[dict[str, object]]:
        assert orient == "records"
        return self._records
