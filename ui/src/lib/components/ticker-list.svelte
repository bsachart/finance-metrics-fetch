<script lang="ts">
  import { cn } from "$lib/utils";

  import type { TickerListEntry } from "$data/types";

  export let entries: TickerListEntry[] = [];
  export let selectedSymbol: string | null = null;
  export let onSelect: (symbol: string) => void = () => {};

  function formatPrice(value: number | null): string {
    if (value === null) {
      return "--";
    }

    return value.toLocaleString("en-US", {
      maximumFractionDigits: 2,
      minimumFractionDigits: value >= 100 ? 2 : 0,
    });
  }

  function formatChange(value: number | null): string {
    if (value === null) {
      return "--";
    }

    const sign = value > 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}`;
  }

  function buildSparkline(points: number[]): string {
    if (points.length < 2) {
      return "";
    }

    const min = Math.min(...points);
    const max = Math.max(...points);
    const span = max - min || 1;

    return points
      .map((point, index) => {
        const x = (index / (points.length - 1)) * 100;
        const y = 24 - ((point - min) / span) * 24;
        return `${x},${y}`;
      })
      .join(" ");
  }
</script>

<div class="overflow-hidden rounded-[24px] border">
  <div class="grid grid-cols-[110px_minmax(0,1fr)_110px_100px_120px] gap-3 border-b bg-background/70 px-4 py-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
    <span>Ticker</span>
    <span>Name</span>
    <span>Last</span>
    <span>Change</span>
    <span>Trend</span>
  </div>

  {#if entries.length > 0}
    <div class="max-h-[28rem] overflow-auto">
      {#each entries as entry}
        <button
          class={cn(
            "grid w-full grid-cols-[110px_minmax(0,1fr)_110px_100px_120px] items-center gap-3 border-b px-4 py-3 text-left last:border-b-0 hover:bg-accent/20",
            entry.symbol === selectedSymbol && "bg-accent/50",
          )}
          on:click={() => onSelect(entry.symbol)}
          type="button"
        >
          <div class="min-w-0">
            <p class="font-heading text-lg font-semibold tracking-tight">{entry.symbol}</p>
            {#if entry.isRecent}
              <p class="text-xs text-muted-foreground">Recent</p>
            {/if}
          </div>
          <p class="truncate text-sm text-muted-foreground">{entry.label}</p>
          <p class="text-sm font-medium">{formatPrice(entry.lastClose)}</p>
          <p
            class={`text-sm font-medium ${
              (entry.lastChange ?? 0) >= 0 ? "text-emerald-700" : "text-rose-600"
            }`}
          >
            {formatChange(entry.lastChange)}
          </p>
          <div class="flex justify-end">
            {#if entry.trendPoints.length > 1}
              <svg class="h-6 w-[6rem]" viewBox="0 0 100 24" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  points={buildSparkline(entry.trendPoints)}
                  stroke={(entry.lastChange ?? 0) >= 0 ? "#0f766e" : "#dc2626"}
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></polyline>
              </svg>
            {:else}
              <span class="text-xs text-muted-foreground">No trend</span>
            {/if}
          </div>
        </button>
      {/each}
    </div>
  {:else}
    <div class="px-4 py-6 text-sm text-muted-foreground">No tickers match the current filter.</div>
  {/if}
</div>
