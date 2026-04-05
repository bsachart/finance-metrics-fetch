# Implementation Plan: HUD-Centric Dashboard

**Branch**: `[008-hud-dashboard]` | **Date**: 2026-04-05 | **Spec**: [spec.md](/home/bog/Documents/finance_metrics_fetch/specs/008-hud-dashboard/spec.md)  
**Input**: Feature specification from `/specs/008-hud-dashboard/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See
`.specify/templates/plan-template.md` for the execution workflow.

## Summary

Replace floating chart tooltip and legend behavior with one stable HUD under the
chart controls, keep the chart canvas visually quieter, tighten left/right scale
ownership, and regroup the ticker finder inside the ticker workspace so the page
reads as one analytical console.

## Technical Context

**Language/Version**: TypeScript 6.x and Svelte 5  
**Primary Dependencies**: SvelteKit, Lightweight Charts, existing dashboard data loaders, existing shadcn-svelte primitives  
**Storage**: Versioned repository files under `data/` and `config/tickers.json`, plus browser local storage for UI preferences  
**Testing**: `cd ui && npm run check`, `cd ui && npm run test`, `cd ui && npm run build`  
**Target Platform**: Static GitHub Pages dashboard for desktop and mobile browsers  
**Project Type**: Static web application  
**Performance Goals**: HUD updates should feel immediate while moving across chart bars; chart hover should remain smooth; page layout should remain responsive without introducing new route transitions  
**Constraints**: No backend, no live streaming data, no new routing, keep the change as one logical dashboard refinement, preserve the existing ticker finder modal, and avoid reintroducing chart clutter through replacement chrome  
**Scale/Scope**: One dashboard route, one chart component, one HUD component or HUD section, shared dashboard formatting helpers, and unit/build verification

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Does the design preserve simple public interfaces and place complexity inside
  deep modules rather than scattering it across layers?
- Yes. The route keeps a small workspace interface while chart hover-to-HUD
  translation stays inside chart and data helpers.
- Is the planned scope the smallest high-leverage slice that delivers visible
  value without speculative abstraction?
- Yes. The feature only changes how chart data is presented and how the finder
  is anchored, without introducing new routes or unrelated workflows.
- Is the planned change small enough to review and validate confidently as one
  logical unit of value?
- Yes. The branch delivers one dashboard refinement centered on HUD stability,
  chart cleanliness, and control alignment.
- Can the implementation land as one logical change in one pull request with
  exactly one commit?
- Yes. The feature can be committed and merged as one HUD-focused change.
- What command-line verification, build, or automated test steps will prove the
  change works before completion?
- `cd ui && npm run check`
- `cd ui && npm run test`
- `cd ui && npm run build`
- Are documentation and naming expectations clear enough to keep the result
  concise and professional?
- Yes. User-facing terms remain short and direct: `Data as of`, `Find Ticker`,
  `Timeframe`, `Bars`, `Show VIX`, and compact HUD value labels.

## Project Structure

### Documentation (this feature)

```text
specs/008-hud-dashboard/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── tasks.md
```

### Source Code (repository root)

```text
specs/
└── 008-hud-dashboard/
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
the chart module to emit stable HUD state, add or adjust one HUD presentation
surface in the route, move the finder trigger into the ticker workspace control
zone, and cover the behavior with existing unit-test areas.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
