import type { HistogramBucket, MarketPoint } from "./types";

function bucketize(values: number[], bucketCount = 16): HistogramBucket[] {
  if (values.length === 0) {
    return [];
  }

  const minimum = Math.min(...values);
  const maximum = Math.max(...values);

  if (minimum === maximum) {
    return [
      {
        count: values.length,
        end: maximum,
        start: minimum,
      },
    ];
  }

  const width = (maximum - minimum) / bucketCount;
  const counts = new Array<number>(bucketCount).fill(0);

  for (const value of values) {
    const rawIndex = Math.floor((value - minimum) / width);
    const safeIndex = Math.min(bucketCount - 1, Math.max(0, rawIndex));
    counts[safeIndex] += 1;
  }

  return counts.map((count, index) => ({
    count,
    end: minimum + width * (index + 1),
    start: minimum + width * index,
  }));
}

export function buildPriceHistogram(points: MarketPoint[]): HistogramBucket[] {
  return bucketize(points.map((point) => point.close));
}

export function buildQuoteVolumeHistogram(points: MarketPoint[]): HistogramBucket[] {
  return bucketize(points.map((point) => point.quote_volume));
}
