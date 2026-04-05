import { describe, expect, it } from "vitest";

import {
  buildTickerDiscoveryState,
  getDefaultSymbol,
  loadDashboardData,
  pushRecentSymbol,
} from "../../../src/lib/data/dashboard";

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
      "/published/data/market/MSFT.csv":
        "date,symbol,open,high,low,close,volume,quote_volume\n2026-04-04,MSFT,400,405,398,403,100,40300",
      "/published/data/market/VOO.csv":
        "date,symbol,open,high,low,close,volume,quote_volume\n2026-04-04,VOO,500,505,498,503,100,50300",
      "/published/asset-manifest.json": JSON.stringify({
        indices: [
          { enabled: true, has_constituents: true, key: "sp500", label: "S&P 500" },
          { enabled: true, has_constituents: true, key: "nasdaq100", label: "Nasdaq-100" },
        ],
        symbols: [
          { enabled: true, has_market_data: true, label: "CBOE Volatility Index", role: "volatility", symbol: "^VIX" },
          { enabled: true, has_market_data: true, label: "Microsoft", role: "asset", symbol: "MSFT" },
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
          { enabled: true, label: "Microsoft", role: "asset", source: "x", symbol: "MSFT" },
          { enabled: true, label: "Vanguard S&P 500 ETF", role: "benchmark", source: "x", symbol: "VOO" },
        ],
      }),
    });

    const payload = await loadDashboardData(fetchFn);

    expect(payload.dashboard.vixSymbol).toBe("^VIX");
    expect(getDefaultSymbol(payload.dashboard)).toBe("VOO");
    expect(payload.dashboard.symbolOptions.map((option) => option.symbol)).toEqual([
      "VOO",
      "MSFT",
      "^VIX",
    ]);
    expect(payload.dashboard.indexOptions.map((option) => option.key)).toEqual([
      "sp500",
      "nasdaq100",
    ]);
    expect(payload.dashboard.constituentsByIndex.sp500).toHaveLength(1);
    expect(payload.dashboard.indexOptions).toHaveLength(2);
  });

  it("builds search, filter, and recent ticker discovery state", async () => {
    const fetchFn = createFetch({
      "/published/data/constituents/nasdaq100.csv":
        "index_name,symbol,name,sector,sub_industry,source_url\nnasdaq100,MSFT,Microsoft,Information Technology,Software,https://example.com",
      "/published/data/constituents/sp500.csv":
        "index_name,symbol,name,sector,sub_industry,source_url\nsp500,VOO,Vanguard S&P 500 ETF,Financials,ETF,https://example.com",
      "/published/data/market/%5EVIX.csv":
        "date,symbol,open,high,low,close,volume,quote_volume\n2026-04-03,^VIX,20,21,19,19.5,10,195\n2026-04-04,^VIX,20,21,19,21.5,10,215",
      "/published/data/market/MSFT.csv":
        "date,symbol,open,high,low,close,volume,quote_volume\n2026-04-03,MSFT,400,405,398,403,100,40300\n2026-04-04,MSFT,403,407,402,406,100,40600",
      "/published/data/market/VOO.csv":
        "date,symbol,open,high,low,close,volume,quote_volume\n2026-04-03,VOO,500,505,498,503,100,50300\n2026-04-04,VOO,503,506,500,501,100,50100",
      "/published/asset-manifest.json": JSON.stringify({
        indices: [
          { enabled: true, has_constituents: true, key: "sp500", label: "S&P 500" },
          { enabled: true, has_constituents: true, key: "nasdaq100", label: "Nasdaq-100" },
        ],
        symbols: [
          { enabled: true, has_market_data: true, label: "CBOE Volatility Index", role: "volatility", symbol: "^VIX" },
          { enabled: true, has_market_data: true, label: "Microsoft", role: "asset", symbol: "MSFT" },
          { enabled: true, has_market_data: true, label: "Vanguard S&P 500 ETF", role: "benchmark", symbol: "VOO" },
        ],
      }),
      "/published/data/status/latest.json": JSON.stringify({
        failed_sources: [],
        failed_symbols: [],
        finished_at: "2026-04-05T00:00:00Z",
        messages: [],
        refreshed_symbols: ["VOO", "MSFT", "^VIX"],
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
          { enabled: true, label: "Microsoft", role: "asset", source: "x", symbol: "MSFT" },
          { enabled: true, label: "Vanguard S&P 500 ETF", role: "benchmark", source: "x", symbol: "VOO" },
        ],
      }),
    });

    const payload = await loadDashboardData(fetchFn);
    const recentSymbols = pushRecentSymbol(payload.dashboard, [], "MSFT");
    const discovery = buildTickerDiscoveryState(
      payload.dashboard,
      "ms",
      "all",
      "MSFT",
      recentSymbols,
      "1M",
      "1D",
    );

    expect(discovery.filterOptions.map((option) => option.key)).toEqual([
      "all",
      "sp500",
      "nasdaq100",
    ]);
    expect(discovery.entries.map((entry) => entry.symbol)).toEqual(["MSFT"]);
    expect(discovery.recentEntries.map((entry) => entry.symbol)).toEqual(["MSFT"]);
    expect(discovery.recentEntries[0]?.isActive).toBe(true);

    const sp500Only = buildTickerDiscoveryState(
      payload.dashboard,
      "",
      "sp500",
      "VOO",
      [],
      "1M",
      "1D",
    );

    expect(sp500Only.entries.map((entry) => entry.symbol)).toEqual(["VOO"]);
    expect(sp500Only.entries[0]?.trendDirection).toBe("down");
  });

  it("rebuilds ticker trend summaries for the active timeframe and aggregation", async () => {
    const fetchFn = createFetch({
      "/published/data/constituents/nasdaq100.csv":
        "index_name,symbol,name,sector,sub_industry,source_url\nnasdaq100,MSFT,Microsoft,Information Technology,Software,https://example.com",
      "/published/data/constituents/sp500.csv":
        "index_name,symbol,name,sector,sub_industry,source_url\nsp500,VOO,Vanguard S&P 500 ETF,Financials,ETF,https://example.com",
      "/published/data/market/%5EVIX.csv":
        "date,symbol,open,high,low,close,volume,quote_volume\n2026-03-30,^VIX,20,21,19,19.5,10,195\n2026-04-01,^VIX,20,21,19,21.5,10,215",
      "/published/data/market/VOO.csv":
        "date,symbol,open,high,low,close,volume,quote_volume\n2026-03-31,VOO,500,505,498,503,100,50300\n2026-04-01,VOO,503,506,500,507,100,50700\n2026-04-02,VOO,507,508,501,502,100,50200",
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
    const daily = buildTickerDiscoveryState(
      payload.dashboard,
      "",
      "all",
      "VOO",
      [],
      "1M",
      "1D",
    );
    const weekly = buildTickerDiscoveryState(
      payload.dashboard,
      "",
      "all",
      "VOO",
      [],
      "1M",
      "1W",
    );

    expect(daily.entries[0]?.trendPoints).toHaveLength(3);
    expect(daily.entries[0]?.trendDirection).toBe("down");
    expect(weekly.entries[0]?.trendPoints).toHaveLength(1);
    expect(weekly.entries[0]?.trendDirection).toBe("none");
  });
});
