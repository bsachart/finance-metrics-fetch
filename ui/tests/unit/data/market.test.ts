import { describe, expect, it } from "vitest";

import {
  buildPriceSeries,
  buildQuoteVolumeSeries,
  buildSummaryMetrics,
  summarizeMarket,
} from "../../../src/lib/data/market";

const points = [
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
    expect(buildPriceSeries(points)).toHaveLength(2);
    expect(buildQuoteVolumeSeries(points)[1]?.value).toBe(255000);
  });

  it("summarizes market series into metrics", () => {
    expect(summarizeMarket(points)?.latestClose).toBe(510);
    expect(buildSummaryMetrics(points)).toHaveLength(4);
  });
});
