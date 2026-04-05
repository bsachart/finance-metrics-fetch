import {
  loadConstituentCsv,
  loadMarketCsv,
  loadStatus,
  loadTickerConfig,
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
  const [tickerConfig, status, sp500, nasdaq100] = await Promise.all([
    loadTickerConfig(fetchFn),
    loadStatus(fetchFn),
    loadConstituentCsv(fetchFn, "sp500"),
    loadConstituentCsv(fetchFn, "nasdaq100"),
  ]);

  const enabledTickers = tickerConfig.tickers.filter((ticker) => ticker.enabled);
  const loadedSymbols = await Promise.all(
    enabledTickers.map(async (ticker) => ({
      symbol: ticker.symbol,
      role: ticker.role,
      label: ticker.label,
      ...(await tryLoadMarketSymbol(fetchFn, ticker.symbol)),
    })),
  );

  const symbolOptions: SymbolOption[] = loadedSymbols.map((entry) => ({
    symbol: entry.symbol,
    label: entry.label,
    role: entry.role,
    hasMarketData: entry.points.length > 0,
  }));

  const marketBySymbol = Object.fromEntries(
    loadedSymbols
      .filter((entry) => entry.points.length > 0)
      .map((entry) => [entry.symbol, entry.points]),
  );

  const warnings = loadedSymbols
    .flatMap((entry) => entry.warning ?? [])
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
      constituentsByIndex: {
        nasdaq100,
        sp500,
      },
      marketBySymbol,
      status,
      symbolOptions,
      vixSymbol:
        vixTicker && marketBySymbol[vixTicker.symbol] ? vixTicker.symbol : null,
    },
    warnings,
  };
}

export function getDefaultSymbol(dashboard: DashboardData): string | null {
  const preferred = dashboard.symbolOptions.find(
    (option) => option.hasMarketData && option.symbol !== dashboard.vixSymbol,
  );

  return preferred?.symbol ?? dashboard.symbolOptions.find((option) => option.hasMarketData)?.symbol ?? null;
}
