# Tasks: Market Data UI

**Input**: Design documents from `/specs/002-market-ui/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Verification**: Every task set MUST include reproducible verification work.
Automated tests are preferred when applicable, but lint, build, or command-line
validation tasks are also required when tests are not the primary mechanism.

**Organization**: Tasks are grouped by user story to enable independent
implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the `ui/` application and baseline frontend tooling

- [X] T001 Create the SvelteKit app scaffold in `ui/`
- [X] T002 Configure frontend dependencies and scripts in `ui/package.json`
- [X] T003 [P] Configure TypeScript, SvelteKit, and static adapter settings in `ui/svelte.config.js`, `ui/tsconfig.json`, and `ui/vite.config.ts`
- [X] T004 [P] Add frontend ignore and environment defaults in `ui/.gitignore` and `ui/.npmrc`
- [X] T005 [P] Add baseline frontend styling and app shell files in `ui/src/app.css`, `ui/src/app.html`, and `ui/src/routes/+layout.svelte`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared data packaging, parsing, and view-model infrastructure

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Create the packaged data copy script in `ui/scripts/copy-data.mjs`
- [X] T007 [P] Define shared UI data types in `ui/src/lib/data/types.ts`
- [X] T008 [P] Implement CSV and JSON asset loaders in `ui/src/lib/data/loaders.ts`
- [X] T009 [P] Implement market-series parsing and derived summary helpers in `ui/src/lib/data/market.ts`
- [X] T010 [P] Implement constituent parsing helpers in `ui/src/lib/data/constituents.ts`
- [X] T011 [P] Implement histogram bucket helpers in `ui/src/lib/data/histograms.ts`
- [X] T012 Implement dashboard data orchestration in `ui/src/lib/data/dashboard.ts`
- [X] T013 [P] Add shared status, empty-state, and formatting components in `ui/src/lib/components/status-card.svelte`, `ui/src/lib/components/empty-state.svelte`, and `ui/src/lib/components/value-chip.svelte`
- [X] T014 Add foundational verification for packaged asset loading in `ui/tests/unit/data/loaders.test.ts` and `ui/tests/unit/data/dashboard.test.ts`

**Checkpoint**: Foundation ready. User story implementation can now begin.

---

## Phase 3: User Story 1 - Explore Market History (Priority: P1) 🎯 MVP

**Goal**: Let visitors browse historical price, quote volume, refresh status, and VIX context for published symbols

**Independent Verification**: Build and open the dashboard, switch between symbols, and confirm the page renders price history, quote volume history, VIX context, and refresh status from packaged `data/` assets only

### Verification for User Story 1

- [X] T015 [P] [US1] Add market-series unit coverage in `ui/tests/unit/data/market.test.ts`
- [X] T016 [P] [US1] Add a dashboard page smoke test in `ui/tests/unit/routes/page-load.test.ts`

### Implementation for User Story 1

- [X] T017 [P] [US1] Implement the symbol selector and headline summary in `ui/src/lib/components/symbol-selector.svelte` and `ui/src/lib/components/market-summary.svelte`
- [X] T018 [P] [US1] Implement Lightweight Charts wrappers in `ui/src/lib/charts/price-chart.svelte` and `ui/src/lib/charts/volume-chart.svelte`
- [X] T019 [P] [US1] Implement VIX context display in `ui/src/lib/components/vix-context.svelte`
- [X] T020 [US1] Implement the market dashboard route in `ui/src/routes/+page.ts` and `ui/src/routes/+page.svelte`
- [X] T021 [US1] Add missing-data and refresh-failure messaging to `ui/src/routes/+page.svelte`
- [X] T022 [US1] Update usage documentation for the market dashboard in `README.md` and `specs/002-market-ui/quickstart.md`

**Checkpoint**: User Story 1 should now be fully functional and independently verifiable.

---

## Phase 4: User Story 2 - Inspect Distributions (Priority: P2)

**Goal**: Let visitors inspect histogram-style distributions for price and quote volume

**Independent Verification**: Open the dashboard, switch to the distribution section, and confirm both price and quote-volume histograms update when the selected symbol changes

### Verification for User Story 2

- [X] T023 [P] [US2] Add histogram helper unit coverage in `ui/tests/unit/data/histograms.test.ts`
- [X] T024 [P] [US2] Add distribution-view rendering coverage in `ui/tests/unit/routes/page-load.test.ts`

### Implementation for User Story 2

- [X] T025 [P] [US2] Implement histogram chart components in `ui/src/lib/charts/histogram-chart.svelte`
- [X] T026 [P] [US2] Implement distribution summary components in `ui/src/lib/components/distribution-panel.svelte`
- [X] T027 [US2] Integrate the distribution section into `ui/src/routes/+page.svelte`
- [X] T028 [US2] Update user-facing documentation for histogram views in `README.md`

**Checkpoint**: User Story 2 should now be fully functional and independently verifiable.

---

## Phase 5: User Story 3 - Browse Constituents (Priority: P3)

**Goal**: Let visitors browse the published S&P 500 and Nasdaq-100 constituent datasets from the same static site

**Independent Verification**: Open the constituents section, switch between index lists, apply a text filter, and confirm the table updates from packaged constituent files

### Verification for User Story 3

- [X] T029 [P] [US3] Add constituent parser unit coverage in `ui/tests/unit/data/constituents.test.ts`
- [X] T030 [P] [US3] Add constituent-view rendering coverage in `ui/tests/unit/routes/page-load.test.ts`

### Implementation for User Story 3

- [X] T031 [P] [US3] Implement constituent table and filter controls in `ui/src/lib/components/constituent-table.svelte`
- [X] T032 [US3] Integrate the constituents section into `ui/src/routes/+page.svelte`
- [X] T033 [US3] Update user-facing documentation for constituent browsing in `README.md`

**Checkpoint**: All user stories should now be independently functional.

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Final deployment, verification, and cleanup across the full feature

- [X] T034 [P] Add GitHub Pages build and deploy workflow in `.github/workflows/deploy-ui.yml`
- [X] T035 [P] Add frontend smoke coverage in `ui/tests/unit/routes/page-load.test.ts`
- [X] T036 Simplify shared UI module boundaries and remove unnecessary complexity in `ui/src/lib/`
- [X] T037 [P] Update repository-level docs for the UI feature in `README.md`, `spec.md`, and `AGENTS.md`
- [X] T038 Run quickstart and verification commands from `specs/002-market-ui/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies. Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational phase completion. Stories should land in priority order.
- **Final Phase**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational. No dependencies on other stories.
- **User Story 2 (P2)**: Starts after Foundational and reuses the P1 dashboard shell.
- **User Story 3 (P3)**: Starts after Foundational and reuses the shared route and asset loaders.

### Within Each User Story

- Verification tasks MUST exist for every story
- Shared data helpers before page integration
- Components before route composition
- Story complete before moving to next priority

### Parallel Opportunities

- T003-T005 can run in parallel after the app scaffold exists.
- T007-T011 can run in parallel once asset copying is defined.
- T017-T019 can run in parallel before route integration in T020.
- T023-T026 can run in parallel within the distribution story.
- T029-T031 can run in parallel within the constituents story.
- T034, T035, and T037 can run in parallel after user stories are complete.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and verify User Story 1 independently
5. Demo or ship if ready

### Incremental Delivery

1. Complete Setup and Foundational work
2. Add User Story 1 and verify it independently
3. Add User Story 2 and verify it independently
4. Add User Story 3 and verify it independently
5. Finish deployment and cross-cutting validation

### Pull Request Discipline

1. Scope the branch to the smallest practical logical change
2. Complete verification before review
3. Merge as exactly one commit

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps tasks to user stories for traceability
- Each user story should be independently completable and verifiable
- Run and document verification before reporting work complete
- Prefer smaller, reviewable tasks when both options deliver the same value
- Keep the branch mergeable as one logical pull request with one commit
