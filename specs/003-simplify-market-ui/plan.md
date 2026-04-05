# Implementation Plan: Simplified Market UI

**Branch**: `[003-simplify-market-ui]` | **Date**: 2026-04-05 | **Spec**: [spec.md](/home/bog/Documents/finance_metrics_fetch/specs/003-simplify-market-ui/spec.md)
**Input**: Feature specification from `/specs/003-simplify-market-ui/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See
`.specify/templates/plan-template.md` for the execution workflow.

## Summary

Simplify the static dashboard by replacing the line-based market view with a
single combined OHLC/candlestick chart that includes a normalized nominal-volume
pane, keeping histograms in a lighter-weight market analysis layout, moving
constituents into a dedicated indices tab, deriving published symbols and
indices from packaged repository artifacts instead of hardcoded page lists, and
replacing volatile `fetched_at` fields with dated constituent snapshot files.

## Technical Context

**Language/Version**: TypeScript 5.x and Svelte 5 for the static UI, Python 3.12 for published data generation  
**Primary Dependencies**: SvelteKit, `@sveltejs/adapter-static`, Lightweight Charts, Papa Parse, Polars  
**Storage**: Versioned repository files under `data/` and `config/tickers.json`, including dated constituent snapshots, copied into `ui/static/published/` during build  
**Testing**: Vitest, `svelte-check`, static production builds, `pytest` for constituent export changes  
**Target Platform**: Static GitHub Pages site plus the existing local Python refresh workflow  
**Project Type**: Static web application with a supporting CLI data pipeline  
**Performance Goals**: Initial market view loads in under 10 seconds; switching symbols or indices updates visible content in under 2 seconds  
**Constraints**: No runtime backend, no hardcoded symbol/index page lists, no unnecessary schema churn, keep modules small and direct  
**Scale/Scope**: One dashboard route, a small configured symbol set, a small index set, repository-published daily market files, and constituent datasets extended to config-driven discovery plus day-based history

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Does the design preserve simple public interfaces and place complexity inside
  deep modules rather than scattering it across layers?
- Yes. Discovery lives in one packaged manifest, chart-series transformation stays
  in `ui/src/lib/data/market.ts`, and schema/history changes stay inside the Python
  normalization/export modules.
- Is the planned scope the smallest high-leverage slice that delivers visible
  value without speculative abstraction?
- Yes. The change removes navigation weight, keeps only requested visualizations,
  and introduces only one new shared artifact: a published asset manifest.
- Is the planned change small enough to review and validate confidently as one
  logical unit of value?
- Yes. It is one cohesive simplification feature spanning the published schema and
  the consuming dashboard.
- Can the implementation land as one logical change in one pull request with
  exactly one commit?
- Yes. The work is one user-visible improvement with tightly related data-shape
  cleanup.
- What command-line verification, build, or automated test steps will prove the
  change works before completion?
- `uv run pytest`
- `cd ui && npm run check`
- `cd ui && npm run test`
- `cd ui && npm run build`
- Are documentation and naming expectations clear enough to keep the result
  concise and professional?
- Yes. Terms will use existing repository vocabulary: symbols, indices,
  constituents, market history, and published assets.

## Project Structure

### Documentation (this feature)

```text
specs/003-simplify-market-ui/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (repository root)

```text
config/
├── tickers.json
data/
├── constituents/
│   └── history/
├── market/
└── status/
src/
└── finance_metrics_fetch/
    ├── models.py
    ├── publish/
    │   └── artifacts.py
    ├── sources/
    │   └── wikipedia.py
    └── transforms/
        └── datasets.py
tests/
├── integration/
└── unit/
ui/
├── scripts/
│   └── copy-data.mjs
├── src/
│   ├── lib/
│   │   ├── charts/
│   │   ├── components/
│   │   └── data/
│   └── routes/
└── tests/
```

**Structure Decision**: Keep the existing split between Python data production and
the static UI. Add discovery and schema cleanup at the repository-data boundary,
then keep the UI changes contained to chart, loader, and route modules.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
