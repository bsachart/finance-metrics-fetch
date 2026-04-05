import {
  loadAssetManifest,
  loadConstituentCsv,
  loadMarketCsv,
  loadStatus,
} from "./loaders";
import {
  applyMarketView,
  type AggregationPeriod,
  type LookbackPreset,
} from "./market";
import type {
  DashboardData,
  MarketPoint,
  SymbolOption,
  TickerDiscoveryState,
  TickerFilterKey,
  TickerFilterOption,
  TickerListEntry,
} from "./types";

export interface DashboardPayload {
  dashboard: DashboardData;
  warnings: string[];
}

export const RECENT_TICKER_LIMIT = 8;

async function tryLoadMarketSymbol(
  fetchFn: typeof fetch,
  symbol: string,
): Promise<{ points: Awaited<ReturnType<typeof loadMarketCsv>>; warning?: string }> {
  try {
    return {
      points: await loadMarketCsv(fetchFn, symbol),
    };
  } catch (error) {
    return {
      points: [],
      warning: error instanceof Error ? error.message : `Unable to load ${symbol}.`,
    };
  }
}

export async function loadDashboardData(
  fetchFn: typeof fetch,
): Promise<DashboardPayload> {
  const [assetManifest, status] = await Promise.all([
    loadAssetManifest(fetchFn),
    loadStatus(fetchFn),
  ]);

  const enabledTickers = assetManifest.symbols.filter((ticker) => ticker.enabled);
  const publishedTickers = enabledTickers.filter((ticker) => ticker.has_market_data);
  const loadedSymbols = await Promise.all(
    publishedTickers.map(async (ticker) => ({
      symbol: ticker.symbol,
      role: ticker.role,
      label: ticker.label,
      ...(await tryLoadMarketSymbol(fetchFn, ticker.symbol)),
    })),
  );

  const symbolOptions: SymbolOption[] = enabledTickers.map((ticker) => ({
    symbol: ticker.symbol,
    label: ticker.label,
    role: ticker.role,
    hasMarketData: ticker.has_market_data,
  })).sort((left, right) => {
    const rankDifference = rankSymbolOption(left) - rankSymbolOption(right);
    return rankDifference !== 0 ? rankDifference : left.symbol.localeCompare(right.symbol);
  });

  const enabledIndices = assetManifest.indices.filter((index) => index.enabled);
  const loadedIndices = await Promise.all(
    enabledIndices.map(async (index) => {
      if (!index.has_constituents) {
        return {
          key: index.key,
          label: index.label,
          records: [],
        };
      }

      try {
        return {
          key: index.key,
          label: index.label,
          records: await loadConstituentCsv(fetchFn, index.key),
        };
      } catch {
        return {
          key: index.key,
          label: index.label,
          records: [],
        };
      }
    }),
  );
  const orderedIndices = [...loadedIndices].sort(
    (left, right) => rankIndexOption(left.key) - rankIndexOption(right.key),
  );

  const marketBySymbol = Object.fromEntries(
    loadedSymbols
      .filter((entry) => entry.points.length > 0)
      .map((entry) => [entry.symbol, entry.points]),
  );

  const warnings = loadedSymbols
    .flatMap((entry) => entry.warning ?? [])
    .concat(
      enabledTickers
        .filter((ticker) => !ticker.has_market_data)
        .map((ticker) => `Published market history is missing for ${ticker.symbol}.`),
    )
    .concat(
      status.status === "success"
        ? []
        : ["The latest refresh reported issues. Review the published status summary."],
    );

  const vixTicker = enabledTickers.find(
    (ticker) => ticker.role === "volatility" || ticker.symbol === "^VIX",
  );
  const filterMembershipBySymbol = buildFilterMembershipBySymbol(
    symbolOptions,
    orderedIndices.map((index) => ({
      key: index.key,
      records: index.records,
    })),
  );

  return {
    dashboard: {
      constituentsByIndex: Object.fromEntries(
        orderedIndices.map((index) => [index.key, index.records]),
      ),
      filterMembershipBySymbol,
      indexOptions: orderedIndices.map((index) => ({
        key: index.key,
        label: index.label,
        hasConstituents: index.records.length > 0,
      })),
      marketBySymbol,
      status,
      symbolOptions,
      vixSymbol:
        vixTicker && marketBySymbol[vixTicker.symbol] ? vixTicker.symbol : null,
    },
    warnings,
  };
}

