# Implementation Plan: Unified Analytics Workspace

**Branch**: `[006-unify-analytics-workspace]` | **Date**: 2026-04-05 | **Spec**: [spec.md](/home/bog/Documents/finance_metrics_fetch/specs/006-unify-analytics-workspace/spec.md)
**Input**: Feature specification from `/specs/006-unify-analytics-workspace/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See
`.specify/templates/plan-template.md` for the execution workflow.

## Summary

Unify the ticker workspace around one shared timeframe context, make ticker-row
trends and chart context read from the same period, improve VIX readability and
tooltip hierarchy, and remove redundant status and chart noise so the dashboard
acts like one analytical tool instead of several loosely related widgets.

## Technical Context

**Language/Version**: TypeScript 5.x and Svelte 5  
**Primary Dependencies**: SvelteKit, Lightweight Charts, existing dashboard data loaders, existing shadcn-svelte primitives  
**Storage**: Versioned repository files under `data/` and `config/tickers.json`, plus browser local storage for UI preferences  
**Testing**: `cd ui && npm run check`, `cd ui && npm run test`, `cd ui && npm run build`  
**Target Platform**: Static GitHub Pages dashboard for desktop and mobile browsers  
**Project Type**: Static web application  
**Performance Goals**: Timeframe changes rerender chart and ticker summaries immediately without route reloads; hover context remains readable without added interaction steps; chart readability improves without slowing build or page load noticeably  
**Constraints**: No backend, no live market source, no new routes, no new persistence surfaces beyond existing browser preferences, preserve the existing constituent workspace, keep scope reviewable as one UI refinement  
**Scale/Scope**: One dashboard route, one chart component, ticker-list trend summaries, shared dashboard data helpers, and unit tests for dashboard state and route loading

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Does the design preserve simple public interfaces and place complexity inside
  deep modules rather than scattering it across layers?
- Yes. Shared timeframe derivation, row trend summaries, and tooltip grouping
  stay in data helpers and the chart component instead of adding ad hoc route logic.
- Is the planned scope the smallest high-leverage slice that delivers visible
  value without speculative abstraction?
- Yes. The work refines one existing workspace rather than reopening routing,
  data publication, or backend scope.
- Is the planned change small enough to review and validate confidently as one
  logical unit of value?
- Yes. The slice is one coherent analytics-readability improvement for the
  existing dashboard.
- Can the implementation land as one logical change in one pull request with
  exactly one commit?
- Yes. The feature branch can be squashed before merge if intermediate commits
  are used during development.
- What command-line verification, build, or automated test steps will prove the
  change works before completion?
- `cd ui && npm run check`
- `cd ui && npm run test`
- `cd ui && npm run build`
- Are documentation and naming expectations clear enough to keep the result
  concise and professional?
- Yes. User-facing labels will stay compact and direct, with no redundant
  helper copy where the visualization already communicates the meaning.

## Project Structure

### Documentation (this feature)

```text
specs/006-unify-analytics-workspace/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── tasks.md
```

### Source Code (repository root)

```text
specs/
└── 006-unify-analytics-workspace/
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

**Structure Decision**: Keep the change inside the existing static UI. Extend
dashboard data derivation for shared timeframe summaries, refine the chart and
status components, update the main dashboard route, and cover the new behavior
with existing unit-test areas. Avoid new routes or new storage abstractions.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
