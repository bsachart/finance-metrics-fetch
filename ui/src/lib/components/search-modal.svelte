<script lang="ts">
  import { tick } from "svelte";

  import type { TickerFilterKey, TickerFilterOption, TickerListEntry } from "$data/types";
  import { cn } from "$lib/utils";

  export let isOpen = false;
  export let query = "";
  export let activeFilter: TickerFilterKey = "all";
  export let options: TickerFilterOption[] = [];
  export let entries: TickerListEntry[] = [];
  export let recentEntries: TickerListEntry[] = [];
  export let selectedSymbol: string | null = null;
  export let trendLabel = "Trend";
  export let onSelect: (symbol: string) => void = () => {};

  let searchInput: HTMLInputElement | null = null;
  let highlightedIndex = -1;

  $: visibleRecentEntries = recentEntries.slice(0, 5);
  $: if (isOpen) {
    void focusSearchInput();
  }
  $: if (isOpen) {
    highlightedIndex = getDefaultHighlightedIndex();
  }

  async function focusSearchInput(): Promise<void> {
    await tick();
    searchInput?.focus();
    searchInput?.select();
  }

  function closeModal(): void {
    isOpen = false;
    query = "";
  }

  function selectTicker(symbol: string): void {
    onSelect(symbol);
    closeModal();
  }

  function getDefaultHighlightedIndex(): number {
    if (entries.length === 0) {
      return -1;
    }

    const activeIndex = entries.findIndex((entry) => entry.symbol === selectedSymbol);
    return activeIndex >= 0 ? activeIndex : 0;
  }

  function moveHighlight(direction: 1 | -1): void {
    if (entries.length === 0) {
      highlightedIndex = -1;
      return;
    }

    if (highlightedIndex < 0) {
      highlightedIndex = getDefaultHighlightedIndex();
      return;
    }

    highlightedIndex = (highlightedIndex + direction + entries.length) % entries.length;
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveHighlight(1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveHighlight(-1);
      return;
    }

    if (event.key === "Enter" && highlightedIndex >= 0 && entries[highlightedIndex]) {
      event.preventDefault();
      selectTicker(entries[highlightedIndex]!.symbol);
    }
  }

  function formatPrice(value: number | null): string {
    if (value === null) {
      return "--";
    }

    return value.toLocaleString("en-US", {
      maximumFractionDigits: 2,
      minimumFractionDigits: value >= 100 ? 2 : 0,
    });
  }

  function formatChangePercent(value: number | null): string {
    if (value === null) {
      return "--";
    }

    const sign = value > 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
  }

  function buildSparkline(points: number[]): string {
    if (points.length < 2) {
      return "";
    }

    const baseline = points[0] ?? 0;
    const relativePoints = points.map((point) => point - baseline);
    const min = Math.min(...relativePoints, 0);
    const max = Math.max(...relativePoints, 0);
    const span = max - min || 1;

    return relativePoints
      .map((point, index) => {
        const x = (index / (points.length - 1)) * 100;
        const y = 20 - ((point - min) / span) * 20;
        return `${x},${y}`;
      })
      .join(" ");
  }

  function getTrendColor(direction: TickerListEntry["trendDirection"]): string {
    if (direction === "up") {
      return "#0f766e";
    }

    if (direction === "down") {
      return "#dc2626";
    }

    return "#64748b";
  }
</script>

