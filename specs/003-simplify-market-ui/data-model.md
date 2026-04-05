# Data Model: Simplified Market UI

## PublishedAssetManifest

- Purpose: Declares which market symbols and index datasets are available in the
  packaged static site.
- Fields:
  - `symbols`: list of published market-symbol entries
  - `indices`: list of published index entries

## PublishedSymbolEntry

- Purpose: Describes one published market symbol available to the dashboard.
- Fields:
  - `symbol`: canonical symbol identifier
  - `label`: user-facing label
  - `role`: symbol role such as asset, benchmark, or volatility
  - `enabled`: whether config still marks it as available for the UI
  - `has_market_data`: whether a matching market CSV was found during packaging

## PublishedIndexEntry

- Purpose: Describes one index dataset available to the indices tab.
- Fields:
  - `key`: canonical index identifier such as `sp500`
  - `label`: user-facing label
  - `enabled`: whether config still marks it as available for the UI
  - `has_constituents`: whether a matching constituent CSV was found during packaging

## PublishedMarketHistory

- Purpose: Session-level market history used by the main chart and histograms.
- Fields:
  - `date`
  - `symbol`
  - `open`
  - `high`
  - `low`
  - `close`
  - `volume`
  - `quote_volume`
- Validation:
  - No `fetched_at` field in published market CSVs

## PublishedConstituentRecord

- Purpose: One row in a published index constituent dataset.
- Fields:
  - `index_name`
  - `symbol`
  - `name`
  - `sector`
  - `sub_industry`
  - `source_url`
- Validation:
  - Schema remains stable across refreshes
  - No per-row `fetched_at` field

## PublishedConstituentSnapshot

- Purpose: A dated constituent artifact representing one index membership view on
  one publication day.
- Fields:
  - `index_name`
  - `snapshot_date`
  - `path`
  - `row_count`

## UISelectionState

- Purpose: Captures the current dashboard view state.
- Fields:
  - `active_tab`: `market` or `indices`
  - `selected_symbol`
  - `selected_index`
  - `constituent_filter`
