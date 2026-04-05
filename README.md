# Finance Metrics Fetch

Finance Metrics Fetch is a small market-data project for extracting OHLCV data
from Yahoo Finance and ticker lists from Wikipedia, then storing normalized
datasets for a configured set of tickers. The current focus is the Python fetch
pipeline, generated data artifacts, and automated refreshes.

## Initial Scope

- Extract OHLCV history from Yahoo Finance for configured tickers such as
  `VOO` and `^VIX`
- Derive and store nominal volume (`close * volume`) alongside OHLCV data
- Extract S&P 500 and Nasdaq-100 ticker lists from Wikipedia
- Persist fetched datasets to repository-friendly files such as CSV and JSON
- Run scheduled and manual fetch workflows from GitHub Actions
- Publish normalized outputs that a later UI feature can consume

## Documentation

- [spec.md](/home/bog/Documents/finance_metrics_fetch/spec.md): starting product
  and architecture guide
- [.specify/memory/constitution.md](/home/bog/Documents/finance_metrics_fetch/.specify/memory/constitution.md):
  repository governance principles for spec-kit

## Current Python Workflow

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

Planned later:

- a separate UI feature for charting and GitHub Pages presentation

## GitHub Actions Schedule

The repository now includes
[`refresh-data.yml`](/home/bog/Documents/finance_metrics_fetch/.github/workflows/refresh-data.yml)
to refresh market and constituent data on GitHub Actions.

- default schedule: every 2 hours
- manual trigger: available through `workflow_dispatch`
- daily alternative: already commented in the workflow file if you want to
  switch from every 2 hours to once per day

## Working Style

This repository follows the spec-kit constitution:

- Keep interfaces simple and modules deep
- Ship one logical change per pull request with exactly one commit
- Verify every change before calling it complete
- Prefer concise, professional technical writing and small, high-leverage scope
