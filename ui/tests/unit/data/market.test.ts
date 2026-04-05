import { describe, expect, it } from "vitest";

import {
  aggregateMarketPoints,
  applyMarketView,
  buildCandlestickSeries,
  buildNormalizedQuoteVolumeSeries,
  buildPriceSeries,
  filterMarketPointsByLookback,
  buildSummaryMetrics,
  getVolumeScale,
  summarizeMarket,
} from "../../../src/lib/data/market";

const points = [
  {
    close: 490,
    date: "2025-03-01",
    high: 493,
    low: 486,
    open: 488,
    quote_volume: 49000,
    symbol: "VOO",
    volume: 100,
  },
  {
    close: 503,
    date: "2026-04-04",
    high: 505,
    low: 498,
    open: 500,
    quote_volume: 50300,
    symbol: "VOO",
    volume: 100,
  },
  {
    close: 510,
    date: "2026-04-05",
    high: 512,
    low: 506,
    open: 507,
    quote_volume: 255000,
    symbol: "VOO",
    volume: 500,
  },
];

describe("market helpers", () => {
  it("builds chart-friendly series", () => {
    expect(buildPriceSeries(points)).toHaveLength(3);
    expect(buildCandlestickSeries(points)[2]?.close).toBe(510);
    expect(buildNormalizedQuoteVolumeSeries(points, getVolumeScale(points))[2]?.value).toBe(255);
  });

  it("summarizes market series into metrics", () => {
    expect(summarizeMarket(points)?.latestClose).toBe(510);
    expect(buildSummaryMetrics(points)).toHaveLength(4);
  });

  it("filters and aggregates market views", () => {
    expect(filterMarketPointsByLookback(points, "1M")).toHaveLength(2);
    expect(aggregateMarketPoints(points, "1M")).toHaveLength(2);
    expect(applyMarketView(points, "ALL", "1W").length).toBeGreaterThan(0);
  });
});
