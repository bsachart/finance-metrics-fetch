"""Polars dataset normalization helpers."""

from __future__ import annotations

from datetime import date, datetime

import polars as pl

PRICE_DECIMALS = 3
DOLLAR_VOLUME_DECIMALS = 2


def normalize_market_history(symbol: str, frame: pl.DataFrame) -> pl.DataFrame:
    """Normalize Yahoo-style OHLCV data into the project schema."""
    required_columns = {"date", "open", "high", "low", "close", "volume"}
    missing_columns = sorted(required_columns.difference(frame.columns))
    if missing_columns:
        missing = ", ".join(missing_columns)
        raise ValueError(f"Market history frame is missing required columns: {missing}")

    normalized = (
        frame.select(
            pl.col("date").alias("date"),
            pl.lit(symbol.upper()).alias("symbol"),
            pl.col("open").cast(pl.Float64).round(PRICE_DECIMALS),
            pl.col("high").cast(pl.Float64).round(PRICE_DECIMALS),
            pl.col("low").cast(pl.Float64).round(PRICE_DECIMALS),
            pl.col("close").cast(pl.Float64).round(PRICE_DECIMALS),
            pl.col("volume").cast(pl.Int64),
        )
        .with_columns(
            quote_volume=(
                (pl.col("close") * pl.col("volume"))
                .cast(pl.Float64)
                .round(DOLLAR_VOLUME_DECIMALS)
            )
        )
        .sort("date")
        .unique(subset=["symbol", "date"], keep="last", maintain_order=True)
    )
    return normalized


def normalize_constituents(index_name: str, frame: pl.DataFrame) -> pl.DataFrame:
    """Normalize constituent rows into a stable schema."""
    required_columns = {"symbol", "name"}
    missing_columns = sorted(required_columns.difference(frame.columns))
    if missing_columns:
        missing = ", ".join(missing_columns)
        raise ValueError(f"Constituent frame is missing required columns: {missing}")

    available_sector = "sector" if "sector" in frame.columns else None
    available_sub_industry = "sub_industry" if "sub_industry" in frame.columns else None
    available_source_url = "source_url" if "source_url" in frame.columns else None

    return (
        frame.select(
            pl.lit(index_name).alias("index_name"),
            pl.col("symbol").cast(pl.Utf8).str.strip_chars().str.to_uppercase(),
            pl.col("name").cast(pl.Utf8).str.strip_chars(),
            (
                pl.col(available_sector).cast(pl.Utf8).str.strip_chars()
                if available_sector
                else pl.lit(None).cast(pl.Utf8)
            ).alias("sector"),
            (
                pl.col(available_sub_industry).cast(pl.Utf8).str.strip_chars()
                if available_sub_industry
                else pl.lit(None).cast(pl.Utf8)
            ).alias("sub_industry"),
            (
                pl.col(available_source_url).cast(pl.Utf8).str.strip_chars()
                if available_source_url
                else pl.lit("")
            ).alias("source_url"),
        )
        .unique(subset=["index_name", "symbol"], keep="last", maintain_order=True)
        .sort("symbol")
    )


def dataframe_to_json_records(frame: pl.DataFrame) -> list[dict[str, object]]:
    """Convert a Polars frame to JSON-safe row dictionaries."""
    records: list[dict[str, object]] = []
    for record in frame.to_dicts():
        records.append({key: _json_safe_value(value) for key, value in record.items()})
    return records


def _json_safe_value(value: object) -> object:
    """Convert date-like values into JSON-safe strings."""
    if isinstance(value, datetime):
        return value.isoformat()
    if isinstance(value, date):
        return value.isoformat()
    return value
