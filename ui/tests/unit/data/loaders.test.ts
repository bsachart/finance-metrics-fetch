import { describe, expect, it } from "vitest";

import {
  loadAssetManifest,
  loadConstituentCsv,
  loadMarketCsv,
  loadStatus,
  loadTickerConfig,
} from "../../../src/lib/data/loaders";

function createFetch(payloads: Record<string, string>): typeof fetch {
  return (async (input: string | URL | Request) => {
    const url = typeof input === "string" ? input : input.toString();
    const payload = payloads[url];

    if (!payload) {
      return new Response("missing", { status: 404 });
    }

    return new Response(payload, { status: 200 });
  }) as typeof fetch;
}

describe("asset loaders", () => {
  it("loads ticker configuration, asset manifest, and refresh status", async () => {
    const fetchFn = createFetch({
      "/published/asset-manifest.json": JSON.stringify({
        indices: [{ enabled: true, has_constituents: true, key: "sp500", label: "S&P 500" }],
        symbols: [{ enabled: true, has_market_data: true, label: "VOO", role: "benchmark", symbol: "VOO" }],
      }),
      "/published/data/status/latest.json": JSON.stringify({
        failed_sources: [],
        failed_symbols: [],
        finished_at: "2026-04-05T00:00:00Z",
        messages: [],
        refreshed_symbols: ["VOO"],
        started_at: "2026-04-05T00:00:00Z",
        status: "success",
      }),
      "/published/tickers.json": JSON.stringify({
        indices: [{ enabled: true, key: "sp500", label: "S&P 500", source: "wikipedia" }],
        tickers: [{ enabled: true, label: "VOO", role: "benchmark", source: "x", symbol: "VOO" }],
      }),
    });

    const [config, manifest, status] = await Promise.all([
      loadTickerConfig(fetchFn),
      loadAssetManifest(fetchFn),
      loadStatus(fetchFn),
    ]);

    expect(config.tickers).toHaveLength(1);
    expect(manifest.indices[0]?.key).toBe("sp500");
    expect(status.status).toBe("success");
  });

  it("parses market and constituent csv assets", async () => {
    const fetchFn = createFetch({
      "/published/data/constituents/sp500.csv": [
        "index_name,symbol,name,sector,sub_industry,source_url",
        "sp500,AAPL,Apple Inc.,Information Technology,Hardware,https://example.com",
      ].join("\n"),
      "/published/data/market/VOO.csv": [
        "date,symbol,open,high,low,close,volume,quote_volume",
        "2026-04-04,VOO,500,505,498,503,100,50300",
      ].join("\n"),
    });

    const [market, constituents] = await Promise.all([
      loadMarketCsv(fetchFn, "VOO"),
      loadConstituentCsv(fetchFn, "sp500"),
    ]);

    expect(market[0]?.quote_volume).toBe(50300);
    expect(constituents[0]?.symbol).toBe("AAPL");
  });
});
