"""Tests for the Wikipedia constituent source adapter."""

from __future__ import annotations

from finance_metrics_fetch.sources import wikipedia


class FakeResponse:
    """Minimal requests response stub."""

    def __init__(self, text: str) -> None:
        self.text = text

    def raise_for_status(self) -> None:
        return None


def test_fetch_sp500_constituents_parses_rows(monkeypatch) -> None:
    """The Wikipedia adapter should parse and normalize S&P rows."""
    monkeypatch.setattr(
        wikipedia.requests,
        "get",
        lambda url, headers, timeout: FakeResponse(SP500_HTML),
    )

    frame = wikipedia.fetch_sp500_constituents()

    assert frame["index_name"].to_list() == ["sp500"]
    assert frame["symbol"].to_list() == ["VOO"]
    assert frame["name"].to_list() == ["Vanguard S&P 500 ETF"]


def test_fetch_nasdaq100_constituents_parses_rows(monkeypatch) -> None:
    """The Wikipedia adapter should parse and normalize Nasdaq-100 rows."""
    monkeypatch.setattr(
        wikipedia.requests,
        "get",
        lambda url, headers, timeout: FakeResponse(NASDAQ100_HTML),
    )

    frame = wikipedia.fetch_nasdaq100_constituents()

    assert frame["index_name"].to_list() == ["nasdaq100"]
    assert frame["symbol"].to_list() == ["QQQM"]
    assert frame["name"].to_list() == ["Invesco NASDAQ 100 ETF"]


SP500_HTML = """
<html>
  <body>
    <table id="constituents">
      <tr>
        <th>Symbol</th>
        <th>Security</th>
        <th>GICS Sector</th>
        <th>GICS Sub-Industry</th>
      </tr>
      <tr>
        <td>VOO</td>
        <td>Vanguard S&amp;P 500 ETF</td>
        <td>Financials</td>
        <td>Asset Management</td>
      </tr>
    </table>
  </body>
</html>
"""

NASDAQ100_HTML = """
<html>
  <body>
    <table class="wikitable">
      <tr>
        <th>Ticker</th>
        <th>Company</th>
        <th>GICS Sector</th>
        <th>GICS Sub-Industry</th>
      </tr>
      <tr>
        <td>QQQM</td>
        <td>Invesco NASDAQ 100 ETF</td>
        <td>Financials</td>
        <td>Asset Management</td>
      </tr>
    </table>
  </body>
</html>
"""
