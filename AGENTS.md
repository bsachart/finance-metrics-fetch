# finance_metrics_fetch Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-04-05

## Active Technologies
- TypeScript 5.x, SvelteKit on Node.js 20+ + SvelteKit, `@sveltejs/adapter-static`, `shadcn-svelte`, Lightweight Charts, Papa Parse, Vitest (002-market-ui)
- Static repository files copied from `data/` and `config/tickers.json` into the UI build (002-market-ui)
- Python 3.12 with type hints + uv, Ruff, Polars, yfinance, requests, Beautiful Soup (001-config-market-fetch)
- Versioned plain files in repository directories (JSON and CSV) (001-config-market-fetch)

## Project Structure

```text
config/
data/
src/
tests/
.github/workflows/
ui/
```

## Commands

- `uv sync`
- `uv run python -m finance_metrics_fetch.cli refresh --config config/tickers.json`
- `uv run ruff check .`
- `uv run ruff format --check .`
- `uv run pytest`
- `cd ui && npm install`
- `cd ui && npm run check`
- `cd ui && npm run test`
- `cd ui && npm run build`

## Code Style

Python 3.12 with type hints: Follow standard conventions and keep dataframe work in Polars, not pandas.

## Recent Changes
- 002-market-ui: Added the static `ui/` dashboard, packaged data loading, chart views, histogram views, constituent browsing, and GitHub Pages deployment workflow
- 001-config-market-fetch: Added the typed Python fetch pipeline, normalized data artifacts, and scheduled refresh automation

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
