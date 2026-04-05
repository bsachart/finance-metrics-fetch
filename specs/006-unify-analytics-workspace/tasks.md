# Tasks: Unified Analytics Workspace

**Input**: Design documents from `/specs/006-unify-analytics-workspace/`  
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

**Purpose**: Confirm the current ticker workspace boundaries before refining them.

- [x] T001 Review current timeframe, trend-summary, and chart-readout boundaries in `ui/src/routes/+page.svelte`, `ui/src/lib/data/dashboard.ts`, and `ui/src/lib/charts/price-chart.svelte`
- [x] T002 Create feature planning artifacts in `specs/006-unify-analytics-workspace/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add the shared derivation needed by all stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T003 Add shared timeframe-aware trend-summary types in `ui/src/lib/data/types.ts`
- [x] T004 Implement shared timeframe-aware ticker summary derivation in `ui/src/lib/data/dashboard.ts`
- [x] T005 [P] Add unit coverage for timeframe-aware ticker summary derivation in `ui/tests/unit/data/dashboard.test.ts`
- [x] T006 Establish shared chart readout grouping inputs in `ui/src/lib/charts/price-chart.svelte`

**Checkpoint**: Shared timeframe summary and readout foundations are ready.

---

## Phase 3: User Story 1 - Analyze the active ticker with one coherent timeframe (Priority: P1) 🎯 MVP

**Goal**: Make one timeframe control drive both the main chart and ticker-table trends.

**Independent Verification**: Change timeframe and confirm both the chart and
the ticker-table trend summaries rerender to the same period with explicit
timeframe labeling.

### Verification for User Story 1

- [x] T007 [P] [US1] Keep route-level verification stable in `ui/tests/unit/routes/page-load.test.ts`
- [x] T008 [P] [US1] Add dashboard-state verification for shared timeframe trend summaries in `ui/tests/unit/data/dashboard.test.ts`

### Implementation for User Story 1

- [x] T009 [US1] Update ticker-table trend summaries to use the active timeframe in `ui/src/routes/+page.svelte`
- [x] T010 [US1] Rename the ticker-table trend header to reflect the active timeframe in `ui/src/lib/components/ticker-list.svelte`
- [x] T011 [US1] Keep chart-control hierarchy coherent while emphasizing timeframe in `ui/src/routes/+page.svelte`

**Checkpoint**: User Story 1 is fully functional and independently verifiable.

---

## Phase 4: User Story 2 - Read price, volume, and VIX without visual conflict (Priority: P2)

**Goal**: Make VIX, volume, and tooltip context easier to read without
competing for attention.

**Independent Verification**: Enable VIX, hover the chart, and confirm VIX has
consistent color identity, its own grounded scale, and grouped tooltip context.

### Verification for User Story 2

- [x] T012 [P] [US2] Preserve chart-readout verification through `cd ui && npm run build`
- [x] T013 [P] [US2] Add state verification for VIX color and timeframe summary behavior in `ui/tests/unit/data/dashboard.test.ts`

### Implementation for User Story 2

- [x] T014 [US2] Refine lower-pane layering and VIX visual identity in `ui/src/lib/charts/price-chart.svelte`
- [x] T015 [US2] Keep VIX on a dedicated visible scale with a zero baseline in `ui/src/lib/charts/price-chart.svelte`
- [x] T016 [US2] Group chart tooltip content into price, volume, and indicator sections in `ui/src/lib/charts/price-chart.svelte`
- [x] T017 [US2] Align VIX tooltip label and axis color cues with the plotted series in `ui/src/lib/charts/price-chart.svelte`
- [x] T018 [US2] Replace button-like legend chips with a simple non-interactive chart legend in `ui/src/lib/charts/price-chart.svelte`

**Checkpoint**: User Story 2 is fully functional and independently verifiable.

---

## Phase 5: User Story 3 - Work in a quieter, lower-noise dashboard (Priority: P3)

**Goal**: Remove redundant labels, lighter grid treatment, and keep ticker-row
trend cues semantically consistent.

**Independent Verification**: Load the healthy dashboard state, confirm no
placeholder failure noise appears, and confirm trend rows and chart scaffolding
read more cleanly.

### Verification for User Story 3

- [x] T019 [P] [US3] Preserve success-state status verification through `cd ui && npm run check`
- [x] T020 [P] [US3] Add trend cue verification for ticker rows in `ui/tests/unit/data/dashboard.test.ts`

### Implementation for User Story 3

- [x] T021 [US3] Remove redundant chart labels and lighten grid treatment in `ui/src/lib/charts/price-chart.svelte`
- [x] T022 [US3] Suppress empty success-state failure language in `ui/src/lib/components/status-card.svelte` and `ui/src/routes/+page.svelte`
- [x] T023 [US3] Align ticker-row sparkline and change semantics in `ui/src/lib/components/ticker-list.svelte`

**Checkpoint**: All user stories are independently functional.

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Final simplification and full validation.

- [x] T024 [P] Review the updated route, data helpers, and chart component for unnecessary complexity in `ui/src/routes/+page.svelte`, `ui/src/lib/data/dashboard.ts`, and `ui/src/lib/charts/price-chart.svelte`
- [x] T025 Run full verification from `specs/006-unify-analytics-workspace/quickstart.md`
- [x] T026 Mark completed tasks and record final verification in `specs/006-unify-analytics-workspace/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Starts immediately.
- **Foundational (Phase 2)**: Depends on Setup and blocks all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational completion.
- **Final Phase**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational. No dependency on other stories.
- **User Story 2 (P2)**: Starts after Foundational and builds on the shared timeframe and chart foundation from US1.
- **User Story 3 (P3)**: Starts after Foundational and integrates with the refined chart and ticker-row presentation from US1 and US2.

### Parallel Opportunities

- T005 can run in parallel with T006 after T003 and T004 are defined.
- T007 and T008 can run in parallel within US1.
- T012 and T013 can run in parallel within US2.
- T019 and T020 can run in parallel within US3.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup.
2. Complete Foundational work.
3. Complete User Story 1.
4. Verify that timeframe state drives both chart and ticker summaries.

### Incremental Delivery

1. Unify timeframe context.
2. Improve VIX readability and tooltip grouping.
3. Remove noise and align row-level trend semantics.
4. Run full verification and record completion.

### Pull Request Discipline

1. Keep the branch scoped to one analytics-workspace refinement.
2. Complete verification before review.
3. Merge as exactly one commit.

## Notes

- Prefer extending existing helpers and components over adding new UI layers.
- Do not reopen routing or published-data scope in this feature.
- Keep user-facing copy short and remove explanatory text when the visualization already carries the meaning.
- Verification completed:
  - `cd ui && npm run check`
  - `cd ui && npm run test`
  - `cd ui && npm run build`
