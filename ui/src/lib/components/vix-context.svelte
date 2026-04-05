<script lang="ts">
  import { Badge } from "$lib/components/ui/badge";
  import { summarizeMarket } from "$data/market";
  import type { MarketPoint } from "$data/types";

  export let symbol: string | null;
  export let points: MarketPoint[];

  const summary = summarizeMarket(points);
</script>

<section class="rounded-[24px] border bg-card/80 p-5">
  <Badge variant="outline">Volatility context</Badge>
  {#if symbol && summary}
    <h3 class="font-heading mt-4 text-3xl font-semibold tracking-tight">
      {symbol} closed at {summary.latestClose.toFixed(2)}
    </h3>
    <p class="mt-2 text-muted-foreground">
      Last observation on {summary.latestDate}. This gives market-stress context for the
      selected asset without complicating the main OHLC and dollar-volume chart.
    </p>
  {:else}
    <h3 class="font-heading mt-4 text-3xl font-semibold tracking-tight">No VIX context available</h3>
    <p class="mt-2 text-muted-foreground">
      The published dataset did not include a usable volatility series.
    </p>
  {/if}
</section>
