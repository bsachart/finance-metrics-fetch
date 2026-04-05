import { base } from "$app/paths";
import Papa from "papaparse";

import type {
  ConstituentRecord,
  MarketPoint,
  PublishedStatus,
  TickerConfig,
} from "./types";

function parseCsvRowNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function withBase(pathname: string): string {
  return `${base}${pathname}`;
}

export async function loadTickerConfig(fetchFn: typeof fetch): Promise<TickerConfig> {
  const response = await fetchFn(withBase("/published/tickers.json"));
  if (!response.ok) {
    throw new Error("Unable to load ticker configuration.");
  }
  return (await response.json()) as TickerConfig;
}

export async function loadStatus(fetchFn: typeof fetch): Promise<PublishedStatus> {
  const response = await fetchFn(withBase("/published/data/status/latest.json"));
  if (!response.ok) {
    throw new Error("Unable to load refresh status.");
  }
  return (await response.json()) as PublishedStatus;
}

export async function loadMarketCsv(
  fetchFn: typeof fetch,
  symbol: string,
): Promise<MarketPoint[]> {
  const response = await fetchFn(
    withBase(`/published/data/market/${encodeURIComponent(symbol)}.csv`),
  );
  if (!response.ok) {
    throw new Error(`Unable to load market history for ${symbol}.`);
  }

  const csvText = await response.text();
  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  return parsed.data.map((row) => ({
    date: row.date ?? "",
    symbol: row.symbol ?? symbol,
    open: parseCsvRowNumber(row.open ?? "0"),
    high: parseCsvRowNumber(row.high ?? "0"),
    low: parseCsvRowNumber(row.low ?? "0"),
    close: parseCsvRowNumber(row.close ?? "0"),
    volume: parseCsvRowNumber(row.volume ?? "0"),
    quote_volume: parseCsvRowNumber(row.quote_volume ?? "0"),
  }));
}

export async function loadConstituentCsv(
  fetchFn: typeof fetch,
  indexName: "sp500" | "nasdaq100",
): Promise<ConstituentRecord[]> {
  const response = await fetchFn(
    withBase(`/published/data/constituents/${indexName}.csv`),
  );
  if (!response.ok) {
    throw new Error(`Unable to load constituents for ${indexName}.`);
  }

  const csvText = await response.text();
  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  return parsed.data.map((row) => ({
    index_name: row.index_name ?? indexName,
    symbol: row.symbol ?? "",
    name: row.name ?? "",
    sector: row.sector ?? "",
    sub_industry: row.sub_industry ?? "",
    source_url: row.source_url ?? "",
    fetched_at: row.fetched_at ?? "",
  }));
}
