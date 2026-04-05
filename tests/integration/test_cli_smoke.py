"""Smoke tests for the shared CLI flow."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path


def test_publish_command_validates_config_and_writes_status(tmp_path: Path) -> None:
    """The publish command should validate config and write status output."""
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
                    }
                ],
            }
        )
    )

    result = subprocess.run(
        [
            sys.executable,
            "-m",
            "finance_metrics_fetch.cli",
            "publish",
            "--config",
            str(config_path),
        ],
        cwd=tmp_path,
        env={"PYTHONPATH": str(Path.cwd() / "src")},
        capture_output=True,
        text=True,
        check=False,
    )

    assert result.returncode == 0
    assert "validated 1 tickers" in result.stdout
    assert (tmp_path / "data/status/latest.json").exists()
