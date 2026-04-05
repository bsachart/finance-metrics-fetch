# Finance Metrics Fetch

Finance Metrics Fetch refreshes repository-backed market datasets and publishes
a static dashboard for browsing ticker history and market constituents.

Live dashboard: https://bsachart.github.io/finance-metrics-fetch/

The repository includes:

- a Python refresh pipeline for OHLCV and constituent data
- published CSV and JSON artifacts under `data/`
- a static Svelte UI in `ui/` for GitHub Pages

## Documentation

- [spec.md](/home/bog/Documents/finance_metrics_fetch/spec.md): starting product
  and architecture guide
- [.specify/memory/constitution.md](/home/bog/Documents/finance_metrics_fetch/.specify/memory/constitution.md):
  repository governance principles for spec-kit

## Data Workflow

Set up the Python environment:

```bash
uv sync
```

Refresh the configured market and constituent datasets:

```bash
uv run python -m finance_metrics_fetch.cli refresh --config config/tickers.json
```

Refresh outputs:

- `data/market/<SYMBOL>.csv` for normalized OHLCV plus dollar-volume data
- `data/constituents/sp500.csv` for S&P 500 constituents
- `data/constituents/nasdaq100.csv` for Nasdaq-100 constituents
- `data/constituents/history/<INDEX>/<YYYY-MM-DD>.csv` for dated constituent snapshots
- `data/status/latest.json` for the latest refresh summary

## UI

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

- symbol and index discovery from packaged published assets
- a compact ticker-first layout with the main chart at the top of the ticker workflow
- a price, VIX, and dollar-volume chart with compact volume units
- VIX shown by default with a simple hide toggle
- local browser persistence for selected symbol, tab, lookback, bar period, index, and VIX toggle
- lookback presets such as `1W`, `1M`, `YTD`, `1Y`, and `5Y`
- bar aggregation controls for `1D`, `1W`, and `1M`, defaulting to `1M` lookback and daily bars
- separate `Tickers` and `Market Constituents` views
- dated constituent history files in the repository instead of per-row fetch timestamps

## Automation

The repository now includes
[`refresh-data.yml`](/home/bog/Documents/finance_metrics_fetch/.github/workflows/refresh-data.yml)
to refresh market and constituent data on GitHub Actions.

- default schedule: every 2 hours
- manual trigger: available through `workflow_dispatch`
- daily alternative: already commented in the workflow file if you want to
  switch from every 2 hours to once per day
- uses current GitHub Actions majors compatible with the Node 24 migration

The repository also includes
[`deploy-ui.yml`](/home/bog/Documents/finance_metrics_fetch/.github/workflows/deploy-ui.yml)
to build and deploy the static `ui/` app to GitHub Pages from `main`.

- Pages is configured to deploy with GitHub Actions workflow builds
- the workflow publishes the built `ui/build` artifact
- the workflow opts into the Node 24 JavaScript action runtime during the
  migration window

## Working Style

This repository follows the spec-kit constitution:

- Keep interfaces simple and modules deep
- Ship one logical change per pull request with exactly one commit
- Verify every change before calling it complete
- Prefer concise, professional technical writing and small, high-leverage scope
