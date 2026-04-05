"""Typed domain models for Finance Metrics Fetch."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from datetime import UTC, date, datetime
from enum import StrEnum
from typing import Any


class TickerRole(StrEnum):
    """Supported ticker roles."""

    ASSET = "asset"
    VOLATILITY = "volatility"
    BENCHMARK = "benchmark"


class RefreshStatus(StrEnum):
    """Supported refresh statuses."""

    SUCCESS = "success"
    PARTIAL_FAILURE = "partial_failure"
    FAILURE = "failure"


@dataclass(frozen=True, slots=True)
class MarketHistoryRow:
    """Normalized market history row."""

    date: date
    symbol: str
    open: float
    high: float
    low: float
    close: float
    volume: int
    quote_volume: float


@dataclass(frozen=True, slots=True)
class ConstituentRow:
    """Normalized constituent dataset row."""

    index_name: str
    symbol: str
    name: str
    sector: str | None
    sub_industry: str | None
    source_url: str
    fetched_at: str


@dataclass(frozen=True, slots=True)
class TickerConfig:
    """Ticker configuration entry."""

    symbol: str
    label: str
    enabled: bool
    role: TickerRole
    source: str = "yahoo_finance"


@dataclass(frozen=True, slots=True)
class ConfigDocument:
    """Top-level configuration document."""

    tickers: list[TickerConfig]


@dataclass(frozen=True, slots=True)
class RefreshRunResult:
    """Summary of one refresh or publish run."""

    started_at: datetime
    finished_at: datetime
    status: RefreshStatus
    refreshed_symbols: list[str] = field(default_factory=list)
    failed_symbols: list[str] = field(default_factory=list)
    failed_sources: list[str] = field(default_factory=list)
    messages: list[str] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        """Serialize the result into JSON-safe primitives."""
        payload = asdict(self)
        payload["started_at"] = self.started_at.astimezone(UTC).isoformat()
        payload["finished_at"] = self.finished_at.astimezone(UTC).isoformat()
        payload["status"] = self.status.value
        return payload
