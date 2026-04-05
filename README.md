# Finance Metrics Fetch

Finance Metrics Fetch is a small market-data project for extracting OHLCV data
from Yahoo Finance and ticker lists from Wikipedia, then storing normalized
datasets for a configured set of tickers. It includes a Python refresh pipeline
and a static UI in `ui/` that packages the repository's published `data/`
artifacts for GitHub Pages.

## Initial Scope

- Extract OHLCV history from Yahoo Finance for configured tickers such as
  `VOO` and `^VIX`
- Derive and store nominal volume (`close * volume`) alongside OHLCV data
- Extract S&P 500 and Nasdaq-100 ticker lists from Wikipedia
- Persist fetched datasets to repository-friendly files such as CSV and JSON
- Run scheduled and manual fetch workflows from GitHub Actions
- Publish normalized outputs that the static UI can consume

## Documentation

- [spec.md](/home/bog/Documents/finance_metrics_fetch/spec.md): starting product
  and architecture guide
- [.specify/memory/constitution.md](/home/bog/Documents/finance_metrics_fetch/.specify/memory/constitution.md):
  repository governance principles for spec-kit

## Current Data Workflow

Sync the Python environment:

```bash
uv sync
```

Refresh the configured market and constituent datasets:

```bash
uv run python -m finance_metrics_fetch.cli refresh --config config/tickers.json
```

Current refresh outputs:

- `data/market/<SYMBOL>.csv` for normalized OHLCV plus quote volume
- `data/constituents/sp500.csv` for S&P 500 constituents
- `data/constituents/nasdaq100.csv` for Nasdaq-100 constituents
- `data/status/latest.json` for the latest refresh summary

Constituent CSV schema:

- `index_name`
- `symbol`
- `name`
- `sector`
- `sub_industry`
- `source_url`
- `fetched_at`

## UI Workflow

The repository includes a static UI in [ui/](/home/bog/Documents/finance_metrics_fetch/ui)
that reads packaged copies of the committed `data/` files and
`config/tickers.json`.

Install and verify the UI:

```bash
cd ui
npm install
npm run check
npm run test
npm run build
```

The dashboard provides:

- symbol selection from the published ticker config
- price history with VIX context
- quote-volume history
- histogram-style price and quote-volume views
- constituent browsing for S&P 500 and Nasdaq-100

## GitHub Actions Schedule

The repository now includes
[`refresh-data.yml`](/home/bog/Documents/finance_metrics_fetch/.github/workflows/refresh-data.yml)
to refresh market and constituent data on GitHub Actions.

- default schedule: every 2 hours
- manual trigger: available through `workflow_dispatch`
- daily alternative: already commented in the workflow file if you want to
  switch from every 2 hours to once per day

## GitHub Pages

The repository also includes
[`deploy-ui.yml`](/home/bog/Documents/finance_metrics_fetch/.github/workflows/deploy-ui.yml)
to build and deploy the static `ui/` app to GitHub Pages from `main`.

## Working Style

This repository follows the spec-kit constitution:

- Keep interfaces simple and modules deep
- Ship one logical change per pull request with exactly one commit
- Verify every change before calling it complete
- Prefer concise, professional technical writing and small, high-leverage scope
