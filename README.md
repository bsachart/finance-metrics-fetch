# Finance Metrics Fetch

Finance Metrics Fetch is a small market-data project for extracting OHLCV data
from Yahoo Finance and ticker lists from Wikipedia, then visualizing price and
volume history for a configured set of tickers. The first goal is to compare
OHLCV-derived quote volume against price action and the VIX, then present the
data in a lightweight web UI.

## Initial Scope

- Extract OHLCV history from Yahoo Finance for configured tickers such as
  `VOO` and `^VIX`
- Derive and store nominal volume (`close * volume`) alongside OHLCV data
- Extract S&P 500 and Nasdaq-100 ticker lists from Wikipedia
- Persist fetched datasets to repository-friendly files such as CSV or Markdown
- Run scheduled and manual fetch workflows from GitHub Actions
- Visualize price, quote-volume histograms, and VIX context in a Svelte UI

## Documentation

- [spec.md](/home/bog/Documents/finance_metrics_fetch/spec.md): starting product
  and architecture guide
- [.specify/memory/constitution.md](/home/bog/Documents/finance_metrics_fetch/.specify/memory/constitution.md):
  repository governance principles for spec-kit

## Working Style

This repository follows the spec-kit constitution:

- Keep interfaces simple and modules deep
- Ship one logical change per pull request with exactly one commit
- Verify every change before calling it complete
- Prefer concise, professional technical writing and small, high-leverage scope
