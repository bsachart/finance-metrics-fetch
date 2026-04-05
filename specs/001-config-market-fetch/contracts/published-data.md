# Contract: Published Data Artifacts

## Purpose

Define the boundary between the Python refresh pipeline and the static web UI.

## Files

- `data/market/<symbol>.csv`: normalized historical OHLCV plus quote volume
- `data/constituents/sp500.csv`: latest S&P 500 members
- `data/constituents/nasdaq100.csv`: latest Nasdaq-100 members
- `web/static/data/tickers.json`: list of published ticker metadata
- `web/static/data/<symbol>.json`: frontend-ready dataset for one ticker
- `web/static/data/status.json`: latest refresh status summary

## Frontend Dataset Shape

```json
{
  "symbol": "VOO",
  "label": "Vanguard S&P 500 ETF",
  "last_updated": "2026-04-05T12:00:00Z",
  "price_series": [
    { "time": "2026-04-01", "open": 100.0, "high": 103.0, "low": 99.5, "close": 102.0 }
  ],
  "quote_volume_series": [
    { "time": "2026-04-01", "value": 120000000.0, "color": "#26a69a" }
  ],
  "vix_series": [
    { "time": "2026-04-01", "value": 18.4 }
  ]
}
```

## Contract Rules

- JSON payload dates must be sortable ISO calendar dates
- frontend payloads must be derived from the latest successful normalized data
- missing datasets must not silently produce empty published payloads
- `status.json` must indicate whether the published artifacts reflect a full
  success or a partial-failure run
