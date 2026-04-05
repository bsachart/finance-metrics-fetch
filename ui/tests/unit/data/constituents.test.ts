import { describe, expect, it } from "vitest";

import { filterConstituents } from "../../../src/lib/data/constituents";

describe("constituent filters", () => {
  it("filters by symbol and sector text", () => {
    const filtered = filterConstituents(
      [
        {
          fetched_at: "2026-04-05T00:00:00Z",
          index_name: "sp500",
          name: "Apple Inc.",
          sector: "Information Technology",
          source_url: "https://example.com",
          sub_industry: "Hardware",
          symbol: "AAPL",
        },
        {
          fetched_at: "2026-04-05T00:00:00Z",
          index_name: "sp500",
          name: "Bank Corp",
          sector: "Financials",
          source_url: "https://example.com",
          sub_industry: "Banking",
          symbol: "BANK",
        },
      ],
      "tech",
    );

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.symbol).toBe("AAPL");
  });
});
