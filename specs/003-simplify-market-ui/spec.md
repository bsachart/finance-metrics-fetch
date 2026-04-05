# Feature Specification: Simplified Market UI

**Feature Branch**: `003-simplify-market-ui`  
**Created**: 2026-04-05  
**Status**: Draft  
**Input**: User description: "Improve the market UI by removing the distribution view and quote volume history, moving constituents into a separate index-specific tab, and automatically sourcing available market symbols and indices from published repository data or config so the UI reflects what is actually available while keeping the design simpler and lower-complexity. Use OHLC with the absolute/nominal volume like TradingView, not simple lines, and include histograms."

**Note**: Keep this document focused on user-visible behavior and scope.
Implementation choices, stack details, and internal architecture belong in
`plan.md` or a companion project spec when they are not externally visible.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Inspect Published Market Sessions (Priority: P1)

A visitor opens the dashboard and can inspect each published market symbol through
an OHLC-style history view paired with normalized nominal volume in the same chart
frame, without relying on a live backend or simple closing-price lines.

**Why this priority**: This is the primary job of the UI, and the chart format must
match how market users expect to read historical sessions.

**Independent Test**: Open the static site, select a published symbol, and confirm
the page shows session-by-session OHLC history with nominal volume beneath it using
repository-published files only.

**Acceptance Scenarios**:

1. **Given** published market files are available, **When** the visitor lands on the
   dashboard, **Then** the default symbol view shows an OHLC-style market chart with
   aligned normalized nominal volume in the same chart frame and the latest refresh
   status.
2. **Given** multiple published market symbols are available, **When** the visitor
   switches symbols, **Then** the chart and summary content update to the newly
   selected symbol without requiring a live backend.
3. **Given** published VIX data is available, **When** the visitor inspects a symbol,
   **Then** the page still presents volatility context without replacing the OHLC
   market view with simple line charts.

---

### User Story 2 - Review Distribution Context (Priority: P2)

A visitor can still review price and nominal-volume histograms for the selected
symbol, but without a separate distribution-focused workflow that adds navigation
overhead.

**Why this priority**: The histogram views remain useful context, but they are
secondary to the main market chart and should not dominate the navigation model.

**Independent Test**: Open the static site, select a symbol, and confirm the page
shows price and nominal-volume histograms in the simplified market analysis layout.

**Acceptance Scenarios**:

1. **Given** a symbol with published market history, **When** the visitor opens its
   market analysis view, **Then** price and nominal-volume histograms are available
   without switching into a dedicated distribution tab.
2. **Given** the visitor changes the selected symbol, **When** histogram views are
   visible, **Then** both histograms recompute from the newly selected symbol's
   published dataset.

---

### User Story 3 - Browse Published Index Constituents Separately (Priority: P3)

A visitor can switch into an indices-specific area of the UI and browse published
constituent files independently from the market-symbol workflow, while the
repository keeps a dated record of constituent snapshots instead of embedding
per-row fetch timestamps.

**Why this priority**: Constituents belong to index reference data, not to the
selected symbol view, so separating them simplifies the main dashboard.

**Independent Test**: Open the static site, switch to the indices section, choose an
available index, and confirm the published constituent table updates correctly.

**Acceptance Scenarios**:

1. **Given** published constituent datasets are available, **When** the visitor opens
   the indices tab, **Then** the page shows the available indices independently from
   the market-symbol tab.
2. **Given** more than one published index is available, **When** the visitor chooses
   a different index, **Then** the constituent table updates using the matching
   published dataset.
3. **Given** an index is configured or published but its constituent file is missing,
   **When** the visitor opens the indices tab, **Then** the UI makes the missing data
   explicit instead of failing silently.
4. **Given** refreshed constituent outputs have not materially changed, **When** a
   repository refresh runs, **Then** the published constituent files remain stable
   without churn from a per-row fetch timestamp field.
5. **Given** a refresh runs on a later day, **When** constituent data is published,
   **Then** the repository retains a dated snapshot for that day so constituent
   history can be inspected by publication date such as `2025-07-01`.

---