function rankIndexOption(key: string): number {
  if (key === "sp500") {
    return 0;
  }

  if (key === "nasdaq100") {
    return 1;
  }

  return 2;
}

export function getDefaultSymbol(dashboard: DashboardData): string | null {
  const preferred = dashboard.symbolOptions.find(
    (option) => option.hasMarketData && option.symbol !== dashboard.vixSymbol,
  );

  return preferred?.symbol ?? dashboard.symbolOptions.find((option) => option.hasMarketData)?.symbol ?? null;
}

export function sanitizeRecentSymbols(
  dashboard: DashboardData,
  recentSymbols: string[],
): string[] {
  const validSymbols = new Set(
    dashboard.symbolOptions
      .filter((option) => option.hasMarketData && option.symbol !== dashboard.vixSymbol)
      .map((option) => option.symbol),
  );

  return Array.from(
    new Set(recentSymbols.filter((symbol) => validSymbols.has(symbol))),
  ).slice(0, RECENT_TICKER_LIMIT);
}

export function pushRecentSymbol(
  dashboard: DashboardData,
  recentSymbols: string[],
  symbol: string,
): string[] {
  return sanitizeRecentSymbols(dashboard, [symbol, ...recentSymbols]);
}

export function buildTickerDiscoveryState(
  dashboard: DashboardData,
  searchQuery: string,
  activeFilter: TickerFilterKey,
  selectedSymbol: string | null,
  recentSymbols: string[],
  lookback: LookbackPreset,
  aggregation: AggregationPeriod,
): TickerDiscoveryState {
  const validRecentSymbols = sanitizeRecentSymbols(dashboard, recentSymbols);
  const recentSet = new Set(validRecentSymbols);
  const query = searchQuery.trim().toLowerCase();
  const filterOptions = buildTickerFilterOptions(dashboard);
  const supportedFilterKeys = new Set(filterOptions.map((option) => option.key));
  const normalizedFilter = supportedFilterKeys.has(activeFilter) ? activeFilter : "all";

  const allEntries = dashboard.symbolOptions
    .filter((option) => option.hasMarketData && option.symbol !== dashboard.vixSymbol)
    .map((option) =>
      buildTickerListEntry(
        option,
        dashboard.marketBySymbol[option.symbol] ?? [],
        dashboard.filterMembershipBySymbol[option.symbol] ?? ["all"],
        option.symbol === selectedSymbol,
        recentSet.has(option.symbol),
        lookback,
        aggregation,
      ),
    );

  const entries = allEntries
    .filter((entry) => entry.filterKeys.includes(normalizedFilter))
    .filter((entry) => matchesTickerQuery(entry, query))
    .sort((left, right) => compareTickerEntries(left, right, query));

  const entryBySymbol = new Map(allEntries.map((entry) => [entry.symbol, entry]));
  const recentEntries = validRecentSymbols
    .map((symbol) => entryBySymbol.get(symbol))
    .filter((entry): entry is TickerListEntry => Boolean(entry));

  return {
    activeFilter: normalizedFilter,
    entries,
    filterOptions,
    recentEntries,
  };
}

function buildFilterMembershipBySymbol(
  symbolOptions: SymbolOption[],
  loadedIndices: Array<{ key: string; records: Array<{ symbol: string }> }>,
): Record<string, TickerFilterKey[]> {
  const sp500Symbols = new Set(
    loadedIndices.find((index) => index.key === "sp500")?.records.map((record) => record.symbol) ?? [],
  );
  const nasdaq100Symbols = new Set(
    loadedIndices.find((index) => index.key === "nasdaq100")?.records.map((record) => record.symbol) ?? [],
  );

  return Object.fromEntries(
    symbolOptions.map((option) => {
      const keys: TickerFilterKey[] = ["all"];

      if (sp500Symbols.has(option.symbol)) {
        keys.push("sp500");
      }

      if (nasdaq100Symbols.has(option.symbol)) {
        keys.push("nasdaq100");
      }

      return [option.symbol, keys];
    }),
  );
}

