# Tasks: HUD-Centric Dashboard

**Input**: Design documents from `/specs/008-hud-dashboard/`  
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

**Purpose**: Review the current workspace, chart, and status surfaces for the
HUD-centered redesign.

- [x] T001 Review current ticker workspace, chart hover logic, and header control placement in `ui/src/routes/+page.svelte`, `ui/src/lib/charts/price-chart.svelte`, and `ui/src/lib/data/dashboard.ts`
- [x] T002 Create feature planning artifacts in `specs/008-hud-dashboard/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add the shared HUD state and formatting needed by every story.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T003 Define HUD-facing chart state and formatting helpers in `ui/src/lib/data/types.ts` and `ui/src/lib/data/market.ts`
- [x] T004 [P] Extend chart hover and latest-bar derivation for stable HUD data in `ui/src/lib/charts/price-chart.svelte`
- [x] T005 [P] Add or update HUD formatting coverage in `ui/tests/unit/data/market.test.ts`

**Checkpoint**: HUD state and chart data formatting are ready for story work.

---

## Phase 3: User Story 1 - Read one stable market HUD while exploring the chart (Priority: P1) 🎯 MVP

**Goal**: Replace floating tooltip reading with one stable HUD below the chart controls.

**Independent Verification**: Load the ticker workspace, confirm the latest bar
shows in the HUD by default, hover other bars, and confirm the HUD updates in place.

### Verification for User Story 1

- [x] T006 [P] [US1] Preserve HUD behavior verification through `cd ui && npm run build`
- [x] T007 [P] [US1] Add automated coverage for HUD formatting and fallback helpers in `ui/tests/unit/data/market.test.ts`

### Implementation for User Story 1

- [x] T008 [US1] Render the persistent HUD below the ticker control row in `ui/src/routes/+page.svelte`
- [x] T009 [US1] Remove standard tooltip rendering and export hover/latest values to the HUD in `ui/src/lib/charts/price-chart.svelte`
- [x] T010 [US1] Apply stable-width HUD formatting and semantic HUD value styling in `ui/src/routes/+page.svelte` and `ui/src/app.css`

**Checkpoint**: User Story 1 is fully functional and independently verifiable.

---

## Phase 4: User Story 2 - See a clean chart canvas with trustworthy axes (Priority: P2)

**Goal**: Keep the chart itself quieter while clarifying scale ownership.

**Independent Verification**: Enable VIX, inspect the chart canvas, and confirm
the plot no longer shows legend/tooltip clutter and uses clearer axis treatment.

### Verification for User Story 2

- [x] T011 [P] [US2] Preserve chart cleanliness verification through `cd ui && npm run check`
- [x] T012 [P] [US2] Add automated coverage for revised scale and formatting behavior where practical in `ui/tests/unit/data/market.test.ts`

### Implementation for User Story 2

- [x] T013 [US2] Remove chart legend and other redundant plot labels from `ui/src/lib/charts/price-chart.svelte`
- [x] T014 [US2] Tighten left/right axis ownership and top-bottom price padding in `ui/src/lib/charts/price-chart.svelte`
- [x] T015 [US2] Standardize short x-axis date formatting in `ui/src/lib/charts/price-chart.svelte`

**Checkpoint**: User Story 2 is fully functional and independently verifiable.

---

## Phase 5: User Story 3 - Keep layout and status context consistent across the workspace (Priority: P3)

**Goal**: Anchor the workspace controls cleanly and keep status subtle.

**Independent Verification**: Compare header, card, control zone, HUD, and
chart alignment and confirm `Find Ticker` is grouped inside the workspace.

### Verification for User Story 3

- [x] T016 [P] [US3] Preserve workspace alignment verification through `cd ui && npm run build`
- [x] T017 [P] [US3] Preserve route-level verification through the existing `cd ui && npm run check`, `cd ui && npm run test`, and `cd ui && npm run build` suite

### Implementation for User Story 3

- [x] T018 [US3] Move the `Find Ticker` trigger into the ticker workspace control zone in `ui/src/routes/+page.svelte`
- [x] T019 [US3] Keep `Data as of` and the subtle status indicator in the global header in `ui/src/routes/+page.svelte`
- [x] T020 [US3] Align header, card, control zone, HUD, and chart margins and simplify the `VIX` toggle in `ui/src/routes/+page.svelte` and `ui/src/app.css`

**Checkpoint**: All user stories are independently functional.

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Final simplification review and full validation.

- [x] T021 [P] Review HUD, chart, and layout changes for unnecessary complexity in `ui/src/lib/charts/price-chart.svelte`, `ui/src/routes/+page.svelte`, and `ui/src/app.css`
- [x] T022 Run full verification from `specs/008-hud-dashboard/quickstart.md`
- [x] T023 Mark completed tasks and record final verification in `specs/008-hud-dashboard/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Starts immediately.
- **Foundational (Phase 2)**: Depends on Setup and blocks all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational completion.
- **Final Phase**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational. No dependency on other stories.
- **User Story 2 (P2)**: Starts after Foundational and builds on the shared HUD state from US1.
- **User Story 3 (P3)**: Starts after Foundational and integrates with the HUD and chart changes from US1 and US2.

### Parallel Opportunities

- T004 and T005 can run in parallel after T003 is defined.
- T006 and T007 can run in parallel within US1.
- T011 and T012 can run in parallel within US2.
- T016 and T017 can run in parallel within US3.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup.
2. Complete Foundational work.
3. Complete User Story 1.
4. Verify the stable HUD independently.

### Incremental Delivery

1. Add the stable HUD and remove floating tooltip dependence.
2. Clean up chart axes, date formatting, and plot chrome.
3. Regroup `Find Ticker` inside the workspace and keep header status subtle.
4. Run full verification and record completion.

### Pull Request Discipline

1. Keep the branch scoped to one HUD-centered dashboard refinement.
2. Complete verification before review.
3. Merge as exactly one commit.

## Notes

- Prefer one stable HUD surface over multiple overlapping readout elements.
- Avoid reintroducing chart chrome once the HUD owns the numeric readout.
- Keep copy minimal and consistent with the existing dashboard tone.
- Run and document verification before reporting work complete.

## Final Verification

- `cd ui && npm run check`
- `cd ui && npm run test`
- `cd ui && npm run build`
