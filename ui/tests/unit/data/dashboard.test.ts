import { describe, expect, it } from "vitest";

import { getDefaultSymbol, loadDashboardData } from "../../../src/lib/data/dashboard";

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

describe("dashboard data orchestration", () => {
  it("loads published dashboard assets and picks a non-vix default symbol", async () => {
    const fetchFn = createFetch({
      "/published/data/constituents/nasdaq100.csv":
        "index_name,symbol,name,sector,sub_industry,source_url\nnasdaq100,MSFT,Microsoft,Information Technology,Software,https://example.com",
      "/published/data/constituents/sp500.csv":
        "index_name,symbol,name,sector,sub_industry,source_url\nsp500,VOO,Vanguard S&P 500 ETF,Financials,ETF,https://example.com",
      "/published/data/market/%5EVIX.csv":
        "date,symbol,open,high,low,close,volume,quote_volume\n2026-04-04,^VIX,20,21,19,20.5,10,205",
      "/published/data/market/VOO.csv":
        "date,symbol,open,high,low,close,volume,quote_volume\n2026-04-04,VOO,500,505,498,503,100,50300",
      "/published/asset-manifest.json": JSON.stringify({
        indices: [
          { enabled: true, has_constituents: true, key: "sp500", label: "S&P 500" },
          { enabled: true, has_constituents: true, key: "nasdaq100", label: "Nasdaq-100" },
        ],
        symbols: [
          { enabled: true, has_market_data: true, label: "CBOE Volatility Index", role: "volatility", symbol: "^VIX" },
          { enabled: true, has_market_data: true, label: "Vanguard S&P 500 ETF", role: "benchmark", symbol: "VOO" },
        ],
      }),
      "/published/data/status/latest.json": JSON.stringify({
        failed_sources: [],
        failed_symbols: [],
        finished_at: "2026-04-05T00:00:00Z",
        messages: [],
        refreshed_symbols: ["VOO", "^VIX"],
        started_at: "2026-04-05T00:00:00Z",
        status: "success",
      }),
      "/published/tickers.json": JSON.stringify({
        indices: [
          { enabled: true, key: "sp500", label: "S&P 500", source: "wikipedia" },
          { enabled: true, key: "nasdaq100", label: "Nasdaq-100", source: "wikipedia" },
        ],
        tickers: [
          { enabled: true, label: "CBOE Volatility Index", role: "volatility", source: "x", symbol: "^VIX" },
          { enabled: true, label: "Vanguard S&P 500 ETF", role: "benchmark", source: "x", symbol: "VOO" },
        ],
      }),
    });

    const payload = await loadDashboardData(fetchFn);

    expect(payload.dashboard.vixSymbol).toBe("^VIX");
    expect(getDefaultSymbol(payload.dashboard)).toBe("VOO");
    expect(payload.dashboard.constituentsByIndex.sp500).toHaveLength(1);
    expect(payload.dashboard.indexOptions).toHaveLength(2);
  });
});
