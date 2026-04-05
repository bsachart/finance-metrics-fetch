# Data Model: Command Center Finder

## TickerFinderState

- Purpose: Represents the current navigation state of the unified finder.
- Fields:
  - `isOpen`
  - `query`
  - `activeTab`
  - `highlightedResultIndex`
  - `selectedSymbol`
  - `recentSymbols`
- Validation:
  - `activeTab` must resolve to an available browse tab or default to `All`
  - `highlightedResultIndex` must resolve to a visible row or degrade to no highlight
  - `selectedSymbol` must refer to a published symbol with market data
  - `recentSymbols` must retain only published symbols still present in the snapshot

## FinderResultRow

- Purpose: Represents one ticker candidate inside the finder.
- Fields:
  - `symbol`
  - `label`
  - `lastClose`
  - `lastChangePercent`
  - `trendPoints`
  - `isActive`
  - `isRecent`
  - `tabMembership`
- Validation:
  - `trendPoints` are derived from the active timeframe
  - rows remain renderable even when trend data is sparse

## ActiveTickerHeader

- Purpose: Represents the prominent summary above the chart.
- Fields:
  - `symbol`
  - `label`
  - `latestPrice`
  - `priceDate`
- Validation:
  - `latestPrice` is omitted or degraded gracefully if the snapshot lacks a current close
  - header content always matches the active ticker

## ChartTooltipState

- Purpose: Represents the compact hover readout used in the chart.
- Fields:
  - `date`
  - `close`
  - `ohlcLine`
  - `volumeLine`
  - `vixLine`
- Validation:
  - `close` is the visual focus
  - missing VIX or volume data does not break the remaining tooltip lines

## ChartContextState

- Purpose: Represents the visible legend, VIX axis identity, and status visibility rules.
- Fields:
  - `legendItems`
  - `vixAxisColor`
  - `hasStatusIssues`
  - `statusIndicatorLabel`
- Validation:
  - legend items are visual references rather than pseudo-controls
  - VIX axis color matches the VIX series and tooltip color
  - success state does not emit placeholder failure sections
  - issue state collapses to a small header indicator rather than a footer card
