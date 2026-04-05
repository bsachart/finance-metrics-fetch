import type {
  BusinessDay,
  CandlestickData,
  HistogramData,
  LineData,
} from "lightweight-charts";

import type { ChartHudState, MarketPoint } from "./types";

export interface VolumeScale {
  divisor: number;
  suffix: string;
}

export type LookbackPreset = "1W" | "1M" | "YTD" | "1Y" | "5Y" | "ALL";
export type AggregationPeriod = "1D" | "1W" | "1M";

export const LOOKBACK_PRESETS: LookbackPreset[] = ["1W", "1M", "YTD", "1Y", "5Y", "ALL"];
export const AGGREGATION_PERIODS: AggregationPeriod[] = ["1D", "1W", "1M"];

export function toBusinessDay(date: string): BusinessDay {
  const [year, month, day] = date.split("-").map(Number);
  return {
    year,
    month,
    day,
  };
}

export function sortMarketPoints(points: MarketPoint[]): MarketPoint[] {
  return [...points].sort((left, right) => left.date.localeCompare(right.date));
}

export function buildPriceSeries(points: MarketPoint[]): LineData[] {
  return sortMarketPoints(points).map((point) => ({
    time: toBusinessDay(point.date),
    value: point.close,
  }));
}

export function applyMarketView(
  points: MarketPoint[],
  lookback: LookbackPreset,
  aggregation: AggregationPeriod,
): MarketPoint[] {
  const filtered = filterMarketPointsByLookback(points, lookback);
  return aggregateMarketPoints(filtered, aggregation);
}

export function filterMarketPointsByLookback(
  points: MarketPoint[],
  lookback: LookbackPreset,
): MarketPoint[] {
  const sorted = sortMarketPoints(points);
  const latest = sorted.at(-1);
  if (!latest || lookback === "ALL") {
    return sorted;
  }

  const latestDate = parseUtcDate(latest.date);
  const threshold = getLookbackThreshold(latestDate, lookback);

  return sorted.filter((point) => parseUtcDate(point.date) >= threshold);
}

export function aggregateMarketPoints(
  points: MarketPoint[],
  aggregation: AggregationPeriod,
): MarketPoint[] {
  const sorted = sortMarketPoints(points);
  if (aggregation === "1D") {
    return sorted;
  }

  const grouped = new Map<string, MarketPoint[]>();
  for (const point of sorted) {
    const bucket = aggregation === "1W" ? weekBucket(point.date) : monthBucket(point.date);
    const existing = grouped.get(bucket) ?? [];
    existing.push(point);
    grouped.set(bucket, existing);
  }

  return Array.from(grouped.values()).map((bucketPoints) => {
    const first = bucketPoints[0]!;
    const last = bucketPoints.at(-1)!;

    return {
      close: last.close,
      date: first.date,
      high: Math.max(...bucketPoints.map((point) => point.high)),
      low: Math.min(...bucketPoints.map((point) => point.low)),
      open: first.open,
      quote_volume: bucketPoints.reduce((total, point) => total + point.quote_volume, 0),
      symbol: first.symbol,
      volume: bucketPoints.reduce((total, point) => total + point.volume, 0),
    };
  });
}

export function buildCandlestickSeries(points: MarketPoint[]): CandlestickData[] {
  return sortMarketPoints(points).map((point) => ({
    close: point.close,
    high: point.high,
    low: point.low,
    open: point.open,
    time: toBusinessDay(point.date),
  }));
}

export function getVolumeScale(points: MarketPoint[]): VolumeScale {
  const maxVolume = Math.max(...points.map((point) => point.quote_volume), 0);
  if (maxVolume >= 1_000_000_000_000) {
    return { divisor: 1_000_000_000_000, suffix: "T" };
  }
  if (maxVolume >= 1_000_000_000) {
    return { divisor: 1_000_000_000, suffix: "B" };
  }
  if (maxVolume >= 1_000_000) {
    return { divisor: 1_000_000, suffix: "M" };
  }
  if (maxVolume >= 1_000) {
    return { divisor: 1_000, suffix: "K" };
  }
  return { divisor: 1, suffix: "" };
}

export function buildNormalizedQuoteVolumeSeries(
  points: MarketPoint[],
  scale: VolumeScale,
): HistogramData[] {
  return sortMarketPoints(points).map((point) => ({
    color:
      point.close >= point.open ? "rgba(59, 130, 246, 0.58)" : "rgba(148, 163, 184, 0.52)",
    time: toBusinessDay(point.date),
    value: point.quote_volume / scale.divisor,
  }));
}

export function formatVolumeAxisValue(value: number, scale: VolumeScale): string {
  const suffix = scale.suffix ? ` ${scale.suffix}` : "";
  return `${trimTrailingZeros(value)}${suffix}`;
}

export function buildChartHudState(
  point: MarketPoint | null,
  vixPoint: MarketPoint | null,
  source: "latest" | "hover",
): ChartHudState | null {
  if (!point) {
    return null;
  }

  return {
    close: point.close,
    date: point.date,
    high: point.high,
    low: point.low,
    open: point.open,
    quoteVolume: point.quote_volume,
    source,
    vix: vixPoint?.close ?? null,
  };
}

export function formatChartHudDate(value: string): string {
  return parseUtcDate(value).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });
}

export function formatChartHudPrice(value: number): string {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

export function formatChartHudVolume(value: number, scale: VolumeScale): string {
  return `$${formatVolumeAxisValue(value / scale.divisor, scale)}`;
}

export function shouldDisplayVixOverlay(
  selectedSymbol: string | null,
  vixSymbol: string | null,
  showVix: boolean,
  vixPoints: MarketPoint[],
): boolean {
  return Boolean(
    selectedSymbol &&
      vixSymbol &&
      selectedSymbol !== vixSymbol &&
      showVix &&
      vixPoints.length > 0,
  );
}

function trimTrailingZeros(value: number): string {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: value >= 100 ? 0 : value >= 10 ? 1 : 2,
    minimumFractionDigits: 0,
  });
}

function getLookbackThreshold(latestDate: Date, lookback: LookbackPreset): Date {
  const threshold = new Date(latestDate);
  switch (lookback) {
    case "1W":
      threshold.setUTCDate(threshold.getUTCDate() - 7);
      return threshold;
    case "1M":
      threshold.setUTCMonth(threshold.getUTCMonth() - 1);
      return threshold;
    case "YTD":
      return new Date(Date.UTC(latestDate.getUTCFullYear(), 0, 1));
    case "1Y":
      threshold.setUTCFullYear(threshold.getUTCFullYear() - 1);
      return threshold;
    case "5Y":
      threshold.setUTCFullYear(threshold.getUTCFullYear() - 5);
      return threshold;
    case "ALL":
      return new Date(0);
  }
}

function parseUtcDate(value: string): Date {
  return new Date(`${value}T00:00:00Z`);
}

function weekBucket(value: string): string {
  const date = parseUtcDate(value);
  const day = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - day);
  return date.toISOString().slice(0, 10);
}

function monthBucket(value: string): string {
  return value.slice(0, 7);
}
