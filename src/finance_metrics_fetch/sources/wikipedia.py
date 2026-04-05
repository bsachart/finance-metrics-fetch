"""Wikipedia constituent source adapter."""

from __future__ import annotations

import polars as pl
import requests
from bs4 import BeautifulSoup

from finance_metrics_fetch.transforms.datasets import normalize_constituents

SP500_URL = "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies"
NASDAQ100_URL = "https://en.wikipedia.org/wiki/Nasdaq-100"
REQUEST_HEADERS = {
    "User-Agent": (
        "finance-metrics-fetch/0.1 "
        "(https://github.com/bsachart/finance-metrics-fetch; data refresh bot)"
    ),
    "Accept": "text/html,application/xhtml+xml",
    "Accept-Language": "en-US,en;q=0.9",
}


def fetch_sp500_constituents() -> pl.DataFrame:
    """Fetch and normalize S&P 500 constituents from Wikipedia."""
    return _fetch_constituents(
        index_name="sp500",
        url=SP500_URL,
        table_id="constituents",
        symbol_header="Symbol",
        name_header="Security",
    )


def fetch_nasdaq100_constituents() -> pl.DataFrame:
    """Fetch and normalize Nasdaq-100 constituents from Wikipedia."""
    return _fetch_constituents(
        index_name="nasdaq100",
        url=NASDAQ100_URL,
        table_id=None,
        symbol_header="Ticker",
        name_header="Company",
    )


def _fetch_constituents(
    *,
    index_name: str,
    url: str,
    table_id: str | None,
    symbol_header: str,
    name_header: str,
) -> pl.DataFrame:
    """Fetch and normalize a constituent table from Wikipedia HTML."""
    response = requests.get(url, headers=REQUEST_HEADERS, timeout=30)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")

    table, headers = _select_constituent_table(
        soup=soup,
        table_id=table_id,
        index_name=index_name,
        symbol_header=symbol_header,
        name_header=name_header,
    )
    rows = table.find_all("tr")
    records: list[dict[str, object]] = []

    for row in rows[1:]:
        cells = row.find_all(["th", "td"])
        if not cells:
            continue

        values = [cell.get_text(" ", strip=True) for cell in cells]
        row_map = dict(zip(headers, values, strict=False))
        symbol = row_map.get(symbol_header)
        name = row_map.get(name_header)
        if not symbol or not name:
            continue

        records.append(
            {
                "symbol": symbol,
                "name": name,
                "sector": row_map.get("GICS Sector") or row_map.get("ICB Industry"),
                "sub_industry": row_map.get("GICS Sub-Industry")
                or row_map.get("ICB Subsector"),
                "source_url": url,
            }
        )

    if not records:
        raise ValueError(f"No constituent rows parsed for {index_name}")

    raw_frame = pl.from_records(records)
    return normalize_constituents(index_name, raw_frame)


def _select_constituent_table(
    *,
    soup: BeautifulSoup,
    table_id: str | None,
    index_name: str,
    symbol_header: str,
    name_header: str,
) -> tuple[object, list[str]]:
    """Find the constituent table by explicit id or required headers."""
    if table_id is not None:
        table = soup.find("table", attrs={"id": table_id})
        if table is None:
            raise ValueError(f"No Wikipedia constituent table found for {index_name}")
        rows = table.find_all("tr")
        if not rows:
            raise ValueError(f"Empty Wikipedia constituent table for {index_name}")
        headers = [
            cell.get_text(" ", strip=True) for cell in rows[0].find_all(["th", "td"])
        ]
        return table, headers

    for table in soup.find_all("table", class_="wikitable"):
        rows = table.find_all("tr")
        if not rows:
            continue
        headers = [
            cell.get_text(" ", strip=True) for cell in rows[0].find_all(["th", "td"])
        ]
        if symbol_header in headers and name_header in headers:
            return table, headers

    raise ValueError(f"No Wikipedia constituent table found for {index_name}")
