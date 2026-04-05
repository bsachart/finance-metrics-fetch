# Data Model: Simplify Chart Layout

## DashboardSection

- Purpose: Represents the top-level working mode of the dashboard.
- Values:
  - `tickers`
  - `constituents`

## TickerWorkspaceState

- Purpose: Captures the current ticker-analysis selections.
- Fields:
  - `selectedSymbol`
  - `selectedLookback`
  - `selectedAggregation`
  - `showVix`
- Validation:
  - `selectedSymbol` must refer to a symbol with market data
  - `showVix` defaults to `true` when VIX data is available

## ChartSeriesState

- Purpose: Describes the series rendered in the main chart.
- Fields:
  - `pricePoints`: selected ticker OHLC bars
  - `volumePoints`: selected ticker dollar-volume bars
  - `vixPoints`: optional VIX overlay series
  - `hasVixData`

## ConstituentsWorkspaceState

- Purpose: Captures the current constituent-browsing selections.
- Fields:
  - `selectedIndex`
  - `records`
- Validation:
  - `selectedIndex` must refer to an index with constituent data

