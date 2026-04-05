# Project Spec

## Goal

Build a simple toolchain that extracts OHLCV market data from Yahoo Finance and
ticker lists from Wikipedia, stores the results in plain files, and presents
them in a web UI focused on quote volume, price, and volatility context.

## Product Direction

The product answers a narrow question: how does nominal trading activity compare
with price action and the VIX for a chosen set of tickers over time? The first
release should stay focused on historical exploration rather than screening,
alerts, or portfolio features.

## Data to Fetch

### Ticker History

- Source: Yahoo Finance
- The system extracts OHLCV history from Yahoo Finance for configured tickers
- Core fields: date, open, high, low, close, volume
- Derived field: quote volume (`close * volume`)
- Initial examples: `VOO`, `^VIX`
- Requirement: tickers MUST be defined in a config file rather than hardcoded

### Index Constituents

- Source: Wikipedia
- The system extracts ticker lists from Wikipedia pages
- Datasets:
  - S&P 500 constituents
  - Nasdaq-100 constituents
- Output format: CSV or Markdown, depending on which is clearer for downstream
  use

## Delivery Shape

### Fetch Layer

- Run from GitHub Actions on a schedule and on demand
- Produce deterministic file outputs suitable for repository storage or release
  artifacts
- Keep source-specific logic behind small interfaces so data providers can be
  swapped later without changing consumers

### Web UI

- Framework: Svelte
- Component system: `https://www.shadcn-svelte.com/`
- Charting library: TradingView Lightweight Charts
- Primary views:
  - price series
  - quote-volume histogram
  - VIX context series
- Initial UX goal: fast comparison and simple filtering, not a dense analytics
  workstation

## Suggested Repository Structure

```text
config/
  tickers.(json|yaml|toml)
data/
  market/
  constituents/
scripts/
  fetch/
web/
  src/
```

## Non-Goals for V1

- real-time streaming quotes
- brokerage integration
- backtesting engine
- portfolio management
- advanced user authentication

## Design Notes

- Keep modules deep and interfaces small
- Prefer plain files over premature database adoption
- Prefer a few high-value charts over a large dashboard
- Add complexity only when it clearly removes more complexity elsewhere
