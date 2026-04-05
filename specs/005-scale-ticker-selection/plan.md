# Implementation Plan: Scalable Ticker Selection

**Branch**: `[005-scale-ticker-selection]` | **Date**: 2026-04-05 | **Spec**: [spec.md](/home/bog/Documents/finance_metrics_fetch/specs/005-scale-ticker-selection/spec.md)
**Input**: Feature specification from `/specs/005-scale-ticker-selection/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See
`.specify/templates/plan-template.md` for the execution workflow.

## Summary

Replace the current ticker card grid with a search-first selector that scales to
larger symbol sets, preserves recent context through a compact quick-access
watchlist, supports index-based filtering plus compact trend summaries, and
reduces chart-control and status noise while making VIX read as calmer, clearer
chart context rather than a competing series.

## Technical Context

**Language/Version**: TypeScript 5.x and Svelte 5  
**Primary Dependencies**: SvelteKit, Lightweight Charts, existing shadcn-svelte primitives, existing dashboard data loaders  
**Storage**: Versioned repository files under `data/` and `config/tickers.json`, plus browser local storage for UI preferences  
**Testing**: `cd ui && npm run check`, `cd ui && npm run test`, `cd ui && npm run build`  
**Target Platform**: Static GitHub Pages dashboard for desktop and mobile browsers  
**Project Type**: Static web application  
**Performance Goals**: Ticker discovery remains responsive with 100 published symbols; search and filter changes update visible results immediately without route reloads; VIX remains legible without adding chart interaction friction  
**Constraints**: No backend, no live data source, no new workflow changes, preserve the current chart workflow and constituent workspace, keep the change reviewable as one UI refinement, and prefer removing bottom-of-page status noise over adding new status surfaces  
**Scale/Scope**: One dashboard route, one chart workspace, shared dashboard data helpers, local preference state, and unit tests for dashboard loading and state ordering

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Does the design preserve simple public interfaces and place complexity inside
  deep modules rather than scattering it across layers?
- Yes. Search, watchlist, filter derivation, compact row metadata, quieter
  status presentation, and VIX display rules will live in dashboard data
  helpers and focused UI components rather than expanding the route into more
  ad hoc state logic.
- Is the planned scope the smallest high-leverage slice that delivers visible
  value without speculative abstraction?
- Yes. The work only replaces the ticker-selection experience and keeps the
  chart workspace, route structure, and published data model intact.
- Is the planned change small enough to review and validate confidently as one
  logical unit of value?
- Yes. The slice is one coherent UI improvement: scalable ticker discovery for
  the existing dashboard.
- Can the implementation land as one logical change in one pull request with
  exactly one commit?
- Yes. The feature branch will be squashed before merge if needed to preserve
  the one-commit pull request rule.
- What command-line verification, build, or automated test steps will prove the
  change works before completion?
- `cd ui && npm run check`
- `cd ui && npm run test`
- `cd ui && npm run build`
- Are documentation and naming expectations clear enough to keep the result
  concise and professional?
- Yes. The UI vocabulary will stay compact and direct: `Find ticker`,
  `Recently viewed`, `Timeframe`, `All`, `S&P 500`, and `Nasdaq-100`.

## Project Structure

### Documentation (this feature)

```text
specs/005-scale-ticker-selection/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── tasks.md
```

### Source Code (repository root)

```text
specs/
└── 005-scale-ticker-selection/
ui/
├── src/
│   ├── lib/
│   │   ├── charts/
│   │   ├── components/
│   │   └── data/
│   └── routes/
└── tests/
    └── unit/
```

**Structure Decision**: Keep the feature in the existing static UI by extending
dashboard data derivation, replacing the ticker selector UI, refining chart
series presentation, and updating the single dashboard route plus unit tests.
Avoid adding new routes or new storage surfaces beyond local preferences.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
