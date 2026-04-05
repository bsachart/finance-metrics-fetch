# Feature Specification: Simplify Chart Layout

**Feature Branch**: `004-simplify-chart-layout`  
**Created**: 2026-04-05  
**Status**: Draft  
**Input**: User description: "Separate VIX from the rest of the market UI while still showing it by default on the market chart with a simple hide toggle. Move the main market chart to the top of the page, reduce the oversized title and extra sections, and simplify the layout substantially. Split market tickers from market constituents with clearer top-level navigation like separate Tickers and Market Constituents tabs, following a deeply simple John Ousterhout style UI approach."

**Note**: Keep this document focused on user-visible behavior and scope.
Implementation choices, stack details, and internal architecture belong in
`plan.md` or a companion project spec when they are not externally visible.

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Read The Market Quickly (Priority: P1)

As a user opening the dashboard, I want the main chart to appear first with the
essential controls nearby so I can understand the selected ticker without
scrolling through status blocks and secondary sections.

**Why this priority**: The chart is the primary reason to visit the page. If it
is buried behind large headings and multiple summary panels, the page slows down
the main task.

**Independent Test**: Open the dashboard and confirm the first major content
area is the market chart with its symbol selector, lookback controls, and bar
period controls visible without relying on lower sections.

**Acceptance Scenarios**:

1. **Given** the dashboard has loaded, **When** the user lands on the market
   view, **Then** the main chart is shown before secondary summaries or data
   tables.
2. **Given** the market view is open, **When** the user changes the selected
   ticker, lookback, or bar period, **Then** the chart updates in place without
   requiring navigation to another section.

---

### User Story 2 - Keep VIX Visible But Optional (Priority: P2)

As a user comparing a ticker against market stress, I want VIX shown on the
market chart by default, but I also want a simple way to hide it when I need a
cleaner view.

**Why this priority**: VIX is useful context, but it should not compete with
the selected ticker or force a permanent overlay.

**Independent Test**: Open a non-VIX ticker, confirm VIX is visible by default,
then hide and re-show it using a single explicit control.

**Acceptance Scenarios**:

1. **Given** a ticker other than VIX is selected, **When** the market chart
   renders, **Then** the chart includes VIX context by default.
2. **Given** VIX is visible, **When** the user turns off the VIX display,
   **Then** the chart removes the VIX series while preserving the selected
   ticker and the current chart settings.

---

### User Story 3 - Navigate Tickers And Constituents Separately (Priority: P3)

As a user switching between symbol analysis and index membership browsing, I
want separate top-level navigation for tickers and market constituents so each
task has a simpler, clearer screen.

**Why this priority**: Ticker analysis and constituent browsing are different
jobs. Splitting them reduces visual noise and avoids mixing selection controls
with large constituent tables.

**Independent Test**: Switch between the ticker-focused view and the market
constituents view and confirm each area only shows the controls and content
needed for that job.

**Acceptance Scenarios**:

1. **Given** the dashboard is open, **When** the user selects the ticker
   section, **Then** the page emphasizes symbol selection and chart analysis
   without showing constituent tables in the same working area.
2. **Given** the dashboard is open, **When** the user selects the market
   constituents section, **Then** the page emphasizes index membership browsing
   without showing ticker-specific chart controls in the same working area.

---

### Edge Cases

- What happens when VIX data is missing from the published repository snapshot
  while other ticker data is available?
- What happens when the selected ticker itself is VIX and the user toggles the
  VIX overlay control?
- How does the dashboard behave on smaller screens where chart controls and
  navigation compete for horizontal space?
- What happens when a user switches from the constituent view back to the
  ticker view after changing the selected symbol or chart settings?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The dashboard MUST place the main market chart near the top of
  the ticker view, ahead of secondary summaries, status panels, and supporting
  sections.
- **FR-002**: The ticker view MUST reduce oversized heading treatment and
  remove or collapse non-essential sections so the first screen is focused on
  analysis rather than page framing.
- **FR-003**: The market chart MUST show the selected ticker together with VIX
  context by default when VIX data is available.
- **FR-004**: The ticker view MUST provide a simple explicit control that lets
  users hide or re-show the VIX display without changing the selected ticker,
  lookback period, or bar period.
- **FR-005**: If VIX data is unavailable, the ticker view MUST continue to show
  the selected ticker and clearly indicate that VIX context is unavailable.
- **FR-006**: The dashboard MUST provide separate top-level navigation for
  ticker analysis and market constituent browsing.
- **FR-007**: The ticker analysis section MUST keep symbol selection distinct
  from constituent browsing so users do not see constituent tables mixed into
  the primary chart workspace.
- **FR-008**: The market constituents section MUST keep index membership
  controls and constituent data distinct from ticker chart controls.
- **FR-009**: The dashboard MUST preserve the existing lookback and bar period
  controls in the ticker analysis flow.
- **FR-010**: The simplified layout MUST remain usable on desktop and mobile
  viewports without hiding core controls behind complex interaction patterns.

### Key Entities *(include if feature involves data)*

- **Ticker Analysis View**: The dashboard area focused on selecting a symbol,
  viewing the market chart, and adjusting chart controls.
- **VIX Context Display**: The optional chart element that shows VIX alongside
  the selected ticker and is visible by default when available.
- **Market Constituents View**: The dashboard area focused on browsing index
  membership and constituent history without ticker chart controls.
- **Navigation Mode**: The top-level section choice that moves the user between
  ticker analysis and constituent browsing.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time user can reach the main chart and change ticker,
  lookback, and bar period from the initial viewport without searching through
  lower sections.
- **SC-002**: Users can switch VIX visibility on and off in one interaction and
  always understand whether VIX is currently shown.
- **SC-003**: Users can move between ticker analysis and market constituent
  browsing in one top-level navigation action.
- **SC-004**: The simplified layout reduces the number of major content blocks
  shown in the default ticker view compared with the prior dashboard while
  preserving the existing chart analysis workflow.

## Assumptions

- The existing repository-published market data and VIX dataset remain the
  source for the dashboard.
- The current lookback and bar period behavior is worth preserving unless it
  directly conflicts with the simplified layout.
- The current constituent datasets and history files remain available and do
  not need schema changes for this feature.
- The work targets the existing static dashboard rather than adding a live
  backend or authentication flow.

## Out of Scope

- Adding new data sources, new indices, or new market metrics beyond the
  existing ticker and VIX data.
- Redesigning the refresh pipeline or changing published artifact formats.
- Adding advanced chart tooling such as drawing tools, cross-chart syncing, or
  custom saved layouts.
