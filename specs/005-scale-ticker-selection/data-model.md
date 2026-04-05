# Data Model: Scalable Ticker Selection

## TickerDiscoveryState

- Purpose: Captures the current state of ticker search, filtering, and active selection.
- Fields:
  - `selectedSymbol`
  - `searchQuery`
  - `activeFilter`
  - `recentSymbols`
- Validation:
  - `selectedSymbol` must refer to a published symbol with market data
  - `activeFilter` must resolve to an available filter option or default to `All`
  - `recentSymbols` must retain only published symbols with market data

## TickerFilterOption

- Purpose: Represents a compact filter that narrows the ticker universe.
- Fields:
  - `key`
  - `label`
  - `symbolCount`
- Validation:
  - `All` is always available
  - index-based filters appear only when the related constituent dataset exists

## TickerSearchEntry

- Purpose: Represents a ticker candidate shown in search results and the compact list.
- Fields:
  - `symbol`
  - `label`
  - `matchesQuery`
  - `filterKeys`
  - `isActive`
  - `isRecent`
  - `trendPoints`
  - `lastClose`
  - `lastChange`
- Validation:
  - `trendPoints` may be empty when insufficient market history exists
  - `lastClose` and `lastChange` are optional summaries derived from published history

## QuickAccessWatchlist

- Purpose: Represents the ordered strip of recently viewed tickers.
- Fields:
  - `symbols`
  - `activeSymbol`
- Validation:
  - order reflects most recent use
  - duplicate symbols are removed
  - length is capped to keep the strip compact

## SearchResultView

- Purpose: Describes the compact visible list after query and filter logic are applied.
- Fields:
  - `entries`
  - `emptyReason`
- Validation:
  - `entries` respects both the active filter and search query
  - `emptyReason` is present only when no entries match

## VixIndicatorState

- Purpose: Captures the derived chart presentation rules for VIX visibility.
- Fields:
  - `isVisible`
  - `baselineStart`
  - `thresholdState`
  - `strokeColor`
  - `fillOpacity`
  - `hoverValue`
- Validation:
  - `baselineStart` is always `0`
  - `thresholdState` changes when VIX crosses the elevated-volatility threshold
  - `hoverValue` is shown only when VIX data exists for the active chart point
