# Feature Specification: HUD-Centric Dashboard

**Feature Branch**: `008-hud-dashboard`  
**Created**: 2026-04-05  
**Status**: Draft  
**Input**: User description: "Standardize the dashboard around a HUD-centric chart architecture: remove chart tooltips and legends, add a persistent HUD below the controls that shows latest-bar and hover-bar OHLC, dollar volume, and VIX data, keep the chart canvas visually clean, preserve dual-axis integrity, move status to the subtle header indicator, standardize margins and axis/date formatting, and do the full specify, plan, tasks, and implementation workflow."

**Note**: Keep this document focused on user-visible behavior and scope.
Implementation choices, stack details, and internal architecture belong in
`plan.md` or a companion project spec when they are not externally visible.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read one stable market HUD while exploring the chart (Priority: P1)

As a dashboard user, I want one persistent market HUD below the chart controls
so I can read the latest or hovered bar values without chasing tooltips around
the canvas.

**Why this priority**: The HUD is the core of the redesign. If the dashboard
still depends on floating chart tooltips, the chart keeps the same visual
instability and cognitive noise.

**Independent Test**: Can be fully tested by opening the ticker view, reading
the default latest-bar values in the HUD, moving the cursor across the chart,
and confirming the HUD updates to the hovered bar values in place.

**Acceptance Scenarios**:

1. **Given** the ticker chart is visible, **When** the page loads, **Then** the
   HUD shows the latest available OHLC, dollar volume, and VIX values for the
   far-right bar.
2. **Given** the user moves the cursor across the chart, **When** the crosshair
   changes bars, **Then** the HUD updates in place to the hovered bar values.
3. **Given** the user leaves the chart or the hovered bar becomes unavailable,
   **When** hover context ends, **Then** the HUD returns to the latest available
   bar values rather than becoming empty.

---

### User Story 2 - See a clean chart canvas with trustworthy axes (Priority: P2)

As a dashboard user, I want the chart area to stay visually quiet and to use
clear price and indicator scales so I can trust what I am reading at a glance.

**Why this priority**: Once the HUD owns the numeric readout, the next highest
value improvement is removing redundant plot chrome and making scale ownership
obvious.

**Independent Test**: Can be tested by turning VIX on, reading both axes,
confirming the chart no longer shows legend or tooltip clutter inside the plot,
and confirming candles keep breathing room from the chart borders.

**Acceptance Scenarios**:

1. **Given** the ticker chart is visible, **When** the user scans the canvas,
   **Then** the chart does not show a floating legend or standard chart tooltip.
2. **Given** price, VIX, and dollar volume are visible, **When** the user reads
   the axes, **Then** price is read from the left axis while VIX and volume are
   read from the right side without misleading scale overlap.
3. **Given** the chart is rendered, **When** the user inspects the top and
   bottom of the price range, **Then** the plotted data keeps a visible safety
   buffer from the chart borders.

---

### User Story 3 - Keep layout and status context consistent across the workspace (Priority: P3)

As a dashboard user, I want the HUD, chart, and status context to align
cleanly with the rest of the dashboard so the page feels like one analytical
surface instead of stacked widgets.

**Why this priority**: This improves trust and polish, but the dashboard still
delivers core value once the HUD and axis cleanup are in place.

**Independent Test**: Can be tested by comparing the header, `Find Ticker`
placement, control row, HUD, and chart widths, reading the `Data as of` area,
and checking the x-axis date format while switching among tickers and timeframes.

**Acceptance Scenarios**:

1. **Given** the ticker workspace is visible, **When** the user scans left and
   right edges of the header, controls, HUD, and chart, **Then** those primary
   elements align to the same inner margins.
2. **Given** the dashboard is healthy, **When** the user reads `Data as of`,
   **Then** system status appears only as a subtle indicator instead of a large
   footer card.
3. **Given** the ticker workspace is visible, **When** the user looks for the
   ticker-switching control, **Then** `Find Ticker` sits inside the main dashboard
   container near the other chart controls instead of floating in the global header.
4. **Given** the x-axis is visible, **When** the user reads date labels,
   **Then** they use the same short month-and-day format across the chart.
5. **Given** the ticker control row is visible, **When** the user scans the VIX
   control, **Then** it reads as one compact `VIX` toggle rather than as a
   repeated label plus a `Show VIX` control.

