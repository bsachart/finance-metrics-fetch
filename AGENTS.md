# finance_metrics_fetch Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-04-06

## Active Technologies
- TypeScript 5.x, SvelteKit on Node.js 20+ + SvelteKit, `@sveltejs/adapter-static`, `shadcn-svelte`, Lightweight Charts, Papa Parse, Vitest (002-market-ui)
- Static repository files copied from `data/` and `config/tickers.json` into the UI build (002-market-ui)
- Python 3.12 with type hints + uv, Ruff, Polars, yfinance, requests, Beautiful Soup (001-config-market-fetch)
- Versioned plain files in repository directories (JSON and CSV) (001-config-market-fetch)
- TypeScript 5.x and Svelte 5 for the static UI, Python 3.12 for published data generation + SvelteKit, `@sveltejs/adapter-static`, Lightweight Charts, Papa Parse, Polars (003-simplify-market-ui)
- Versioned repository files under `data/` and `config/tickers.json`, including dated constituent snapshots, copied into `ui/static/published/` during build (003-simplify-market-ui)
- TypeScript 5.x and Svelte 5 for the static UI, YAML for GitHub Actions workflow updates + SvelteKit, `@sveltejs/adapter-static`, Lightweight Charts, shadcn-svelte tabs/card primitives (004-simplify-chart-layout)
- Versioned repository files under `data/` and `config/tickers.json`, copied into the static UI at build time (004-simplify-chart-layout)
- TypeScript 5.x and Svelte 5 + SvelteKit, Lightweight Charts, existing shadcn-svelte primitives, existing dashboard data loaders (005-scale-ticker-selection)
- Versioned repository files under `data/` and `config/tickers.json`, plus browser local storage for UI preferences (005-scale-ticker-selection)
- TypeScript 5.x and Svelte 5 + SvelteKit, Lightweight Charts, existing dashboard data loaders, existing shadcn-svelte primitives (006-unify-analytics-workspace)
- TypeScript 6.x and Svelte 5 + SvelteKit, Lightweight Charts, existing dashboard data loaders, existing shadcn-svelte primitives (008-hud-dashboard)

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
- 008-hud-dashboard: Added TypeScript 6.x and Svelte 5 + SvelteKit, Lightweight Charts, existing dashboard data loaders, existing shadcn-svelte primitives
- 007-command-center-finder: Added TypeScript 5.x and Svelte 5 + SvelteKit, Lightweight Charts, existing dashboard data loaders, existing shadcn-svelte primitives
- 006-unify-analytics-workspace: Added TypeScript 5.x and Svelte 5 + SvelteKit, Lightweight Charts, existing dashboard data loaders, existing shadcn-svelte primitives

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
