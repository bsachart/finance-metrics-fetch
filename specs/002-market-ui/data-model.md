# Data Model: Market Data UI

## PublishedMarketPoint

- **Fields**:
  - `date`: ISO calendar date
  - `symbol`: tracked symbol
  - `open`: numeric opening price
  - `high`: numeric high price
  - `low`: numeric low price
  - `close`: numeric closing price
  - `volume`: numeric share volume
  - `quote_volume`: numeric nominal traded value
- **Validation**:
  - `date` must be parseable as a daily time-series point
  - `symbol` must match the selected published symbol
  - numeric fields must be finite numbers

## PublishedStatus

- **Fields**:
  - `started_at`: timestamp
  - `finished_at`: timestamp
  - `status`: refresh outcome
  - `refreshed_symbols`: list of symbols
  - `failed_symbols`: list of symbols
  - `failed_sources`: list of source names
  - `messages`: list of human-readable status messages
- **Validation**:
  - `status` is one of `success`, `partial_failure`, or `failure`
  - lists default to empty when absent

## PublishedConstituent

- **Fields**:
  - `index_name`: source index identifier
  - `symbol`: constituent symbol
  - `name`: company name
  - `sector`: sector label
  - `sub_industry`: sub-industry label
  - `source_url`: provenance URL
  - `fetched_at`: timestamp
- **Validation**:
  - `index_name` is either `sp500` or `nasdaq100`
  - `symbol` and `name` are non-empty

## SymbolOption

- **Fields**:
  - `symbol`: tracked symbol
  - `label`: display label
  - `has_market_data`: whether a market file is available
  - `is_volatility_series`: whether the symbol represents the VIX context series

## HistogramBucket

- **Fields**:
  - `start`: lower bound
  - `end`: upper bound
  - `count`: number of observations in the bucket
- **Validation**:
  - `end` must be greater than `start`
  - `count` must be a non-negative integer

## ViewState

- **Fields**:
  - `selected_symbol`: active market symbol
  - `active_panel`: market, distribution, or constituents
  - `selected_index`: active constituent list
  - `constituent_filter`: free-text table filter
- **State transitions**:
  - default load selects the first available non-VIX market symbol
  - symbol changes trigger derived chart and histogram recalculation
  - panel changes preserve the current symbol selection
