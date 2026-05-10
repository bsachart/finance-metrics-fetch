# Implementation Tasks: fix-chart-colors

**Feature Branch**: `009-fix-chart-colors`

## Phase 1: Setup
*(No setup required for this UI fix)*

## Phase 2: Foundational
*(No foundational dependencies)*

## Phase 3: User Story 1 - Consistent Chart Legend and Line Colors

**Goal**: Ensure the VIX legend color matches the VIX chart line color.
**Independent Test**: Visually confirm that the legend "VIX" text color is amber when VIX is >= 20 and purple/violet when VIX is < 20, matching the chart line.

- [x] T001 [US1] Compute dynamic `vixTone` tailwind class in `ui/src/routes/+page.svelte` based on VIX value >= 20 threshold
- [x] T002 [US1] Apply `vixTone` class to the VIX legend `<span>` in `ui/src/routes/+page.svelte`

## Phase 4: Polish

- [x] T003 Build the static UI and verify there are no typescript or build errors
- [x] T004 Run tests in `ui/` directory

## Phase 5: User Story 2 - Default Timeframe

**Goal**: Change default lookback to 1Y.
**Independent Test**: Clear local storage and verify that 1Y is selected on load.

- [x] T005 [US2] Update `selectedLookback` initial value to "1Y" in `ui/src/routes/+page.svelte`

## Dependencies

- User Story 1 is independent.

## Parallel Execution
- T001 and T002 must be done sequentially as they are in the same file.

## Implementation Strategy
Start by implementing the reactive variable `vixTone` in `+page.svelte`. Then apply it to the DOM elements rendering the VIX value. Finally, verify the changes with the test suite.
