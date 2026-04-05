"""Integration tests for the refresh command."""

from __future__ import annotations

import json
from datetime import date
from pathlib import Path

import polars as pl

from finance_metrics_fetch import cli


def test_run_refresh_writes_market_and_constituent_outputs(
    tmp_path: Path, monkeypatch
) -> None:
    """Refresh should write market data, constituent data, and status output."""
    config_path = tmp_path / "tickers.json"
    config_path.write_text(
        json.dumps(
            {
                "tickers": [
                    {
                        "symbol": "VOO",
                        "label": "VOO",
                        "enabled": True,
                        "role": "benchmark",
                        "source": "yahoo_finance",
                    }
                ],
                "indices": [
                    {
                        "key": "sp500",
                        "label": "S&P 500",
                        "enabled": True,
                        "source": "wikipedia",
                    },
                    {
                        "key": "nasdaq100",
                        "label": "Nasdaq-100",
                        "enabled": True,
                        "source": "wikipedia",
                    },
                ],
            }
        )
    )

    monkeypatch.chdir(tmp_path)
    monkeypatch.setattr(cli, "fetch_history", lambda symbol: _market_frame(symbol))
    monkeypatch.setattr(cli, "fetch_sp500_constituents", _sp500_frame)
    monkeypatch.setattr(cli, "fetch_nasdaq100_constituents", _nasdaq_frame)

    exit_code = cli.run_refresh(config_path)

    assert exit_code == 0
    assert (tmp_path / "data/market/VOO.csv").exists()
    assert (tmp_path / "data/constituents/sp500.csv").exists()
    assert (tmp_path / "data/constituents/nasdaq100.csv").exists()
    assert (tmp_path / "data/constituents/history/sp500/2026-04-05.csv").exists()
    assert (tmp_path / "data/constituents/history/nasdaq100/2026-04-05.csv").exists()
    status = json.loads((tmp_path / "data/status/latest.json").read_text())
    assert status["status"] == "success"
    assert status["refreshed_symbols"] == ["VOO"]


def _market_frame(symbol: str) -> pl.DataFrame:
    return pl.DataFrame(
        {
            "date": [date(2026, 4, 1)],
            "symbol": [symbol],
            "open": [100.0],
            "high": [101.0],
            "low": [99.0],
            "close": [100.5],
            "volume": [10],
            "quote_volume": [1005.0],
        }
    )


def _sp500_frame() -> pl.DataFrame:
    return pl.DataFrame(
        {
            "index_name": ["sp500"],
            "symbol": ["VOO"],
            "name": ["Vanguard S&P 500 ETF"],
            "sector": ["Financials"],
            "sub_industry": ["Asset Management"],
            "source_url": ["https://example.com/sp500"],
        }
    )


def _nasdaq_frame() -> pl.DataFrame:
    return pl.DataFrame(
        {
            "index_name": ["nasdaq100"],
            "symbol": ["QQQM"],
            "name": ["Invesco NASDAQ 100 ETF"],
            "sector": ["Financials"],
            "sub_industry": ["Asset Management"],
            "source_url": ["https://example.com/nasdaq100"],
        }
    )
