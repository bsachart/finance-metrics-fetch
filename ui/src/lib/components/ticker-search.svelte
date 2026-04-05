<script lang="ts">
  import type { TickerListEntry } from "$data/types";

  export let entries: TickerListEntry[] = [];
  export let query = "";
  export let selectedSymbol: string | null = null;
  export let onSelect: (symbol: string) => void = () => {};

  const maxMatches = 8;

  $: normalizedQuery = query.trim();
  $: visibleEntries = normalizedQuery ? entries.slice(0, maxMatches) : [];

  function formatChange(value: number | null): string {
    if (value === null) {
      return "--";
    }

    const sign = value > 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}`;
  }
</script>

<div class="relative">
  <label class="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground" for="ticker-search">
    Find ticker
  </label>
  <input
    bind:value={query}
    class="mt-2 w-full rounded-[18px] border bg-background/80 px-4 py-3 text-sm outline-none transition focus:border-ring"
    id="ticker-search"
    placeholder="Find ticker by symbol or company name"
    type="search"
  />

  {#if normalizedQuery}
    <div class="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-[20px] border bg-card shadow-[0_18px_40px_rgba(19,33,47,0.16)]">
      {#if visibleEntries.length > 0}
        {#each visibleEntries as entry}
          <button
            class={`grid w-full grid-cols-[minmax(0,120px)_minmax(0,1fr)_auto] items-center gap-3 border-b px-4 py-3 text-left last:border-b-0 ${
              entry.symbol === selectedSymbol ? "bg-accent/60" : "hover:bg-accent/30"
            }`}
            on:click={() => onSelect(entry.symbol)}
            type="button"
          >
            <span class="font-heading text-base font-semibold tracking-tight">{entry.symbol}</span>
            <span class="truncate text-sm text-muted-foreground">{entry.label}</span>
            <span
              class={`text-sm font-medium ${
                (entry.lastChange ?? 0) >= 0 ? "text-emerald-700" : "text-rose-600"
              }`}
            >
              {formatChange(entry.lastChange)}
            </span>
          </button>
        {/each}
      {:else}
        <div class="px-4 py-3 text-sm text-muted-foreground">No tickers match this search.</div>
      {/if}
    </div>
  {/if}
</div>
