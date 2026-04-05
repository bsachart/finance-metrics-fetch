"""Configuration loading for Finance Metrics Fetch."""

from __future__ import annotations

import json
from pathlib import Path

from finance_metrics_fetch.errors import ConfigValidationError
from finance_metrics_fetch.models import ConfigDocument, TickerConfig, TickerRole

DEFAULT_CONFIG_PATH = Path("config/tickers.json")


def load_config(config_path: Path | str = DEFAULT_CONFIG_PATH) -> ConfigDocument:
    """Load and validate the ticker configuration."""
    path = Path(config_path)
    try:
        payload = json.loads(path.read_text())
    except FileNotFoundError as exc:
        raise ConfigValidationError(f"Config file not found: {path}") from exc
    except json.JSONDecodeError as exc:
        raise ConfigValidationError(f"Invalid JSON in config file: {path}") from exc

    tickers_payload = payload.get("tickers")
    if not isinstance(tickers_payload, list):
        raise ConfigValidationError("Config file must define a 'tickers' list")

    tickers: list[TickerConfig] = []
    seen_enabled_symbols: set[str] = set()
    volatility_ticker_count = 0

    for index, raw_ticker in enumerate(tickers_payload):
        if not isinstance(raw_ticker, dict):
            raise ConfigValidationError(f"Ticker at index {index} must be an object")

        symbol = _require_non_empty_string(raw_ticker, "symbol", index).upper()
        label = _require_non_empty_string(raw_ticker, "label", index)
        source = _require_non_empty_string(raw_ticker, "source", index)
        enabled = raw_ticker.get("enabled", True)

        if not isinstance(enabled, bool):
            raise ConfigValidationError(
                f"Ticker at index {index} field 'enabled' must be a boolean"
            )

        role_raw = _require_non_empty_string(raw_ticker, "role", index)
        try:
            role = TickerRole(role_raw)
        except ValueError as exc:
            raise ConfigValidationError(
                f"Ticker at index {index} has invalid role: {role_raw}"
            ) from exc

        if enabled and symbol in seen_enabled_symbols:
            raise ConfigValidationError(f"Duplicate enabled ticker symbol: {symbol}")

        if enabled:
            seen_enabled_symbols.add(symbol)
            if role is TickerRole.VOLATILITY:
                volatility_ticker_count += 1

        tickers.append(
            TickerConfig(
                symbol=symbol,
                label=label,
                enabled=enabled,
                role=role,
                source=source,
            )
        )

    enabled_tickers = [ticker for ticker in tickers if ticker.enabled]
    if not enabled_tickers:
        raise ConfigValidationError(
            "Config file must contain at least one enabled ticker"
        )

    if volatility_ticker_count > 1:
        raise ConfigValidationError(
            "Config file may contain at most one enabled volatility ticker"
        )

    return ConfigDocument(tickers=tickers)


def enabled_tickers(document: ConfigDocument) -> list[TickerConfig]:
    """Return enabled tickers from the configuration document."""
    return [ticker for ticker in document.tickers if ticker.enabled]


def _require_non_empty_string(
    payload: dict[str, object], field_name: str, index: int
) -> str:
    """Validate and return a non-empty string field."""
    raw_value = payload.get(field_name)
    if not isinstance(raw_value, str) or not raw_value.strip():
        raise ConfigValidationError(
            f"Ticker at index {index} field '{field_name}' must be a non-empty string"
        )
    return raw_value.strip()