{#if isOpen}
  <div
    aria-hidden="true"
    class="search-modal-backdrop"
    on:click={closeModal}
  ></div>

  <div
    aria-modal="true"
    class="search-modal-panel"
    on:click|stopPropagation
    on:keydown={handleKeydown}
    role="dialog"
    tabindex="-1"
  >
    <div class="search-modal-header">
      <div>
        <p class="search-modal-eyebrow">Ticker Finder</p>
        <h3 class="search-modal-title">Switch symbols without leaving the chart</h3>
      </div>
    </div>

    <input
      bind:this={searchInput}
      bind:value={query}
      class="search-modal-input"
      on:keydown={handleKeydown}
      placeholder="Search symbols or companies..."
      type="search"
    />

    <div class="search-modal-tabs">
      {#each options as option}
        <button
          class={cn("search-modal-tab", option.key === activeFilter && "search-modal-tab-active")}
          on:click={() => {
            activeFilter = option.key;
          }}
          type="button"
        >
          {option.label}
          <span class="search-modal-tab-count">{option.symbolCount}</span>
        </button>
      {/each}
    </div>

    {#if visibleRecentEntries.length > 0}
      <div class="search-modal-recents">
        <p class="search-modal-section-label">Recently viewed</p>
        <div class="search-modal-recent-list">
          {#each visibleRecentEntries as entry}
            <button
              class={cn(
                "search-modal-recent-chip",
                entry.symbol === selectedSymbol && "search-modal-recent-chip-active",
              )}
              on:click={() => selectTicker(entry.symbol)}
              type="button"
            >
              {entry.symbol}
            </button>
          {/each}
        </div>
      </div>
    {/if}

    <div class="search-modal-results-header">
      <span>Symbol</span>
      <span>Name</span>
      <span>Last</span>
      <span>Change</span>
      <span>{trendLabel}</span>
    </div>

    {#if entries.length > 0}
      <div class="search-modal-results">
        {#each entries as entry, index}
          <button
            class={cn(
              "search-modal-row",
              entry.symbol === selectedSymbol && "search-modal-row-active",
              index === highlightedIndex && "search-modal-row-highlighted",
            )}
            on:click={() => selectTicker(entry.symbol)}
            on:mousemove={() => {
              highlightedIndex = index;
            }}
            type="button"
          >
            <div class="search-modal-symbol">
              <span class="search-modal-symbol-text">{entry.symbol}</span>
            </div>
            <span class="search-modal-label">{entry.label}</span>
            <span class="search-modal-last">${formatPrice(entry.lastClose)}</span>
            <span
              class={cn(
                "search-modal-change",
                entry.trendDirection === "up" && "search-modal-change-up",
                entry.trendDirection === "down" && "search-modal-change-down",
                (entry.trendDirection === "flat" || entry.trendDirection === "none") &&
                  "search-modal-change-flat",
              )}
            >
              {formatChangePercent(entry.lastChangePercent)}
            </span>
            <span class="search-modal-trend">
              {#if entry.trendPoints.length > 1}
                <svg class="search-modal-sparkline" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    points={buildSparkline(entry.trendPoints)}
                    stroke={getTrendColor(entry.trendDirection)}
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  ></polyline>
                </svg>
              {:else}
                <span class="search-modal-empty-trend">No trend</span>
              {/if}
            </span>
          </button>
        {/each}
      </div>
    {:else}
      <div class="search-modal-empty">
        No tickers match this view.
      </div>
    {/if}
  </div>
{/if}

<style>
  .search-modal-backdrop {
    backdrop-filter: blur(16px);
    background: rgba(255, 255, 255, 0.92);
    inset: 0;
    position: fixed;
    z-index: 40;
  }

  .search-modal-panel {
    background: rgba(255, 255, 255, 0.98);
    border: 1px solid rgba(19, 33, 47, 0.1);
    border-radius: 1.75rem;
    box-shadow: 0 30px 80px rgba(18, 26, 33, 0.18);
    left: 50%;
    max-height: min(48rem, calc(100vh - 5rem));
    overflow: hidden;
    padding: 1.5rem;
    position: fixed;
    top: 2.5rem;
    transform: translateX(-50%);
    width: min(72rem, calc(100vw - 2rem));
    z-index: 41;
  }

  .search-modal-header {
    margin-bottom: 1rem;
  }

  .search-modal-eyebrow {
    color: rgba(19, 33, 47, 0.62);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    margin: 0 0 0.35rem;
    text-transform: uppercase;
  }

  .search-modal-title {
    color: #13212f;
    font-size: 1.35rem;
    font-weight: 700;
    margin: 0;
  }

  .search-modal-input {
    background: rgba(241, 245, 249, 0.72);
    border: 1px solid transparent;
    border-radius: 1rem;
    color: #13212f;
    font-size: 1rem;
    margin-bottom: 1rem;
    outline: none;
    padding: 0.95rem 1rem;
    width: 100%;
  }

  .search-modal-input:focus {
    background: rgba(255, 255, 255, 1);
    border-color: rgba(59, 130, 246, 0.28);
  }

  .search-modal-tabs,
  .search-modal-recent-list,
  .search-modal-results-header,
  .search-modal-row {
    display: grid;
  }

  .search-modal-tabs {
    gap: 0.75rem;
    grid-auto-flow: column;
    justify-content: start;
    margin-bottom: 1rem;
  }

  .search-modal-tab {
    align-items: center;
    background: rgba(241, 245, 249, 0.85);
    border: 1px solid transparent;
    border-radius: 999px;
    color: rgba(19, 33, 47, 0.72);
    display: inline-flex;
    font-size: 0.9rem;
    gap: 0.45rem;
    padding: 0.55rem 0.9rem;
  }

  .search-modal-tab-active {
    background: rgba(37, 99, 235, 0.08);
    border-color: rgba(37, 99, 235, 0.12);
    color: #13212f;
  }

  .search-modal-tab-count {
    color: rgba(19, 33, 47, 0.55);
    font-size: 0.78rem;
  }

  .search-modal-recents {
    margin-bottom: 1rem;
  }

  .search-modal-section-label {
    color: rgba(19, 33, 47, 0.58);
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    margin: 0 0 0.5rem;
    text-transform: uppercase;
  }

  .search-modal-recent-list {
    gap: 0.55rem;
    grid-auto-flow: column;
    justify-content: start;
  }

  .search-modal-recent-chip {
    background: rgba(241, 245, 249, 0.85);
    border: 1px solid transparent;
    border-radius: 999px;
    color: #13212f;
    font-size: 0.82rem;
    padding: 0.42rem 0.8rem;
  }

  .search-modal-recent-chip-active {
    background: rgba(37, 99, 235, 0.08);
    border-color: rgba(37, 99, 235, 0.12);
  }

  .search-modal-results-header,
  .search-modal-row {
    align-items: center;
    column-gap: 1rem;
    grid-template-columns: minmax(5rem, 0.8fr) minmax(0, 1.6fr) minmax(5rem, 0.8fr) minmax(5.5rem, 0.8fr) minmax(8rem, 1fr);
  }

  .search-modal-results-header {
    color: rgba(19, 33, 47, 0.58);
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    margin-bottom: 0.4rem;
    padding: 0 0.9rem;
    text-transform: uppercase;
  }

  .search-modal-results {
    border: 1px solid rgba(19, 33, 47, 0.08);
    border-radius: 1.25rem;
    max-height: min(28rem, calc(100vh - 19rem));
    overflow: auto;
  }

  .search-modal-row {
    background: transparent;
    border: 0;
    border-bottom: 1px solid rgba(19, 33, 47, 0.08);
    padding: 0.9rem;
    text-align: left;
    width: 100%;
  }

  .search-modal-row:last-child {
    border-bottom: 0;
  }

  .search-modal-row-active {
    background: #eff6ff;
  }

  .search-modal-row-highlighted {
    box-shadow: inset 0 0 0 1px rgba(37, 99, 235, 0.22);
  }

  .search-modal-symbol {
    align-items: center;
    display: flex;
    gap: 0.5rem;
  }

  .search-modal-symbol-text,
  .search-modal-last,
  .search-modal-change {
    color: #13212f;
    font-size: 0.95rem;
    font-weight: 600;
  }

  .search-modal-label,
  .search-modal-empty-trend {
    color: rgba(19, 33, 47, 0.72);
    font-size: 0.9rem;
  }

  .search-modal-change-up {
    color: #0f766e;
  }

  .search-modal-change-down {
    color: #dc2626;
  }

  .search-modal-change-flat {
    color: #64748b;
  }

  .search-modal-sparkline {
    height: 2.25rem;
    width: 100%;
  }

  .search-modal-empty {
    border: 1px dashed rgba(19, 33, 47, 0.14);
    border-radius: 1.25rem;
    color: rgba(19, 33, 47, 0.62);
    font-size: 0.92rem;
    padding: 1.5rem;
    text-align: center;
  }

  @media (max-width: 900px) {
    .search-modal-panel {
      max-height: calc(100vh - 2rem);
      padding: 1rem;
      top: 1rem;
      width: calc(100vw - 1rem);
    }

    .search-modal-results-header {
      display: none;
    }

    .search-modal-row {
      gap: 0.45rem;
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
