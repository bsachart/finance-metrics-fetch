# Tasks: Simplified Market UI

**Input**: Design documents from `/specs/003-simplify-market-ui/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

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

- Python package: `src/finance_metrics_fetch/`
- Python tests: `tests/unit/`, `tests/integration/`
- Static UI: `ui/src/`, `ui/tests/`, `ui/scripts/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Align configuration and docs for the new published-asset model

- [X] T001 Extend repository metadata for symbols and indices in `/home/bog/Documents/finance_metrics_fetch/config/tickers.json`
- [X] T002 [P] Update feature quickstart and repository docs in `/home/bog/Documents/finance_metrics_fetch/specs/003-simplify-market-ui/quickstart.md` and `/home/bog/Documents/finance_metrics_fetch/README.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared published-data discovery and stable constituent artifact rules

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 [P] Remove per-row `fetched_at` from typed constituent models and normalization in `/home/bog/Documents/finance_metrics_fetch/src/finance_metrics_fetch/models.py` and `/home/bog/Documents/finance_metrics_fetch/src/finance_metrics_fetch/transforms/datasets.py`
- [X] T004 [P] Write stable latest constituent exports plus dated snapshot exports in `/home/bog/Documents/finance_metrics_fetch/src/finance_metrics_fetch/publish/artifacts.py` and `/home/bog/Documents/finance_metrics_fetch/src/finance_metrics_fetch/cli.py`
- [X] T005 [P] Remove `fetched_at` production from Wikipedia source records in `/home/bog/Documents/finance_metrics_fetch/src/finance_metrics_fetch/sources/wikipedia.py`
- [X] T006 [P] Generate a packaged asset manifest from published market and constituent files in `/home/bog/Documents/finance_metrics_fetch/ui/scripts/copy-data.mjs`
- [X] T007 [P] Add shared manifest, index-config, and constituent snapshot types and loaders in `/home/bog/Documents/finance_metrics_fetch/ui/src/lib/data/types.ts` and `/home/bog/Documents/finance_metrics_fetch/ui/src/lib/data/loaders.ts`
- [X] T008 Add baseline verification for stable constituent exports and packaged asset discovery in `/home/bog/Documents/finance_metrics_fetch/tests/unit/test_constituent_outputs.py`, `/home/bog/Documents/finance_metrics_fetch/tests/integration/test_constituent_outputs.py`, `/home/bog/Documents/finance_metrics_fetch/ui/tests/unit/data/loaders.test.ts`, and `/home/bog/Documents/finance_metrics_fetch/ui/tests/unit/data/dashboard.test.ts`

**Checkpoint**: Foundation ready. User story implementation can now begin.

---

## Phase 3: User Story 1 - Inspect Published Market Sessions (Priority: P1) 🎯 MVP

**Goal**: Show OHLC price action with normalized nominal volume in one combined market chart sourced from published assets

**Independent Verification**: Open the dashboard, switch symbols, and confirm the market view shows a candlestick chart with a lower normalized nominal-volume pane inside the same chart component.

### Verification for User Story 1

- [X] T009 [P] [US1] Add market-series unit coverage for candlestick and normalized-volume transformations in `/home/bog/Documents/finance_metrics_fetch/ui/tests/unit/data/market.test.ts`
- [X] T010 [P] [US1] Add route-load verification for manifest-driven symbol selection in `/home/bog/Documents/finance_metrics_fetch/ui/tests/unit/routes/page-load.test.ts`

### Implementation for User Story 1

- [X] T011 [P] [US1] Build OHLC, normalized nominal-volume, and VIX overlay series helpers in `/home/bog/Documents/finance_metrics_fetch/ui/src/lib/data/market.ts`
- [X] T012 [P] [US1] Replace the existing chart wrappers with one combined market chart component in `/home/bog/Documents/finance_metrics_fetch/ui/src/lib/charts/price-chart.svelte`
- [X] T013 [P] [US1] Simplify market summary and volatility context copy in `/home/bog/Documents/finance_metrics_fetch/ui/src/lib/components/market-summary.svelte` and `/home/bog/Documents/finance_metrics_fetch/ui/src/lib/components/vix-context.svelte`
- [X] T014 [US1] Rework dashboard loading and market-tab composition around manifest-driven symbols in `/home/bog/Documents/finance_metrics_fetch/ui/src/lib/data/dashboard.ts`, `/home/bog/Documents/finance_metrics_fetch/ui/src/routes/+page.ts`, and `/home/bog/Documents/finance_metrics_fetch/ui/src/routes/+page.svelte`

**Checkpoint**: User Story 1 should now be fully functional and independently verifiable.

---

## Phase 4: User Story 2 - Review Distribution Context (Priority: P2)

**Goal**: Keep price and nominal-volume histograms available without a dedicated distributions tab

**Independent Verification**: Open the market tab for any symbol and confirm both histograms remain visible and update when the selected symbol changes.

### Verification for User Story 2

- [X] T015 [P] [US2] Update histogram coverage for nominal-volume terminology and integrated rendering assumptions in `/home/bog/Documents/finance_metrics_fetch/ui/tests/unit/data/histograms.test.ts`
- [X] T016 [P] [US2] Extend route-load verification for the simplified analysis layout in `/home/bog/Documents/finance_metrics_fetch/ui/tests/unit/routes/page-load.test.ts`

### Implementation for User Story 2

- [X] T017 [P] [US2] Refresh histogram component copy and formatting in `/home/bog/Documents/finance_metrics_fetch/ui/src/lib/charts/histogram-chart.svelte`
- [X] T018 [P] [US2] Simplify distribution-panel composition for the market tab in `/home/bog/Documents/finance_metrics_fetch/ui/src/lib/components/distribution-panel.svelte`
- [X] T019 [US2] Remove the dedicated distributions tab and embed histogram views in `/home/bog/Documents/finance_metrics_fetch/ui/src/routes/+page.svelte`

**Checkpoint**: User Story 2 should now be fully functional and independently verifiable.

---

## Phase 5: User Story 3 - Browse Published Index Constituents Separately (Priority: P3)

**Goal**: Move constituents into a dedicated indices tab sourced from packaged index metadata and dated snapshots

**Independent Verification**: Open the indices tab, switch between available indices, and confirm the table loads from the manifest-driven latest files while dated snapshots exist on disk for history.

### Verification for User Story 3

- [X] T020 [P] [US3] Add constituent parser and snapshot-path verification in `/home/bog/Documents/finance_metrics_fetch/ui/tests/unit/data/constituents.test.ts` and `/home/bog/Documents/finance_metrics_fetch/tests/integration/test_refresh_command.py`
- [X] T021 [P] [US3] Extend route-load verification for manifest-driven indices in `/home/bog/Documents/finance_metrics_fetch/ui/tests/unit/routes/page-load.test.ts`

### Implementation for User Story 3

- [X] T022 [P] [US3] Load index options from packaged config and manifest in `/home/bog/Documents/finance_metrics_fetch/ui/src/lib/data/dashboard.ts`
- [X] T023 [P] [US3] Update constituent-table messaging for stable latest files and dated history in `/home/bog/Documents/finance_metrics_fetch/ui/src/lib/components/constituent-table.svelte`
- [X] T024 [US3] Rework top-level navigation so indices live in their own tab in `/home/bog/Documents/finance_metrics_fetch/ui/src/routes/+page.svelte`

**Checkpoint**: All user stories should now be independently functional.

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup, verification, and simplification across the feature

- [X] T025 [P] Remove obsolete volume-chart usage and dead code in `/home/bog/Documents/finance_metrics_fetch/ui/src/lib/charts/volume-chart.svelte` and related imports
- [X] T026 [P] Update repository and feature documentation for the simplified UI and dated constituent history in `/home/bog/Documents/finance_metrics_fetch/README.md` and `/home/bog/Documents/finance_metrics_fetch/specs/003-simplify-market-ui/quickstart.md`
- [X] T027 Run `uv run pytest`, `cd ui && npm run check`, `cd ui && npm run test`, and `cd ui && npm run build` from `/home/bog/Documents/finance_metrics_fetch`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies. Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories.
- **User Stories (Phases 3-5)**: Depend on Foundational completion and should land in priority order.
- **Final Phase**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational. No dependencies on other stories.
- **User Story 2 (P2)**: Starts after Foundational and reuses the P1 market-tab shell.
- **User Story 3 (P3)**: Starts after Foundational and reuses the shared dashboard loader.

### Parallel Opportunities

- T003-T007 can run in parallel within Foundational because they target different modules.
- T009-T013 can run in parallel within User Story 1 before route integration in T014.
- T015-T018 can run in parallel within User Story 2 before route cleanup in T019.
- T020-T023 can run in parallel within User Story 3 before final navigation integration in T024.
- T025 and T026 can run in parallel after all user stories are complete.

## Implementation Strategy

### MVP First

1. Complete Setup and Foundational work.
2. Deliver User Story 1 and verify the combined OHLC plus normalized-volume chart.
3. Add histogram simplification.
4. Finish the dedicated indices tab and dated constituent history.

### Pull Request Discipline

1. Keep the branch scoped to this one simplification feature.
2. Complete verification before review.
3. Merge as exactly one commit.
