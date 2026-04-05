"""Command-line entrypoint for Finance Metrics Fetch."""

from __future__ import annotations

import argparse
from datetime import UTC, datetime
from pathlib import Path

from finance_metrics_fetch.config import (
    DEFAULT_CONFIG_PATH,
    enabled_tickers,
    load_config,
)
from finance_metrics_fetch.errors import ConfigValidationError
from finance_metrics_fetch.models import RefreshRunResult, RefreshStatus
from finance_metrics_fetch.publish.artifacts import (
    write_constituents,
    write_market_history,
    write_refresh_status,
)
from finance_metrics_fetch.sources.wikipedia import (
    fetch_nasdaq100_constituents,
    fetch_sp500_constituents,
)
from finance_metrics_fetch.sources.yahoo import fetch_history


def build_parser() -> argparse.ArgumentParser:
    """Build the top-level argument parser."""
    parser = argparse.ArgumentParser(prog="finance-metrics-fetch")
    subparsers = parser.add_subparsers(dest="command")

    refresh_parser = subparsers.add_parser(
        "refresh",
        help="Fetch configured market data and constituent datasets.",
    )
    refresh_parser.add_argument(
        "--config",
        type=Path,
        default=DEFAULT_CONFIG_PATH,
        help="Path to the ticker configuration file.",
    )

    publish_parser = subparsers.add_parser(
        "publish",
        help="Validate config and prepare for artifact publishing.",
    )
    publish_parser.add_argument(
        "--config",
        type=Path,
        default=DEFAULT_CONFIG_PATH,
        help="Path to the ticker configuration file.",
    )
    return parser


def run_refresh(config_path: Path) -> int:
    """Refresh configured datasets and emit a status summary."""
    started_at = datetime.now(tz=UTC)
    refreshed_symbols: list[str] = []
    failed_symbols: list[str] = []
    failed_sources: list[str] = []
    messages: list[str] = []

    try:
        document = load_config(config_path)
        tickers = enabled_tickers(document)

        for ticker in tickers:
            try:
                history = fetch_history(ticker.symbol)
                if history.is_empty():
                    failed_symbols.append(ticker.symbol)
                    messages.append(f"{ticker.symbol}: no Yahoo Finance rows returned")
                    continue

                write_market_history(ticker.symbol, history)
                refreshed_symbols.append(ticker.symbol)
            except Exception as exc:  # pragma: no cover
                failed_symbols.append(ticker.symbol)
                failed_sources.append(ticker.source)
                messages.append(f"{ticker.symbol}: {exc}")

        for index_name, fetcher in (
            ("sp500", fetch_sp500_constituents),
            ("nasdaq100", fetch_nasdaq100_constituents),
        ):
            try:
                frame = fetcher()
                write_constituents(index_name, frame)
                messages.append(f"{index_name}: constituents updated")
            except Exception as exc:  # pragma: no cover
                failed_sources.append(index_name)
                messages.append(f"{index_name}: {exc}")

        finished_at = datetime.now(tz=UTC)
        status = _status_from_failures(
            refreshed_symbols=refreshed_symbols,
            failed_symbols=failed_symbols,
            failed_sources=failed_sources,
        )
        result = RefreshRunResult(
            started_at=started_at,
            finished_at=finished_at,
            status=status,
            refreshed_symbols=refreshed_symbols,
            failed_symbols=failed_symbols,
            failed_sources=sorted(set(failed_sources)),
            messages=messages or ["refresh complete"],
        )
        status_path = write_refresh_status(result)
        print(f"refresh: wrote {len(refreshed_symbols)} market datasets")
        print(f"status: {status_path}")
        return 0 if status is not RefreshStatus.FAILURE else 1
    except ConfigValidationError as exc:
        return _write_failed_status(
            command_name="refresh",
            started_at=started_at,
            message=str(exc),
        )


def run_publish(config_path: Path) -> int:
    """Validate the configuration and emit a publish status summary."""
    return _run_with_config(command_name="publish", config_path=config_path)


def main() -> int:
    """Run the CLI."""
    parser = build_parser()
    args = parser.parse_args()

    if args.command == "refresh":
        return run_refresh(args.config)
    if args.command == "publish":
        return run_publish(args.config)

    parser.print_help()
    return 0


def _run_with_config(command_name: str, config_path: Path) -> int:
    """Execute a config-backed command and emit a refresh-style result."""
    started_at = datetime.now(tz=UTC)
    try:
        document = load_config(config_path)
        tickers = enabled_tickers(document)
        finished_at = datetime.now(tz=UTC)
        result = RefreshRunResult(
            started_at=started_at,
            finished_at=finished_at,
            status=RefreshStatus.SUCCESS,
            refreshed_symbols=[ticker.symbol for ticker in tickers],
            messages=[
                f"{command_name} configuration validated",
                f"{len(tickers)} enabled tickers loaded",
            ],
        )
        status_path = write_refresh_status(result)
        print(f"{command_name}: validated {len(tickers)} tickers from {config_path}")
        print(f"status: {status_path}")
        return 0
    except ConfigValidationError as exc:
        return _write_failed_status(
            command_name=command_name,
            started_at=started_at,
            message=str(exc),
        )


def _status_from_failures(
    *,
    refreshed_symbols: list[str],
    failed_symbols: list[str],
    failed_sources: list[str],
) -> RefreshStatus:
    """Determine the refresh status from run outcomes."""
    if failed_symbols or failed_sources:
        if refreshed_symbols:
            return RefreshStatus.PARTIAL_FAILURE
        return RefreshStatus.FAILURE
    return RefreshStatus.SUCCESS


def _write_failed_status(
    *, command_name: str, started_at: datetime, message: str
) -> int:
    """Persist a failure result and report it."""
    finished_at = datetime.now(tz=UTC)
    result = RefreshRunResult(
        started_at=started_at,
        finished_at=finished_at,
        status=RefreshStatus.FAILURE,
        messages=[message],
    )
    status_path = write_refresh_status(result)
    print(f"{command_name}: failed to validate configuration: {message}")
    print(f"status: {status_path}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
