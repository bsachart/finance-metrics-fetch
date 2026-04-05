import { describe, expect, it } from "vitest";

import {
  buildPriceHistogram,
  buildQuoteVolumeHistogram,
} from "../../../src/lib/data/histograms";

const points = [
  {
    close: 100,
    date: "2026-04-01",
    high: 101,
    low: 99,
    open: 100,
    quote_volume: 1000,
    symbol: "ABC",
    volume: 10,
  },
  {
    close: 110,
    date: "2026-04-02",
    high: 112,
    low: 108,
    open: 109,
    quote_volume: 3000,
    symbol: "ABC",
    volume: 20,
  },
];

describe("histogram helpers", () => {
  it("builds price and quote-volume buckets", () => {
    expect(buildPriceHistogram(points).length).toBeGreaterThan(0);
    expect(buildQuoteVolumeHistogram(points).length).toBeGreaterThan(0);
  });
});