### Edge Cases

- What happens when VIX is hidden or unavailable for the selected ticker while the HUD still expects an indicator field?
- What happens when the selected timeframe leaves too few bars for meaningful hover movement?
- What happens when the cursor is outside the chart canvas on touch devices or narrow screens where hover is intermittent?
- What happens when the latest market point is missing one of the expected values?
- What happens when the ticker workspace becomes narrow enough that the `Find Ticker` control and chart controls must wrap?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST replace the chart’s floating tooltip with one
  persistent HUD positioned immediately below the timeframe and VIX controls.
- **FR-002**: The system MUST show the latest available bar data in the HUD by
  default whenever the chart is visible.
- **FR-003**: The system MUST update the HUD in real time as the user moves the
  cursor across the chart.
- **FR-004**: The system MUST restore the HUD to the latest available bar data
  when hover context is no longer available.
- **FR-005**: The system MUST show open, high, low, close, dollar volume, and
  VIX values in the HUD whenever those values are available for the current bar.
- **FR-006**: The system MUST keep the chart canvas free of the current legend
  and standard chart tooltip.
- **FR-007**: The system MUST keep price data on the left axis.
- **FR-008**: The system MUST keep VIX and dollar volume on the right side
  rather than implying they share the price axis.
- **FR-009**: The system MUST prevent plotted candles from touching the chart’s
  top or bottom borders by preserving visible vertical padding.
- **FR-010**: The system MUST keep system refresh status in the header beside
  `Data as of` and MUST NOT reintroduce footer status cards.
- **FR-011**: The system MUST align the HUD, control row, chart, and main
  dashboard content to the same left and right margins.
- **FR-011a**: The system MUST place the `Find Ticker` control inside the main
  ticker dashboard container and keep it visually grouped with the chart controls.
- **FR-012**: The system MUST format x-axis date labels in a short month-and-day style.
- **FR-013**: The system MUST use stable-width HUD text styling so rapidly
  changing values do not visually jitter.
- **FR-014**: The system MUST use consistent color cues in the HUD so VIX and
  dollar volume can be identified without repeated full-text labels.
- **FR-015**: The system MUST continue to degrade gracefully when VIX data is
  hidden or unavailable by showing the remaining HUD fields without breaking layout.
- **FR-016**: The system MUST present the VIX control as one compact `VIX`
  toggle without a duplicated section label above it.

### Key Entities *(include if feature involves data)*

- **HUD State**: The currently displayed market snapshot for the chart,
  including whether values come from the latest bar or the hovered bar.
- **HUD Field**: An individual value shown in the HUD, such as close, high,
  dollar volume, or VIX, with a label, value, and semantic color cue.
- **Chart Scale Context**: The visible ownership of left and right axes for
  price versus indicator and volume information.
- **Header Status Indicator**: The compact health signal displayed beside
  `Data as of` without expanding into a separate footer block.
- **Workspace Control Zone**: The aligned cluster of `Find Ticker`, timeframe,
  bars, VIX, and HUD elements that configure and explain the ticker chart.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can read the latest bar values immediately on page load
  without hovering the chart.
- **SC-002**: Users can move across chart bars and keep up with value changes
  from one fixed HUD location without relying on floating tooltips.
- **SC-003**: Users can distinguish price scale ownership from indicator and
  volume scale ownership without trial and error.
- **SC-004**: The ticker workspace shows fewer separate chrome elements inside
  the chart area than before because legend and tooltip clutter are removed.
- **SC-005**: Healthy dashboard status remains visible without consuming a full
  card or footer section.
- **SC-006**: Users can identify the ticker-selection control as part of the
  ticker workspace rather than as a floating page-level element.

## Assumptions

- The HUD redesign applies to the ticker analysis workspace only, not the
  constituents workspace.
- Existing published market history remains the source for both latest-bar and
  hovered-bar HUD values.
- The current charting library can continue to provide hover position and axis
  control without requiring a new visualization package.
- The existing `Data as of` header area remains the single home for refresh health context.
- The current `Find Ticker` trigger remains a modal launcher rather than becoming a persistent inline text field.

## Out of Scope

- Live streaming market data or intraday updates.
- New comparison modes, additional indicators, or portfolio workflows.
- Replacing the existing ticker finder, local preference model, or constituents table in this feature.
