# Dashboard Data Contract

## Purpose

Define the packaged files and fields the static dashboard expects after
`ui/scripts/copy-data.mjs` completes.

## Published files

- `ui/static/published/tickers.json`
- `ui/static/published/asset-manifest.json`
- `ui/static/published/data/status/latest.json`
- `ui/static/published/data/market/{symbol}.csv`
- `ui/static/published/data/constituents/{index}.csv`
- `ui/static/published/data/constituents/history/{index}/{date}.csv`

## `asset-manifest.json`

```json
{
  "symbols": [
    {
      "symbol": "VOO",
      "label": "Vanguard S&P 500 ETF",
      "role": "benchmark",
      "enabled": true,
      "has_market_data": true
    }
  ],
  "indices": [
    {
      "key": "sp500",
      "label": "S&P 500",
      "enabled": true,
      "has_constituents": true
    }
  ]
}
```

## Constituent CSV schema

Header order:

```text
index_name,symbol,name,sector,sub_industry,source_url
```

Rules:

- No `fetched_at` column
- Rows sorted by `symbol`
- Empty optional text fields are permitted

## Constituent history snapshot path

```text
data/constituents/history/{index}/{YYYY-MM-DD}.csv
```

## Market CSV schema

Header order:

```text
date,symbol,open,high,low,close,volume,quote_volume
```

Rules:

- No `fetched_at` column
