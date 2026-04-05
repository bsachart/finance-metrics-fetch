# Quickstart: Market Data UI

## Prerequisites

- Node.js 20+
- Existing published data in `data/`

## Install

```bash
cd ui
npm install
```

## Run Locally

```bash
cd ui
npm run dev
```

Open the local site and confirm:

- the landing page shows the latest refresh status
- the symbol selector includes published symbols from `config/tickers.json`
- the selected symbol shows price, quote volume, and VIX context
- the distribution section shows histogram-style views for price and quote volume
- the constituents section shows both published index lists

## Build

```bash
cd ui
npm run build
```

## Preview The Static Output

```bash
cd ui
npm run preview
```

## Verification

```bash
cd ui
npm run check
npm run test
```
