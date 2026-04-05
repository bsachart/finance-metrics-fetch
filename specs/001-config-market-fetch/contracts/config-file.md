# Contract: Ticker Configuration File

## Purpose

Define the external file contract for selecting which tickers are refreshed and
published.

## File Location

`config/tickers.json`

## Contract

```json
{
  "tickers": [
    {
      "symbol": "VOO",
      "label": "Vanguard S&P 500 ETF",
      "enabled": true,
      "role": "benchmark",
      "source": "yahoo_finance"
    },
    {
      "symbol": "^VIX",
      "label": "CBOE Volatility Index",
      "enabled": true,
      "role": "volatility",
      "source": "yahoo_finance"
    }
  ]
}
```

## Rules

- `tickers` is required and must contain at least one enabled entry
- `symbol`, `label`, `role`, and `source` are required for each entry
- duplicate enabled symbols are invalid
- unknown `role` values are invalid
- the initial implementation supports `yahoo_finance` as the source value

## Failure Behavior

- invalid configuration stops the refresh before source calls begin
- error output must identify the invalid field and record
