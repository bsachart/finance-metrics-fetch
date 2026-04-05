# Data Model: Unified Analytics Workspace

## ActiveTimeframeState

- Purpose: Represents the shared analytical window for the ticker workspace.
- Fields:
  - `selectedLookback`
  - `selectedAggregation`
  - `timeframeLabel`
- Validation:
  - `selectedLookback` must match a supported timeframe preset
  - `selectedAggregation` must match a supported bar period
  - `timeframeLabel` must stay synchronized with the current selections

## TickerTrendSummary

- Purpose: Represents one ticker row's compact trend context for the active timeframe.
- Fields:
  - `symbol`
  - `label`
  - `lastClose`
  - `lastChange`
  - `trendPoints`
  - `trendDirection`
  - `timeframeLabel`
- Validation:
  - `trendPoints` may be empty when insufficient data exists
  - `trendDirection` must align with `lastChange`
  - `timeframeLabel` must match the active shared timeframe state

## TooltipGroup

- Purpose: Represents one logical group inside the chart hover display.
- Fields:
  - `kind`
  - `label`
  - `values`
- Validation:
  - `kind` is one of `price`, `volume`, or `indicator`
  - missing values are omitted without breaking the remaining groups

## VolatilityDisplayState

- Purpose: Represents the visible VIX presentation rules in the lower analytical pane.
- Fields:
  - `isVisible`
  - `axisLabelColor`
  - `seriesColor`
  - `baselineStart`
  - `hoverValue`
- Validation:
  - `axisLabelColor` and `seriesColor` stay visually consistent
  - `baselineStart` is always `0`
  - `hoverValue` appears only when data exists for the hovered point

## WorkspaceStatusState

- Purpose: Represents whether any refresh context needs to be shown in the ticker workspace.
- Fields:
  - `hasFailures`
  - `hasWarnings`
  - `messages`
- Validation:
  - success state without failures does not emit placeholder failure text
  - warnings and failures remain visible when actionable
