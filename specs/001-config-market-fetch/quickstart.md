# Quickstart: Config-Driven Market Fetch

## Prerequisites

- `uv` installed
- repository cloned locally

## 1. Install Python dependencies

```bash
uv sync
```

## 2. Configure tracked tickers

Edit:

```text
config/tickers.json
```

Include at least one benchmark ticker and one volatility-context ticker for the
initial UI.

## 3. Run a local refresh

```bash
uv run python -m finance_metrics_fetch.cli refresh --config config/tickers.json
```

Expected result:

- normalized market files written to `data/market/`
- constituent files written to `data/constituents/`
- refresh status written to `data/status/latest.json`
- constituent CSV files use the stable column order:
  `index_name,symbol,name,sector,sub_industry,source_url,fetched_at`

Example status check:

```bash
cat data/status/latest.json
```

## 4. Run verification

```bash
uv run ruff check .
uv run ruff format --check .
uv run pytest
```

## 5. Schedule refreshes through GitHub Actions

- push the feature to GitHub
- enable GitHub Actions for the repository
- use `.github/workflows/refresh-data.yml` for scheduled refreshes
- default schedule is every 2 hours
- swap the workflow cron to the commented daily option if you prefer once per day
- run the workflow manually with `workflow_dispatch` or wait for the schedule
