# Implementation Plan: Command Center Finder

**Branch**: `[007-command-center-finder]` | **Date**: 2026-04-05 | **Spec**: [spec.md](/home/bog/Documents/finance_metrics_fetch/specs/007-command-center-finder/spec.md)
**Input**: Feature specification from `/specs/007-command-center-finder/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See
`.specify/templates/plan-template.md` for the execution workflow.

## Summary

Collapse ticker search, filter, and browsing into one command-center finder at
the top-right dashboard header as an opaque modal, reclaim vertical space for a larger chart,
promote the active ticker and latest price into the header, and keep chart
context lighter and more truthful with clean legend treatment, compact tooltip
lines, keyboard result navigation, percentage-based finder changes, and quieter
status behavior.

## Technical Context

**Language/Version**: TypeScript 5.x and Svelte 5  
**Primary Dependencies**: SvelteKit, Lightweight Charts, existing dashboard data loaders, existing shadcn-svelte primitives  
**Storage**: Versioned repository files under `data/` and `config/tickers.json`, plus browser local storage for UI preferences  
**Testing**: `cd ui && npm run check`, `cd ui && npm run test`, `cd ui && npm run build`  
**Target Platform**: Static GitHub Pages dashboard for desktop and mobile browsers  
**Project Type**: Static web application  
**Performance Goals**: Finder open and search remain immediate for the published symbol universe; keyboard shortcut opens finder without route changes; modal interaction stays keyboard-friendly; chart readability improves while preserving smooth hover and selection behavior  
**Constraints**: No backend, no live quotes, no new routes, no new external component dependencies, preserve the separate constituents workspace, keep the change reviewable as one command-center refinement  
**Scale/Scope**: One dashboard route, one command-center surface for ticker discovery, one chart component, shared dashboard data helpers, local preference handling, and unit tests for route and dashboard state

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Does the design preserve simple public interfaces and place complexity inside
  deep modules rather than scattering it across layers?
- Yes. Finder state and timeframe-aware result derivation stay in dashboard
  data helpers and one focused finder component rather than spreading logic
  across multiple visible controls.
- Is the planned scope the smallest high-leverage slice that delivers visible
  value without speculative abstraction?
- Yes. The slice replaces the multi-zone ticker selection pattern with one
  unified finder and uses reclaimed space to improve the existing chart surface.
- Is the planned change small enough to review and validate confidently as one
  logical unit of value?
- Yes. The branch delivers one coherent dashboard simplification centered on
  ticker navigation and header/chart clarity.
- Can the implementation land as one logical change in one pull request with
  exactly one commit?
- Yes. The feature branch can be squashed before merge if intermediate commits
  are used during implementation.
- What command-line verification, build, or automated test steps will prove the
  change works before completion?
- `cd ui && npm run check`
- `cd ui && npm run test`
- `cd ui && npm run build`
- Are documentation and naming expectations clear enough to keep the result
  concise and professional?
- Yes. User-facing terms remain short and direct: `Ticker Finder`, `All`,
  `S&P 500`, `Nasdaq-100`, `Vol`, and the active ticker header.

## Project Structure

### Documentation (this feature)

```text
specs/007-command-center-finder/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── tasks.md
```

### Source Code (repository root)

```text
specs/
└── 007-command-center-finder/
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

**Structure Decision**: Keep the change inside the existing static UI. Add one
focused search-modal component, extend dashboard-state derivation for finder tabs
and timeframe-aware percentage summaries, update the main dashboard route and chart
presentation, and cover the new behavior with existing unit-test areas.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
