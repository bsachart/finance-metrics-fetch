import {
  loadAssetManifest,
  loadConstituentCsv,
  loadMarketCsv,
  loadStatus,
} from "./loaders";
import type { DashboardData, SymbolOption } from "./types";

export interface DashboardPayload {
  dashboard: DashboardData;
  warnings: string[];
}

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

  return {
    dashboard: {
      constituentsByIndex: Object.fromEntries(
        orderedIndices.map((index) => [index.key, index.records]),
      ),
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

function rankSymbolOption(option: SymbolOption): number {
  if (option.symbol === "VOO") {
    return 0;
  }

  if (option.role === "volatility" || option.symbol === "^VIX") {
    return 2;
  }

  return 1;
}

function rankIndexOption(key: string): number {
  if (key === "nasdaq100") {
    return 0;
  }

  if (key === "sp500") {
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
