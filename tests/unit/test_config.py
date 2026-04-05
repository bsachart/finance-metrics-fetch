"""Tests for configuration loading."""

from __future__ import annotations

import json
from pathlib import Path

import pytest

from finance_metrics_fetch.config import enabled_tickers, load_config
from finance_metrics_fetch.errors import ConfigValidationError
from finance_metrics_fetch.models import IndexSource, TickerRole


def test_load_config_reads_valid_tickers(tmp_path: Path) -> None:
    """A valid config should produce typed ticker entries."""
    config_path = tmp_path / "tickers.json"
    config_path.write_text(
        json.dumps(
            {
                "tickers": [
                    {
                        "symbol": "voo",
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
                    }
                ],
            }
        )
    )

    document = load_config(config_path)

    assert len(document.tickers) == 1
    assert document.tickers[0].symbol == "VOO"
    assert document.tickers[0].role is TickerRole.BENCHMARK
    assert document.indices[0].source is IndexSource.WIKIPEDIA
    assert enabled_tickers(document)[0].symbol == "VOO"


def test_load_config_rejects_duplicate_enabled_symbols(tmp_path: Path) -> None:
    """Duplicate enabled symbols should fail validation."""
    config_path = tmp_path / "tickers.json"
    config_path.write_text(
        json.dumps(
            {
                "tickers": [
                    {
                        "symbol": "VOO",
                        "label": "One",
                        "enabled": True,
                        "role": "benchmark",
                        "source": "yahoo_finance",
                    },
                    {
                        "symbol": "VOO",
                        "label": "Two",
                        "enabled": True,
                        "role": "asset",
                        "source": "yahoo_finance",
                    },
                ]
                ,
                "indices": [
                    {
                        "key": "sp500",
                        "label": "S&P 500",
                        "enabled": True,
                        "source": "wikipedia",
                    }
                ],
            }
        )
    )

    with pytest.raises(ConfigValidationError, match="Duplicate enabled ticker symbol"):
        load_config(config_path)


def test_load_config_rejects_duplicate_enabled_indices(tmp_path: Path) -> None:
    """Duplicate enabled indices should fail validation."""
    config_path = tmp_path / "tickers.json"
    config_path.write_text(
        json.dumps(
            {
                "tickers": [
                    {
                        "symbol": "VOO",
                        "label": "One",
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
                        "key": "sp500",
                        "label": "S&P 500 Duplicate",
                        "enabled": True,
                        "source": "wikipedia",
                    },
                ],
            }
        )
    )

    with pytest.raises(ConfigValidationError, match="Duplicate enabled index key"):
        load_config(config_path)