### Edge Cases

- What happens when a symbol is listed in configuration but has no usable market CSV?
- What happens when constituent files exist for only a subset of configured indices?
- How does the page behave when VIX data is unavailable but market history is present?
- How does the dashboard behave when a symbol has too few rows for a meaningful histogram?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a static user interface that can be hosted
  without a runtime backend service.
- **FR-002**: The system MUST derive the set of market symbols shown in the UI from
  published repository data and/or repository configuration rather than a hardcoded
  list in the page code.
- **FR-003**: The system MUST derive the set of index views shown in the UI from
  published repository data and/or repository configuration rather than a hardcoded
  list in the page code.
- **FR-004**: The system MUST show the selected market symbol using an OHLC-style
  historical chart rather than a simple line-only price chart.
- **FR-005**: The system MUST show nominal volume for the selected symbol in a lower
  panel within the same chart component as the OHLC history.
- **FR-005a**: The system MUST normalize nominal-volume rendering so the lower panel
  stays visually comparable across the selected symbol's visible range.
- **FR-006**: The system MUST continue to show volatility context when published VIX
  data is available.
- **FR-007**: The system MUST continue to provide histogram views for price and
  nominal volume for the selected symbol.
- **FR-008**: The system MUST remove the dedicated distribution tab from the primary
  navigation.
- **FR-009**: The system MUST place constituent browsing in a separate top-level tab
  intended for indices rather than embedding it inside the main symbol-analysis flow.
- **FR-010**: The system MUST display the latest published refresh status, including
  whether the last refresh succeeded and which symbols were refreshed.
- **FR-011**: The system MUST make missing-data states visible to the user for both
  market-symbol and index-constituent content.
- **FR-012**: The system MUST publish constituent datasets with a stable schema that
  excludes volatile per-row fetch timestamps when they do not add user-facing value.
- **FR-013**: The system MUST not publish per-row `fetched_at` fields in market or
  constituent CSV outputs.
- **FR-014**: The system MUST persist dated constituent snapshot files by publication
  day so constituent history can be reviewed without relying on embedded fetch
  timestamps.

### Key Entities *(include if feature involves data)*

- **Published Market Symbol**: A tracked symbol with repository-published daily OHLC,
  share volume, and nominal quote volume history plus display metadata.
- **Published Index Dataset**: A named index view backed by a published constituent
  file, dated snapshot history, and display metadata used by the indices tab.
- **Published Refresh Status**: The latest snapshot of refresh timestamps, refreshed
  symbols, failures, and status messages shown to visitors.
- **UI Selection State**: The currently selected market symbol, active top-level tab,
  selected index dataset, and any constituent filter text.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can reach a populated OHLC market view from repository data
  within 10 seconds on a typical broadband connection.
- **SC-002**: Switching between any two published market symbols updates the visible
  market analysis view in under 2 seconds.
- **SC-003**: 100% of market symbols with usable published datasets appear as
  selectable options in the market tab.
- **SC-004**: 100% of published or configured index datasets with usable constituent
  files appear as selectable options in the indices tab.
- **SC-005**: A visitor can reach either the market-analysis tab or the indices tab
  in one top-level navigation action from the dashboard landing state.
- **SC-006**: A refresh that produces no constituent membership changes does not
  generate constituent-file diffs caused only by per-row timestamp metadata.
- **SC-007**: After a successful refresh on a new day, a reviewer can identify that
  day's constituent snapshot from the repository layout in under 30 seconds.

## Assumptions

- The repository continues to publish market CSVs under `data/market/` and
  constituent CSVs under `data/constituents/`, with dated constituent history stored
  in a repository-visible path.
- The existing refresh pipeline remains responsible for producing data files and
  repository configuration before the UI packages them.
- The simplified layout may reposition histogram views, but it does not need a new
  route or a multi-page information architecture.
- Editing symbol or index configuration from the UI is out of scope for this slice.

## Out of Scope

- Live market-data fetching from the browser
- User-authored watchlists, drawings, or interactive trading tools
- Managing refresh schedules or editing repository configuration from the UI
