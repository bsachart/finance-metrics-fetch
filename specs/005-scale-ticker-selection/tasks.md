# Tasks: Scalable Ticker Selection

**Input**: Design documents from `/specs/005-scale-ticker-selection/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Verification**: Every task set includes reproducible command-line validation
through `cd ui && npm run check`, `cd ui && npm run test`, and
`cd ui && npm run build`.

**Organization**: Tasks are grouped by user story to enable independent
implementation and verification.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., `US1`, `US2`, `US3`)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare shared selectors and dashboard state hooks for the new flow.

- [x] T001 Create feature planning artifacts in `specs/005-scale-ticker-selection/`
- [x] T002 Review existing ticker selection and dashboard state boundaries in `ui/src/routes/+page.svelte` and `ui/src/lib/data/dashboard.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add shared discovery data and local-state primitives used by all stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T003 Add ticker discovery, filter, recent-watchlist, and compact-row types in `ui/src/lib/data/types.ts`
- [x] T004 Implement shared ticker discovery derivation helpers in `ui/src/lib/data/dashboard.ts`
- [x] T005 [P] Add or update unit coverage for shared discovery helpers in `ui/tests/unit/data/dashboard.test.ts`
- [x] T006 Update route-level preference restoration and persistence scaffolding in `ui/src/routes/+page.svelte`

**Checkpoint**: Shared discovery state is ready for user-story work.

---

## Phase 3: User Story 1 - Find a ticker quickly (Priority: P1) 🎯 MVP

**Goal**: Replace the large ticker card grid with a search-first selector that updates the active ticker clearly and immediately.

**Independent Verification**: Search by symbol or company name, select a result,
and confirm the title and chart update to the selected ticker.

### Verification for User Story 1

- [x] T007 [P] [US1] Add route or load-path verification for search selection behavior in `ui/tests/unit/routes/page-load.test.ts`
- [x] T008 [P] [US1] Add dashboard-state verification for restoring a selected ticker from local preferences in `ui/tests/unit/data/dashboard.test.ts`

### Implementation for User Story 1

- [x] T009 [P] [US1] Create a compact searchable ticker selector component in `ui/src/lib/components/ticker-search.svelte`
- [x] T010 [P] [US1] Create a compact ticker result list component in `ui/src/lib/components/ticker-list.svelte`
- [x] T011 [US1] Replace the primary ticker card selector flow in `ui/src/routes/+page.svelte`
- [x] T012 [US1] Ensure the ticker workspace title and active context update from the current selection in `ui/src/routes/+page.svelte`
- [x] T013 [US1] Add empty-result handling and compact search messaging in `ui/src/routes/+page.svelte`

**Checkpoint**: User Story 1 is fully functional and independently verifiable.

---

## Phase 4: User Story 2 - Keep recent context visible (Priority: P2)

**Goal**: Add a compact recently viewed watchlist so repeat switching no longer requires repeated searches.

**Independent Verification**: Open several symbols, confirm they appear in the
recent strip, reload the page, and confirm the recent strip is restored.

### Verification for User Story 2

- [x] T014 [P] [US2] Add persistence verification for recent watchlist state in `ui/tests/unit/data/dashboard.test.ts`
- [x] T015 [P] [US2] Add state-level verification for recent watchlist behavior in `ui/tests/unit/data/dashboard.test.ts`

### Implementation for User Story 2

- [x] T016 [P] [US2] Create a compact recent-watchlist component in `ui/src/lib/components/recent-tickers.svelte`
- [x] T017 [US2] Extend dashboard preference handling for recent tickers in `ui/src/routes/+page.svelte`
- [x] T018 [US2] Integrate the recent-watchlist strip into the ticker workspace in `ui/src/routes/+page.svelte`
- [x] T019 [US2] Strengthen active ticker styling across search results and recent tickers in `ui/src/lib/components/ticker-list.svelte` and `ui/src/lib/components/recent-tickers.svelte`

**Checkpoint**: User Story 2 is fully functional and independently verifiable.

---

## Phase 5: User Story 3 - Filter and scan the full universe (Priority: P3)

**Goal**: Add compact filters, trend summaries, calmer status treatment, and clearer VIX context for scalable scanning.

**Independent Verification**: Apply filters, inspect compact rows with trend
indicators, confirm volume uses quieter colors, confirm VIX is easier to read,
and confirm status noise is reduced.

### Verification for User Story 3

- [x] T020 [P] [US3] Add discovery-filter verification in `ui/tests/unit/data/dashboard.test.ts`
- [x] T021 [P] [US3] Add chart and workspace presentation verification in `ui/tests/unit/routes/page-load.test.ts`

### Implementation for User Story 3

- [x] T022 [P] [US3] Create compact filter chips or segmented controls in `ui/src/lib/components/ticker-filters.svelte`
- [x] T023 [P] [US3] Add compact row trend-summary rendering in `ui/src/lib/components/ticker-list.svelte`
- [x] T024 [US3] Rework the control header hierarchy in `ui/src/routes/+page.svelte` to emphasize `Timeframe` over bar period
- [x] T025 [US3] Update the chart volume styling to use a quieter non-red-green treatment in `ui/src/lib/charts/price-chart.svelte`
- [x] T026 [US3] Improve VIX presentation with clearer baseline, area treatment, synchronized hover values, and threshold emphasis in `ui/src/lib/charts/price-chart.svelte`
- [x] T027 [US3] Move the latest successful refresh time into compact header context and suppress empty failure UI in `ui/src/routes/+page.svelte` and `ui/src/lib/components/status-card.svelte`

**Checkpoint**: All user stories are independently functional.

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Final simplification, documentation, and full validation.

- [x] T028 [P] Review new components and data helpers for unnecessary complexity in `ui/src/lib/components/` and `ui/src/lib/data/`
- [x] T029 Update repository documentation if dashboard behavior changed materially in `README.md`
- [x] T030 Run full verification from `specs/005-scale-ticker-selection/quickstart.md`
- [x] T031 Mark completed tasks and record final verification in `specs/005-scale-ticker-selection/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Starts immediately.
- **Foundational (Phase 2)**: Depends on Setup and blocks all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational completion.
- **Final Phase**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational. No dependency on other stories.
- **User Story 2 (P2)**: Starts after Foundational and builds on the active ticker flow from US1.
- **User Story 3 (P3)**: Starts after Foundational and integrates with the selector and recent-watchlist work from US1 and US2.

### Parallel Opportunities

- T005 can run in parallel with T006 after T003 and T004 are defined.
- T009 and T010 can run in parallel within US1.
- T014 and T015 can run in parallel within US2.
- T022 and T023 can run in parallel within US3.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup.
2. Complete Foundational work.
3. Complete User Story 1.
4. Verify search-first ticker selection independently.

### Incremental Delivery

1. Add search-first selection.
2. Add recent watchlist persistence.
3. Add filters, trend summaries, and lower-noise presentation.
4. Run full verification and documentation updates.

### Pull Request Discipline

1. Keep the branch scoped to scalable ticker discovery and related noise reduction.
2. Complete verification before review.
3. Merge as exactly one commit.

## Notes

- Prefer the smallest number of new components that keeps the route simple.
- Keep market chart behavior intact apart from the intentional control and visual-noise adjustments.
- Do not reintroduce a large ticker card grid as a fallback.
- Verification completed:
  - `cd ui && npm run check`
  - `cd ui && npm run test`
  - `cd ui && npm run build`
