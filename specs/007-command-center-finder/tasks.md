# Tasks: Command Center Finder

**Input**: Design documents from `/specs/007-command-center-finder/`  
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

**Purpose**: Review the current ticker workspace and prepare `007` artifacts.

- [x] T001 Review current ticker selector, recent context, and chart-header boundaries in `ui/src/routes/+page.svelte`, `ui/src/lib/data/dashboard.ts`, and `ui/src/lib/charts/price-chart.svelte`
- [x] T002 Create feature planning artifacts in `specs/007-command-center-finder/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add the shared finder state and derivation required by all stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T003 Keep unified finder state minimal in `ui/src/routes/+page.svelte` while reusing existing result-row types from `ui/src/lib/data/types.ts`
- [x] T004 Implement tab-aware, timeframe-aware finder derivation helpers in `ui/src/lib/data/dashboard.ts`
- [x] T005 [P] Add dashboard-state unit coverage for finder derivation and active timeframe behavior in `ui/tests/unit/data/dashboard.test.ts`
- [x] T006 Create the reusable search modal in `ui/src/lib/components/search-modal.svelte`

**Checkpoint**: Finder state and result derivation are ready for story work.

---

## Phase 3: User Story 1 - Open one command-center finder for all ticker navigation (Priority: P1) 🎯 MVP

**Goal**: Replace the old search, filter row, and bottom ticker list with one unified finder.

**Independent Verification**: Open the finder, browse tabs, search, select a
result, and confirm the active ticker updates without using any removed selection zones.

### Verification for User Story 1

- [x] T007 [P] [US1] Preserve route-level verification through `cd ui && npm run build`
- [x] T008 [P] [US1] Add dashboard-state verification for finder tabs and recent context in `ui/tests/unit/data/dashboard.test.ts`

### Implementation for User Story 1

- [x] T009 [US1] Replace the current top search, filters, and bottom ticker list workflow with `SearchModal` plus a header trigger in `ui/src/routes/+page.svelte` and `ui/src/lib/components/search-modal.svelte`
- [x] T010 [US1] Add `Cmd+K` and `Ctrl+K` support for opening the finder in `ui/src/routes/+page.svelte`
- [x] T011 [US1] Keep finder selection, recent state, keyboard navigation, and local preference behavior coherent in `ui/src/routes/+page.svelte` and `ui/src/lib/components/search-modal.svelte`

**Checkpoint**: User Story 1 is fully functional and independently verifiable.

---

## Phase 4: User Story 2 - See one coherent market header and chart context (Priority: P2)

**Goal**: Use the reclaimed space for a stronger active ticker header and a larger chart.

**Independent Verification**: Switch tickers and confirm the header shows the
active symbol and latest price while the chart area is visibly larger.

### Verification for User Story 2

- [x] T012 [P] [US2] Preserve active ticker header verification through `cd ui && npm run build`
- [x] T013 [P] [US2] Add dashboard-state verification for active timeframe summary data in `ui/tests/unit/data/dashboard.test.ts`

### Implementation for User Story 2

- [x] T014 [US2] Add active ticker summary derivation in `ui/src/routes/+page.svelte` and `ui/src/lib/data/dashboard.ts`
- [x] T015 [US2] Rework the ticker workspace header to emphasize active symbol and latest price in `ui/src/routes/+page.svelte`
- [x] T016 [US2] Expand chart prominence after removing the old bottom list and filter row in `ui/src/routes/+page.svelte` and `ui/src/lib/charts/price-chart.svelte`

**Checkpoint**: User Story 2 is fully functional and independently verifiable.

---

## Phase 5: User Story 3 - Read chart context without redundant or deceptive UI (Priority: P3)

**Goal**: Keep legend, tooltip, VIX scale, and status surfaces quiet and truthful.

**Independent Verification**: Hover the chart, inspect the legend and VIX
scale, and confirm success-state status surfaces stay suppressed when there is no issue.

### Verification for User Story 3

- [x] T017 [P] [US3] Preserve success-state status verification through `cd ui && npm run check`
- [x] T018 [P] [US3] Add dashboard-state verification for compact tooltip, percentage change, and finder trend behavior in `ui/tests/unit/data/dashboard.test.ts`

### Implementation for User Story 3

- [x] T019 [US3] Replace legend chips with plain legend text and keep VIX on its own readable scale in `ui/src/lib/charts/price-chart.svelte`
- [x] T020 [US3] Simplify the tooltip to use compact OHLC, dollar volume, and VIX lines in `ui/src/lib/charts/price-chart.svelte`
- [x] T021 [US3] Keep VIX line, axis, and tooltip colors aligned in `ui/src/lib/charts/price-chart.svelte`
- [x] T022 [US3] Suppress empty success-state failure UI and collapse refresh issues into the header in `ui/src/routes/+page.svelte`

**Checkpoint**: All user stories are independently functional.

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Final simplification review and full validation.

- [x] T023 [P] Review new modal finder, dashboard helpers, and chart changes for unnecessary complexity in `ui/src/lib/components/search-modal.svelte`, `ui/src/lib/data/dashboard.ts`, `ui/src/routes/+page.svelte`, and `ui/src/lib/charts/price-chart.svelte`
- [x] T024 Run full verification from `specs/007-command-center-finder/quickstart.md`
- [x] T025 Mark completed tasks and record final verification in `specs/007-command-center-finder/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Starts immediately.
- **Foundational (Phase 2)**: Depends on Setup and blocks all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational completion.
- **Final Phase**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational. No dependency on other stories.
- **User Story 2 (P2)**: Starts after Foundational and builds on the unified finder from US1.
- **User Story 3 (P3)**: Starts after Foundational and integrates with the new finder and header context from US1 and US2.

### Parallel Opportunities

- T005 can run in parallel with T006 after T003 and T004 are defined.
- T007 and T008 can run in parallel within US1.
- T012 and T013 can run in parallel within US2.
- T017 and T018 can run in parallel within US3.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup.
2. Complete Foundational work.
3. Complete User Story 1.
4. Verify all ticker navigation flows through the unified finder.

### Incremental Delivery

1. Replace the old multi-zone ticker selection with the command-center finder.
2. Promote the active ticker header and enlarge the chart area.
3. Simplify legend, tooltip, VIX scale, and status surfaces.
4. Run full verification and record completion.

### Pull Request Discipline

1. Keep the branch scoped to one command-center dashboard refinement.
2. Complete verification before review.
3. Merge as exactly one commit.

## Notes

- Prefer one deep finder component over spreading selection logic across the route.
- Avoid adding a new route or backend dependency for ticker switching.
- Keep copy minimal and rely on chart semantics where the visualization already carries the meaning.
- Verification completed:
  - `cd ui && npm run check`
  - `cd ui && npm run test`
  - `cd ui && npm run build`
