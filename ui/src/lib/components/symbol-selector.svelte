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
        option.symbol === selectedSymbol && "border-ring bg-accent/60 shadow-sm",
      )}
      on:click={() => (selectedSymbol = option.symbol)}
      type="button"
    >
      <span class="font-heading block text-2xl font-semibold tracking-tight">{option.symbol}</span>
      <small class="mt-1 block text-sm text-muted-foreground">{option.label}</small>
    </button>
  {/each}
</div>
