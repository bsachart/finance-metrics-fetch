# Data Model: Config-Driven Market Fetch

## TickerConfig

**Purpose**: Defines which market datasets should be refreshed and displayed.

**Fields**:

- `symbol`: string, required, unique ticker identifier
- `label`: string, required, human-readable display name
- `enabled`: boolean, required, defaults to `true`
- `role`: enum, required, one of `asset`, `volatility`, `benchmark`
- `source`: string, required, initial value `yahoo_finance`

**Validation Rules**:

- `symbol` must be non-empty after trimming
- enabled ticker symbols must be unique
- at least one enabled ticker must exist
- at most one volatility-context ticker is required for the initial UI

## TickerHistoryRow

**Purpose**: Represents one daily historical record for a configured ticker.

**Fields**:

- `date`: date, required
- `symbol`: string, required
- `open`: decimal, required
- `high`: decimal, required
- `low`: decimal, required
- `close`: decimal, required
- `volume`: integer, required
- `quote_volume`: decimal, required

**Validation Rules**:

- `high` must be greater than or equal to `open`, `close`, and `low`
- `low` must be less than or equal to `open`, `close`, and `high`
- `volume` must be zero or greater
- `quote_volume` must equal `close * volume`
- one row per `symbol` and `date`

## ConstituentRow

**Purpose**: Represents one index membership entry extracted from Wikipedia.

**Fields**:

- `index_name`: enum, required, one of `sp500`, `nasdaq100`
- `symbol`: string, required
- `name`: string, required
- `sector`: string, optional
- `sub_industry`: string, optional
- `source_url`: string, required
- `fetched_at`: datetime, required

**Validation Rules**:

- one row per `index_name` and `symbol`
- `symbol` and `name` must be non-empty
- fields unavailable for a source table may be null, but required fields may
  not

## RefreshRun

**Purpose**: Captures the result of a complete refresh execution.

**Fields**:

- `started_at`: datetime, required
- `finished_at`: datetime, required
- `status`: enum, required, one of `success`, `partial_failure`, `failure`
- `refreshed_symbols`: list of strings, required
- `failed_symbols`: list of strings, required
- `failed_sources`: list of strings, required
- `messages`: list of strings, required

**Validation Rules**:

- `finished_at` must be later than or equal to `started_at`
- `status` must reflect whether any symbol or source failed
- messages must identify each failed source or ticker when failures occur

## PublishedTickerDataset

**Purpose**: Defines the normalized frontend payload for a single ticker view.

**Fields**:

- `symbol`: string, required
- `label`: string, required
- `price_series`: list of OHLC records, required
- `quote_volume_series`: list of histogram records, required
- `vix_series`: list of comparison records, required
- `last_updated`: datetime, required

**Validation Rules**:

- all series must use the same sortable date domain
- `vix_series` may be empty only if the configured volatility ticker has no
  successful refresh output
- `last_updated` must reflect the latest successful refresh used to build the
  payload
