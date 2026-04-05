<script lang="ts">
  import HistogramChart from "$charts/histogram-chart.svelte";
  import { buildPriceHistogram, buildQuoteVolumeHistogram } from "$data/histograms";
  import type { MarketPoint } from "$data/types";

  export let points: MarketPoint[] = [];
</script>

<div class="grid gap-4 xl:grid-cols-2">
  <HistogramChart buckets={buildPriceHistogram(points)} label="Price histogram" />
  <HistogramChart
    buckets={buildQuoteVolumeHistogram(points)}
    label="Quote volume histogram"
  />
</div>
