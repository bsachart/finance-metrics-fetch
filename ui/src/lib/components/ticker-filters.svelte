<script lang="ts">
  import { cn } from "$lib/utils";

  import type { TickerFilterKey, TickerFilterOption } from "$data/types";

  export let activeFilter: TickerFilterKey = "all";
  export let options: TickerFilterOption[] = [];
  export let onSelect: (key: TickerFilterKey) => void = () => {};
</script>

<div class="space-y-2">
  <p class="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
    Filters
  </p>
  <div class="flex flex-wrap gap-2">
    {#each options as option}
      <button
        class={cn(
          "rounded-full border px-3 py-1.5 text-sm transition",
          option.key === activeFilter
            ? "border-ring bg-accent/70 text-foreground"
            : "bg-background/70 text-muted-foreground hover:border-ring/40 hover:text-foreground",
        )}
        on:click={() => onSelect(option.key)}
        type="button"
      >
        {option.label}
        <span class="ml-1 text-muted-foreground">{option.symbolCount}</span>
      </button>
    {/each}
  </div>
</div>
