# Feature Specification: fix-chart-colors

**Feature Branch**: `009-fix-chart-colors`
**Created**: 2026-05-10
**Status**: Draft
**Input**: User description: "sync to head, there should mostly be changes related to data from our github actions. Can you fix the chart colors? The main discrepancy I see is that the Vix color is different than the line chart which is blue/purple"

**Note**: Keep this document focused on user-visible behavior and scope.
Implementation choices, stack details, and internal architecture belong in
`plan.md` or a companion project spec when they are not externally visible.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consistent Chart Legend and Line Colors (Priority: P1)

As a user viewing the financial chart, I want the color of the VIX indicator line to exactly match its corresponding label in the legend, so that I can easily identify the correct data points.

**Why this priority**: Correct data visualization and matching legend colors are critical to avoid misinterpreting financial charts.

**Independent Test**: Can be fully tested by verifying visually that the color of the VIX legend text matches the line color plotted on the chart.

**Acceptance Scenarios**:

1. **Given** the user is viewing a ticker chart with the VIX indicator enabled, **When** they look at the chart, **Then** the color of the VIX line matches the color of the VIX text in the legend.

### User Story 2 - Default Timeframe (Priority: P2)

As a user, I want the dashboard to default to a 1-year timeframe so that I can see a broader trend of the market when I first open the application.

**Why this priority**: Improves the initial user experience by providing a more comprehensive view of historical data by default.

**Independent Test**: Verify that when opening the application for the first time (or after clearing local storage), the "1Y" timeframe is selected.

**Acceptance Scenarios**:

1. **Given** no saved preferences, **When** the dashboard is loaded, **Then** the "1Y" timeframe is selected by default.

### Edge Cases

- What happens when a user switches between light and dark modes? (The colors should either remain identical or adapt consistently so they still match each other).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST render the VIX indicator line with the exact same color used for the VIX legend text.
- **FR-002**: System MUST ensure that the Volume metric also has consistent coloring between its chart series and legend.
- **FR-003**: System MUST default the initial chart timeframe to 1 Year (1Y).

### Key Entities

- **Chart Series**: The visual representation of data points on the chart.
- **Chart Legend**: Displays current values and corresponding colors for active chart metrics.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% color consistency between chart legends and their respective plotted series for all indicators (VIX, Volume).
- **SC-002**: Visual inspection confirms that users can correctly identify which chart series belongs to which legend entry by color.

## Assumptions

- We are updating the frontend UI configuration (e.g., Lightweight Charts).
- The existing chart data and layout structure remain unchanged.

## Out of Scope

- Adding new chart indicators.
- Modifying backend data fetching logic.
