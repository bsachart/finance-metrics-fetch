---

description: "Task list for implementing config-driven market fetch"
---

# Tasks: Config-Driven Market Fetch

**Input**: Design documents from `/specs/001-config-market-fetch/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Verification**: Every task set MUST include reproducible verification work.
Automated tests are preferred when applicable, but lint, build, and command-line
validation tasks are also required for this feature.

**Organization**: Tasks are grouped by user story to enable independent
implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Python package: `src/finance_metrics_fetch/`
- Tests: `tests/unit/`, `tests/integration/`
- Static web app: `web/src/`, `web/static/`
- Workflows: `.github/workflows/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and baseline tooling

- [X] T001 Create the repository layout from the plan in `config/`, `data/`, `src/finance_metrics_fetch/`, `tests/`, `web/`, and `.github/workflows/`
- [X] T002 Initialize the Python project with `uv` metadata and dependencies in `/home/bog/Documents/finance_metrics_fetch/pyproject.toml`
- [X] T003 [P] Configure Ruff linting and formatting defaults in `/home/bog/Documents/finance_metrics_fetch/pyproject.toml`
- [X] T004 [P] Add Python package entrypoints and package markers in `/home/bog/Documents/finance_metrics_fetch/src/finance_metrics_fetch/__init__.py` and `/home/bog/Documents/finance_metrics_fetch/src/finance_metrics_fetch/cli.py`
- [X] T005 [P] Scaffold the repository automation layout in `/home/bog/Documents/finance_metrics_fetch/.github/workflows/` for scheduled refreshes

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before any user story can
be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Define typed domain models for configuration, market rows, constituent rows, and refresh results in `/home/bog/Documents/finance_metrics_fetch/src/finance_metrics_fetch/models.py`
- [X] T007 Implement configuration loading and validation for `config/tickers.json` in `/home/bog/Documents/finance_metrics_fetch/src/finance_metrics_fetch/config.py`
- [X] T008 [P] Implement shared Polars normalization utilities in `/home/bog/Documents/finance_metrics_fetch/src/finance_metrics_fetch/transforms/datasets.py`
- [X] T009 [P] Implement shared artifact-writing utilities for CSV and JSON outputs in `/home/bog/Documents/finance_metrics_fetch/src/finance_metrics_fetch/publish/artifacts.py`
- [X] T010 Implement CLI command routing, exit codes, and refresh summary handling in `/home/bog/Documents/finance_metrics_fetch/src/finance_metrics_fetch/cli.py`
- [X] T011 Add unit verification for config validation and shared transforms in `/home/bog/Documents/finance_metrics_fetch/tests/unit/test_config.py` and `/home/bog/Documents/finance_metrics_fetch/tests/unit/test_datasets.py`
- [X] T012 Add a baseline command-line smoke test for the shared CLI flow in `/home/bog/Documents/finance_metrics_fetch/tests/integration/test_cli_smoke.py`

**Checkpoint**: Foundation ready. User story implementation can now begin.

---

## Phase 3: User Story 1 - Refresh Configured Market Datasets (Priority: P1) 🎯 MVP

**Goal**: Refresh Yahoo Finance OHLCV data and Wikipedia constituent lists from
a maintained ticker configuration, then persist normalized outputs and run
status.

**Independent Verification**: Run `uv run python -m finance_metrics_fetch.cli refresh`
against a small config and confirm that market files, constituent files, and a
refresh status summary are written successfully.

### Verification for User Story 1

- [X] T013 [P] [US1] Add unit tests for Yahoo OHLCV normalization in `/home/bog/Documents/finance_metrics_fetch/tests/unit/test_yahoo_source.py`
- [X] T014 [P] [US1] Add unit tests for Wikipedia constituent extraction in `/home/bog/Documents/finance_metrics_fetch/tests/unit/test_wikipedia_source.py`
- [X] T015 [P] [US1] Add integration verification for refresh outputs in `/home/bog/Documents/finance_metrics_fetch/tests/integration/test_refresh_command.py`

### Implementation for User Story 1

- [X] T016 [P] [US1] Create the default ticker configuration file in `/home/bog/Documents/finance_metrics_fetch/config/tickers.json`
- [X] T017 [P] [US1] Implement typed Yahoo Finance fetching in `/home/bog/Documents/finance_metrics_fetch/src/finance_metrics_fetch/sources/yahoo.py`
- [X] T018 [P] [US1] Implement typed Wikipedia constituent fetching in `/home/bog/Documents/finance_metrics_fetch/src/finance_metrics_fetch/sources/wikipedia.py`
- [X] T019 [US1] Implement refresh orchestration for config-driven source updates in `/home/bog/Documents/finance_metrics_fetch/src/finance_metrics_fetch/cli.py`
- [X] T020 [US1] Write normalized market CSV outputs and run status artifacts through `/home/bog/Documents/finance_metrics_fetch/src/finance_metrics_fetch/publish/artifacts.py`
- [X] T021 [US1] Write constituent CSV outputs for S&P 500 and Nasdaq-100 through `/home/bog/Documents/finance_metrics_fetch/src/finance_metrics_fetch/publish/artifacts.py`
- [X] T022 [US1] Update the local usage docs for refresh commands in `/home/bog/Documents/finance_metrics_fetch/README.md` and `/home/bog/Documents/finance_metrics_fetch/specs/001-config-market-fetch/quickstart.md`

