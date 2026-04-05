# Contract: Refresh CLI

## Purpose

Define the repository-local command interface for running refreshes and publish
preparation.

## Commands

### Refresh all configured datasets

```bash
uv run python -m finance_metrics_fetch.cli refresh
```

### Refresh with explicit config path

```bash
uv run python -m finance_metrics_fetch.cli refresh --config config/tickers.json
```

### Rebuild publishable artifacts from existing raw outputs

```bash
uv run python -m finance_metrics_fetch.cli publish
```

## Contract Rules

- `refresh` reads ticker configuration, fetches source data, writes normalized
  outputs, and emits a run summary
- `publish` reads the latest successful normalized outputs and writes frontend
  artifacts
- both commands exit with code `0` on success and non-zero on failure
- partial failures must still produce a readable summary naming failed sources
  and symbols

## Observable Output

- concise terminal summary for human operators
- machine-readable run result file for the latest refresh status
