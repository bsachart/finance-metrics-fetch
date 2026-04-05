<script lang="ts">
  import { cn } from "$lib/utils";

  import type { SymbolOption } from "$data/types";

  export let options: SymbolOption[];
  export let selectedSymbol: string;
</script>

<div class="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
  {#each options.filter((option) => option.hasMarketData) as option}
    <button
      class={cn(
        "rounded-[20px] border bg-background/70 p-3 text-left transition hover:border-ring/40 hover:bg-card",
        option.symbol === selectedSymbol &&
          "border-ring bg-accent/85 shadow-[0_10px_24px_rgba(19,33,47,0.12)]",
      )}
      on:click={() => (selectedSymbol = option.symbol)}
      type="button"
    >
      <div class="flex items-start justify-between gap-3">
        <span class="font-heading block text-2xl font-semibold tracking-tight">{option.symbol}</span>
        {#if option.symbol === selectedSymbol}
          <span class="rounded-full border border-ring/30 bg-background/85 px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.16em] text-foreground">
            Active
          </span>
        {/if}
      </div>
      <small class="mt-1 block text-sm text-muted-foreground">{option.label}</small>
    </button>
  {/each}
</div>