**Checkpoint**: User Story 1 should now be fully functional and independently
verifiable.

---

## Phase 4: User Story 2 - Access Constituents As Reference Data (Priority: P2)

**Goal**: Make the current S&P 500 and Nasdaq-100 constituent datasets easily
available as stable plain files and machine-readable artifacts.

**Independent Verification**: Run a successful refresh and confirm that both
constituent CSV files are written with consistent schemas and that the status
file reports a successful run.

### Verification for User Story 2

- [X] T023 [P] [US2] Add unit verification for constituent output schemas in `/home/bog/Documents/finance_metrics_fetch/tests/unit/test_constituent_outputs.py`
- [X] T024 [P] [US2] Add integration verification for constituent artifact persistence in `/home/bog/Documents/finance_metrics_fetch/tests/integration/test_constituent_outputs.py`

### Implementation for User Story 2

- [X] T025 [P] [US2] Add constituent metadata and schema handling in `/home/bog/Documents/finance_metrics_fetch/src/finance_metrics_fetch/models.py`
- [X] T026 [US2] Implement stable constituent export formatting in `/home/bog/Documents/finance_metrics_fetch/src/finance_metrics_fetch/publish/artifacts.py`
- [X] T027 [US2] Add the scheduled refresh GitHub Actions workflow in `/home/bog/Documents/finance_metrics_fetch/.github/workflows/refresh-data.yml`
- [X] T028 [US2] Update constituent output usage docs in `/home/bog/Documents/finance_metrics_fetch/README.md` and `/home/bog/Documents/finance_metrics_fetch/specs/001-config-market-fetch/quickstart.md`

**Checkpoint**: User Story 2 should now be fully functional and independently
verifiable.

---

**Checkpoint**: All user stories should now be independently functional.

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T029 [P] Run and fix `uv run ruff check .` and `uv run ruff format --check .` across `/home/bog/Documents/finance_metrics_fetch`
- [X] T030 [P] Run and fix `uv run pytest` across `/home/bog/Documents/finance_metrics_fetch/tests/`
- [X] T031 Validate the end-to-end quickstart flow in `/home/bog/Documents/finance_metrics_fetch/specs/001-config-market-fetch/quickstart.md`
- [X] T032 Update final repository documentation and implementation notes in `/home/bog/Documents/finance_metrics_fetch/README.md` and `/home/bog/Documents/finance_metrics_fetch/AGENTS.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies. Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user
  stories.
- **User Stories (Phase 3+)**: Depend on Foundational phase completion.
  User Story 1 should ship first as the MVP. User Story 2 depends on the
  constituent outputs and scheduled refresh flow created in User Story 1.
- **Final Phase**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational. No dependencies on other
  stories.
- **User Story 2 (P2)**: Starts after User Story 1 because it depends on the
  constituent outputs and scheduled refresh flow created there.

### Within Each User Story

- Verification tasks MUST exist for every story
- Models and schemas before source or publish services
- Source and transform work before CLI entry points
- Core implementation before integration
- Story complete before moving to next priority unless an explicitly parallel
  task is independent

### Parallel Opportunities

- T003, T004, and T005 can run in parallel during Setup
- T008 and T009 can run in parallel during Foundational
- T013, T014, T016, T017, and T018 can run in parallel once Foundational is complete
- T023 and T024 can run in parallel for constituent verification
- T029 and T030 can run in parallel in the final phase

---

## Parallel Example: User Story 1

```bash
Task: "T013 [US1] Add unit tests in tests/unit/test_yahoo_source.py"
Task: "T014 [US1] Add unit tests in tests/unit/test_wikipedia_source.py"
Task: "T016 [US1] Create config/tickers.json"
Task: "T017 [US1] Implement src/finance_metrics_fetch/sources/yahoo.py"
Task: "T018 [US1] Implement src/finance_metrics_fetch/sources/wikipedia.py"
```

## Parallel Example: User Story 2

```bash
Task: "T023 [US2] Add unit verification in tests/unit/test_constituent_outputs.py"
Task: "T024 [US2] Add integration verification in tests/integration/test_constituent_outputs.py"
Task: "T025 [US2] Add constituent metadata in src/finance_metrics_fetch/models.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and verify User Story 1 independently with the refresh command
5. Demo the generated datasets before moving to the UI

### Incremental Delivery

1. Complete Setup and Foundational work
2. Add User Story 1 and verify the config-driven refresh pipeline
3. Add User Story 2 and verify constituent outputs and automation
4. Finish cross-cutting verification and documentation

### Pull Request Discipline

1. Scope the branch to the smallest practical logical change while implementing
   tasks incrementally
2. Complete verification before review
3. Merge as exactly one commit

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] labels map tasks to user stories for traceability
- Each user story is independently completable and verifiable
- Verification includes Ruff, pytest, command-line refresh checks, and scheduled workflow sanity checks
- All dataframe handling must use Polars, not pandas
- Keep task execution small, reviewable, and aligned with the feature contracts
