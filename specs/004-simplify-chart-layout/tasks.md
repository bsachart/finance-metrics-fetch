# Tasks: Simplify Chart Layout

**Input**: Design documents from `/specs/004-simplify-chart-layout/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Verification**: Every task set MUST include reproducible verification work.
Automated tests are preferred when applicable, but lint, build, or command-line
validation tasks are also required when tests are not the primary mechanism.

**Organization**: Tasks are grouped by user story to enable independent
implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., `US1`, `US2`, `US3`)
- Include exact file paths in descriptions

## Path Conventions

- Static UI: `ui/src/`, `ui/tests/`
- Workflow config: `.github/workflows/`
- Repository docs: repository root and `specs/004-simplify-chart-layout/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Align docs and workflow support for the simplification branch

- [X] T001 Update workflow runtime compatibility in `/home/bog/Documents/finance_metrics_fetch/.github/workflows/deploy-ui.yml` and `/home/bog/Documents/finance_metrics_fetch/.github/workflows/refresh-data.yml`
- [X] T002 [P] Update repository guidance for the current deployment setup in `/home/bog/Documents/finance_metrics_fetch/README.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the shared route and chart shape needed by all user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 [P] Add shared dashboard state and VIX-series helpers in `/home/bog/Documents/finance_metrics_fetch/ui/src/lib/data/market.ts` and `/home/bog/Documents/finance_metrics_fetch/ui/src/lib/data/types.ts`
- [X] T004 [P] Extend the main chart to support an optional VIX overlay in `/home/bog/Documents/finance_metrics_fetch/ui/src/lib/charts/price-chart.svelte`
- [X] T005 [P] Add route-level test coverage for simplified navigation and VIX visibility state in `/home/bog/Documents/finance_metrics_fetch/ui/tests/unit/routes/page-load.test.ts`

**Checkpoint**: Foundation ready. User story implementation can now begin.

---

## Phase 3: User Story 1 - Read The Market Quickly (Priority: P1) 🎯 MVP

**Goal**: Put the main ticker-analysis chart and its controls at the top of the page with less framing noise

**Independent Verification**: Open the ticker view and confirm the chart, ticker selector, lookback controls, and bar-period controls appear before status or constituent content.

### Verification for User Story 1

- [X] T006 [P] [US1] Add market-view layout coverage in `/home/bog/Documents/finance_metrics_fetch/ui/tests/unit/routes/page-load.test.ts`

### Implementation for User Story 1

- [X] T007 [P] [US1] Simplify ticker selection presentation in `/home/bog/Documents/finance_metrics_fetch/ui/src/lib/components/symbol-selector.svelte`
- [X] T008 [P] [US1] Remove oversized heading and secondary market framing in `/home/bog/Documents/finance_metrics_fetch/ui/src/routes/+page.svelte`
- [X] T009 [US1] Rebuild the ticker workspace so the chart renders first in `/home/bog/Documents/finance_metrics_fetch/ui/src/routes/+page.svelte`

**Checkpoint**: User Story 1 should now be fully functional and independently verifiable.

---

## Phase 4: User Story 2 - Keep VIX Visible But Optional (Priority: P2)

**Goal**: Show VIX on the main chart by default and let users hide or re-show it with one control

**Independent Verification**: Open a non-VIX ticker, confirm VIX appears by default, toggle it off and back on, and confirm other chart settings remain unchanged.

### Verification for User Story 2

- [X] T010 [P] [US2] Add market-series coverage for VIX overlay composition in `/home/bog/Documents/finance_metrics_fetch/ui/tests/unit/data/market.test.ts`

### Implementation for User Story 2

- [X] T011 [P] [US2] Add a compact VIX visibility control and status messaging in `/home/bog/Documents/finance_metrics_fetch/ui/src/routes/+page.svelte`
- [X] T012 [US2] Remove the separate VIX section and drive VIX display directly from the chart in `/home/bog/Documents/finance_metrics_fetch/ui/src/routes/+page.svelte` and `/home/bog/Documents/finance_metrics_fetch/ui/src/lib/components/vix-context.svelte`
- [X] T013 [US2] Render the selected ticker with optional VIX context in `/home/bog/Documents/finance_metrics_fetch/ui/src/lib/charts/price-chart.svelte`

**Checkpoint**: User Story 2 should now be fully functional and independently verifiable.

---

## Phase 5: User Story 3 - Navigate Tickers And Constituents Separately (Priority: P3)

**Goal**: Split ticker analysis and constituent browsing into clear top-level sections

**Independent Verification**: Switch between `Tickers` and `Market Constituents` and confirm each section only shows the controls and content relevant to that job.

### Verification for User Story 3

- [X] T014 [P] [US3] Add route coverage for separate ticker and constituent workspaces in `/home/bog/Documents/finance_metrics_fetch/ui/tests/unit/routes/page-load.test.ts`

### Implementation for User Story 3

- [X] T015 [P] [US3] Adjust dashboard option loading for ticker-first and constituent-first navigation in `/home/bog/Documents/finance_metrics_fetch/ui/src/lib/data/dashboard.ts`
- [X] T016 [P] [US3] Simplify constituent table messaging for the dedicated workspace in `/home/bog/Documents/finance_metrics_fetch/ui/src/lib/components/constituent-table.svelte`
- [X] T017 [US3] Rework the page navigation to `Tickers` and `Market Constituents` in `/home/bog/Documents/finance_metrics_fetch/ui/src/routes/+page.svelte`

**Checkpoint**: All user stories should now be independently functional.

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup and verification across the feature

- [X] T018 [P] Remove dead market-summary and separate-VIX presentation paths in `/home/bog/Documents/finance_metrics_fetch/ui/src/lib/components/market-summary.svelte` and related imports
- [X] T019 [P] Update feature walkthrough notes in `/home/bog/Documents/finance_metrics_fetch/specs/004-simplify-chart-layout/quickstart.md`
- [X] T020 Run `cd /home/bog/Documents/finance_metrics_fetch/ui && npm run check && npm run test && npm run build`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies. Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories.
- **User Stories (Phases 3-5)**: Depend on Foundational completion and should land in priority order.
- **Final Phase**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational. No dependencies on other stories.
- **User Story 2 (P2)**: Starts after Foundational and builds on the simplified ticker workspace.
- **User Story 3 (P3)**: Starts after Foundational and reuses the shared route state.

### Parallel Opportunities

- T001 and T002 can run in parallel.
- T003-T005 can run in parallel within Foundational.
- T007 and T008 can run in parallel before T009.
- T011 and T013 can run in parallel before T012 integration cleanup.
- T015 and T016 can run in parallel before T017.
- T018 and T019 can run in parallel before final verification.

## Implementation Strategy

### MVP First

1. Complete Setup and Foundational work.
2. Deliver User Story 1 and verify the ticker-first layout.
3. Add VIX overlay control.
4. Finish the separate constituent workspace.

### Pull Request Discipline

1. Keep the branch scoped to this one simplification feature.
2. Complete verification before review.
3. Merge as exactly one commit.
