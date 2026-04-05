# Contract: UI Routes

## Route Surface

- `/`: market dashboard landing page

## Page Responsibilities

### `/`

- Display refresh status sourced from packaged data
- Display a symbol selector sourced from packaged config and available market assets
- Display market-history charts for the selected symbol
- Display histogram-style distributions for price and quote volume
- Display constituent reference views for S&P 500 and Nasdaq-100

## Error Responsibilities

- Show a visible empty or error state when packaged assets are missing or invalid
- Keep the page navigable even when one data section fails to load
