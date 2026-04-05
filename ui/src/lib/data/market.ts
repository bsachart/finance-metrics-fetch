import type { BusinessDay, LineData } from "lightweight-charts";

import type { MarketPoint, SummaryMetric } from "./types";

export interface MarketSummary {
  latestClose: number;
  latestQuoteVolume: number;
  averageQuoteVolume: number;
  totalTradingDays: number;
  latestDate: string;
}

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

export function buildQuoteVolumeSeries(points: MarketPoint[]): LineData[] {
  return sortMarketPoints(points).map((point) => ({
    time: toBusinessDay(point.date),
    value: point.quote_volume,
  }));
}

export function summarizeMarket(points: MarketPoint[]): MarketSummary | null {
  if (points.length === 0) {
    return null;
  }

  const sorted = sortMarketPoints(points);
  const latest = sorted.at(-1);

  if (!latest) {
    return null;
  }

  const totalQuoteVolume = sorted.reduce(
    (runningTotal, point) => runningTotal + point.quote_volume,
    0,
  );

  return {
    latestClose: latest.close,
    latestQuoteVolume: latest.quote_volume,
    averageQuoteVolume: totalQuoteVolume / sorted.length,
    totalTradingDays: sorted.length,
    latestDate: latest.date,
  };
}

function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    notation: "compact",
  }).format(value);
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: value >= 1000 ? 0 : 2,
    style: "currency",
  }).format(value);
}

export function buildSummaryMetrics(points: MarketPoint[]): SummaryMetric[] {
  const summary = summarizeMarket(points);

  if (!summary) {
    return [];
  }

  return [
    {
      label: "Last close",
      tone: "accent",
      value: formatCurrency(summary.latestClose),
    },
    {
      label: "Last quote volume",
      value: formatCompactNumber(summary.latestQuoteVolume),
    },
    {
      label: "Average quote volume",
      value: formatCompactNumber(summary.averageQuoteVolume),
    },
    {
      label: "Sessions",
      tone: "warm",
      value: summary.totalTradingDays.toLocaleString("en-US"),
    },
  ];
}
