# Contract: Published Assets For UI

## Required Input Files

The UI build and runtime package rely on these repository files:

- `data/status/latest.json`
- `data/market/*.csv`
- `data/constituents/sp500.csv`
- `data/constituents/nasdaq100.csv`
- `config/tickers.json`

## Build Packaging Rules

- The UI build must copy the required repository data files into the published site artifact.
- The published site must not depend on reading files from outside the built `ui/` output.
- The published site must include enough metadata to render symbol selection labels from
  `config/tickers.json`.

## Runtime Consumption Rules

- The site reads packaged JSON and CSV assets only.
- The site does not call Yahoo Finance, Wikipedia, or any custom backend at runtime.
- Missing packaged assets must produce a visible user-facing error state.

## Derived View Rules

- Market views derive price and nominal quote volume series from the packaged market files.
- VIX context derives from the packaged `^VIX` market file when present.
- Histogram views derive bucketed distributions from the selected symbol's packaged market history.
