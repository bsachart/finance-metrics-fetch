<script lang="ts">
  import type { SymbolOption } from "$data/types";

  export let options: SymbolOption[];
  export let selectedSymbol: string;
</script>

<div class="selector-root">
  {#each options.filter((option) => option.hasMarketData) as option}
    <button
      class:active={option.symbol === selectedSymbol}
      on:click={() => (selectedSymbol = option.symbol)}
      type="button"
    >
      <span>{option.symbol}</span>
      <small>{option.label}</small>
    </button>
  {/each}
</div>

<style>
  .selector-root {
    display: flex;
    flex-wrap: wrap;
    gap: 0.7rem;
  }

  button {
    border: 1px solid var(--color-border);
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.78);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    min-width: 11rem;
    padding: 0.9rem 1rem;
    text-align: left;
  }

  span {
    font-size: 1rem;
    font-weight: 700;
  }

  small {
    color: var(--color-muted-ink);
  }

  .active {
    border-color: rgba(15, 118, 110, 0.34);
    background: rgba(15, 118, 110, 0.12);
  }
</style>