function buildTickerFilterOptions(dashboard: DashboardData): TickerFilterOption[] {
  const marketSymbols = dashboard.symbolOptions.filter(
    (option) => option.hasMarketData && option.symbol !== dashboard.vixSymbol,
  );

  const counts = {
    all: marketSymbols.length,
    nasdaq100: 0,
    sp500: 0,
  };

  for (const option of marketSymbols) {
    for (const key of dashboard.filterMembershipBySymbol[option.symbol] ?? []) {
      if (key === "nasdaq100" || key === "sp500") {
        counts[key] += 1;
      }
    }
  }

  const options: TickerFilterOption[] = [
    { key: "all", label: "All", symbolCount: counts.all },
  ];

  if (counts.sp500 > 0) {
    options.push({ key: "sp500", label: "S&P 500", symbolCount: counts.sp500 });
  }

  if (counts.nasdaq100 > 0) {
    options.push({
      key: "nasdaq100",
      label: "Nasdaq-100",
      symbolCount: counts.nasdaq100,
    });
  }

  return options.sort((left, right) => rankFilterOption(left.key) - rankFilterOption(right.key));
}

function buildTickerListEntry(
  option: SymbolOption,
  points: MarketPoint[],
  filterKeys: TickerFilterKey[],
  isActive: boolean,
  isRecent: boolean,
  lookback: LookbackPreset,
  aggregation: AggregationPeriod,
): TickerListEntry {
  const summarizedPoints = applyMarketView(points, lookback, aggregation);
  const latest = summarizedPoints.at(-1) ?? null;
  const previous = summarizedPoints.at(-2) ?? null;
  const lastChange = latest && previous ? latest.close - previous.close : null;

  return {
    filterKeys,
    isActive,
    isRecent,
    label: option.label,
    lastChange,
    lastClose: latest?.close ?? null,
    role: option.role,
    symbol: option.symbol,
    trendDirection: getTrendDirection(lastChange),
    trendPoints: summarizedPoints.slice(-24).map((point) => point.close),
  };
}

function getTrendDirection(
  change: number | null,
): "up" | "down" | "flat" | "none" {
  if (change === null) {
    return "none";
  }

  if (change > 0) {
    return "up";
  }

  if (change < 0) {
    return "down";
  }

  return "flat";
}

function matchesTickerQuery(entry: TickerListEntry, query: string): boolean {
  if (!query) {
    return true;
  }

  return (
    entry.symbol.toLowerCase().includes(query) ||
    entry.label.toLowerCase().includes(query)
  );
}

function compareTickerEntries(
  left: TickerListEntry,
  right: TickerListEntry,
  query: string,
): number {
  const matchDifference = rankSearchMatch(left, query) - rankSearchMatch(right, query);
  if (matchDifference !== 0) {
    return matchDifference;
  }

  const rankDifference = rankSymbolOption(left) - rankSymbolOption(right);
  return rankDifference !== 0 ? rankDifference : left.symbol.localeCompare(right.symbol);
}

function rankSearchMatch(entry: TickerListEntry, query: string): number {
  if (!query) {
    return 4;
  }

  const symbol = entry.symbol.toLowerCase();
  const label = entry.label.toLowerCase();

  if (symbol === query) {
    return 0;
  }

  if (symbol.startsWith(query)) {
    return 1;
  }

  if (label.startsWith(query)) {
    return 2;
  }

  if (label.includes(query)) {
    return 3;
  }

  return 4;
}

function rankFilterOption(key: TickerFilterKey): number {
  if (key === "all") {
    return 0;
  }

  if (key === "sp500") {
    return 1;
  }

  return 2;
}

function rankSymbolOption(option: Pick<SymbolOption, "symbol" | "role">): number {
  if (option.symbol === "VOO") {
    return 0;
  }

  if (option.role === "volatility" || option.symbol === "^VIX") {
    return 2;
  }

  return 1;
}
