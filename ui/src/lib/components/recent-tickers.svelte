<script lang="ts">
  import { cn } from "$lib/utils";

  import type { TickerListEntry } from "$data/types";

  export let entries: TickerListEntry[] = [];
  export let selectedSymbol: string | null = null;
  export let onSelect: (symbol: string) => void = () => {};
</script>

{#if entries.length > 0}
  <div class="space-y-2">
    <p class="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
      Recently Viewed
    </p>
    <div class="flex flex-wrap gap-2">
      {#each entries as entry}
        <button
          class={cn(
            "rounded-full border px-3 py-1.5 text-sm transition",
            entry.symbol === selectedSymbol
              ? "border-ring bg-accent/70 text-foreground"
              : "bg-background/70 text-muted-foreground hover:border-ring/40 hover:text-foreground",
          )}
          on:click={() => onSelect(entry.symbol)}
          type="button"
        >
          {entry.symbol}
        </button>
      {/each}
    </div>
  </div>
{/if}
