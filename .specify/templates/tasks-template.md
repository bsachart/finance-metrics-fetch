---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
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

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project. Adjust based on `plan.md`.

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /speckit.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/

  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Verified independently
  - Delivered as an MVP increment

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and baseline tooling

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize project dependencies and baseline tooling
- [ ] T003 [P] Configure linting, formatting, and shared verification commands

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before any user story can
be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Establish the core data model and file layout used by all stories
- [ ] T005 [P] Implement configuration loading and environment handling
- [ ] T006 [P] Add shared service boundaries or adapters required across stories
- [ ] T007 Create shared error handling and logging behavior
- [ ] T008 Define reusable validation or parsing utilities
- [ ] T009 Add baseline integration verification for the shared flow

**Checkpoint**: Foundation ready. User story implementation can now begin.

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Verification**: [How to prove this story works on its own]

### Verification for User Story 1

- [ ] T010 [P] [US1] Add automated or command-line verification for the primary
      user journey
- [ ] T011 [P] [US1] Add integration verification for the user-visible outcome

### Implementation for User Story 1

- [ ] T012 [P] [US1] Create [Entity1] in [path]
- [ ] T013 [P] [US1] Create [Entity2] in [path]
- [ ] T014 [US1] Implement [Service] in [path] (depends on T012, T013)
- [ ] T015 [US1] Implement [feature entry point] in [path]
- [ ] T016 [US1] Add validation and error handling in [path]
- [ ] T017 [US1] Update user-facing documentation in [path]

**Checkpoint**: User Story 1 should now be fully functional and independently
verifiable.

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Verification**: [How to prove this story works on its own]

### Verification for User Story 2

- [ ] T018 [P] [US2] Add automated or command-line verification for the primary
      user journey
- [ ] T019 [P] [US2] Add integration verification for the user-visible outcome

### Implementation for User Story 2

- [ ] T020 [P] [US2] Create [Entity] in [path]
- [ ] T021 [US2] Implement [Service] in [path]
- [ ] T022 [US2] Implement [feature entry point] in [path]
- [ ] T023 [US2] Update user-facing documentation in [path]

**Checkpoint**: User Story 2 should now be fully functional and independently
verifiable.

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Verification**: [How to prove this story works on its own]

### Verification for User Story 3

- [ ] T024 [P] [US3] Add automated or command-line verification for the primary
      user journey
- [ ] T025 [P] [US3] Add integration verification for the user-visible outcome

### Implementation for User Story 3

- [ ] T026 [P] [US3] Create [Entity] in [path]
- [ ] T027 [US3] Implement [Service] in [path]
- [ ] T028 [US3] Implement [feature entry point] in [path]
- [ ] T029 [US3] Update user-facing documentation in [path]

**Checkpoint**: All user stories should now be independently functional.

---

[Add more user story phases as needed, following the same pattern]

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in docs/ or repository root
- [ ] TXXX Remove unnecessary complexity and simplify interfaces
- [ ] TXXX Performance tuning tied to explicit goals in plan.md
- [ ] TXXX [P] Add missing verification coverage for cross-story behavior
- [ ] TXXX Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies. Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user
  stories.
- **User Stories (Phase 3+)**: Depend on Foundational phase completion.
  Stories can proceed in parallel if staffing allows, or sequentially in
  priority order.
- **Final Phase**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational. No dependencies on other
  stories.
- **User Story 2 (P2)**: Starts after Foundational. May integrate with US1 but
  must remain independently verifiable.
- **User Story 3 (P3)**: Starts after Foundational. May integrate with US1/US2
  but must remain independently verifiable.

### Within Each User Story

- Verification tasks MUST exist for every story
- Models before services
- Services before entry points
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel within Phase 2
- Once Foundational completes, user stories can start in parallel if capacity
  allows
- Verification tasks within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

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
5. Keep each increment valuable on its own

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
- Avoid vague tasks, same-file conflicts, and cross-story dependencies that
  break independence
