<script lang="ts">
  import PriceChart from "$charts/price-chart.svelte";
  import VolumeChart from "$charts/volume-chart.svelte";
  import Card from "$components/ui/card.svelte";
  import ConstituentTable from "$components/constituent-table.svelte";
  import DistributionPanel from "$components/distribution-panel.svelte";
  import EmptyState from "$components/empty-state.svelte";
  import MarketSummary from "$components/market-summary.svelte";
  import StatusCard from "$components/status-card.svelte";
  import SymbolSelector from "$components/symbol-selector.svelte";
  import VixContext from "$components/vix-context.svelte";
  import { buildSummaryMetrics } from "$data/market";

  import type { PageData } from "./$types";

  export let data: PageData;

  let selectedSymbol = data.defaultSymbol;
  let activePanel: "market" | "distribution" | "constituents" = "market";
  let selectedIndex: "sp500" | "nasdaq100" = "sp500";

  $: marketPoints = selectedSymbol ? data.dashboard.marketBySymbol[selectedSymbol] ?? [] : [];
  $: vixPoints =
    data.dashboard.vixSymbol && data.dashboard.vixSymbol !== selectedSymbol
      ? data.dashboard.marketBySymbol[data.dashboard.vixSymbol] ?? []
      : [];
  $: summaryMetrics = buildSummaryMetrics(marketPoints);
</script>

<svelte:head>
  <title>Finance Metrics Fetch UI</title>
  <meta
    content="Static market dashboard for repository-published OHLCV, quote volume, VIX, and constituent datasets."
    name="description"
  />
</svelte:head>

<div class="page-shell">
  <header>
    <p class="eyebrow">GitHub Pages ready</p>
    <h1 class="hero-title">Market history from the repository, not a live backend.</h1>
    <p class="hero-copy">
      This UI packages the committed `data/` artifacts into a static dashboard so you can
      inspect price, quote volume, volatility context, and index constituents from the same
      place.
    </p>
  </header>

  <section class="grid" style="margin-top: 1.5rem">
    <StatusCard status={data.dashboard.status} />

    {#if data.warnings.length > 0}
      <Card>
        <h2 class="section-title">Data warnings</h2>
        <ul class="warning-list">
          {#each data.warnings as warning}
            <li>{warning}</li>
          {/each}
        </ul>
      </Card>
    {/if}

    {#if selectedSymbol}
      <Card>
        <div class="panel-header">
          <div>
            <h2 class="section-title">Published symbols</h2>
            <p class="section-copy">
              Symbol switches are local UI updates because the dashboard loads the packaged
              repository datasets up front.
            </p>
          </div>
        </div>
        <SymbolSelector
          bind:selectedSymbol
          options={data.dashboard.symbolOptions}
        />
      </Card>

      <div class="panel-switcher">
        <button class:active={activePanel === "market"} on:click={() => (activePanel = "market")} type="button">Market view</button>
        <button class:active={activePanel === "distribution"} on:click={() => (activePanel = "distribution")} type="button">Distributions</button>
        <button class:active={activePanel === "constituents"} on:click={() => (activePanel = "constituents")} type="button">Constituents</button>
      </div>

      {#if activePanel === "market"}
        <section class="grid">
          <MarketSummary metrics={summaryMetrics} />
          <VixContext points={vixPoints} symbol={data.dashboard.vixSymbol} />
          <Card>
            <div class="panel-header">
              <div>
                <h2 class="section-title">{selectedSymbol} price with VIX context</h2>
                <p class="section-copy">
                  Closing history for the selected symbol, overlaid with the published
                  volatility context when available.
                </p>
              </div>
            </div>
            <PriceChart overlayPoints={vixPoints} points={marketPoints} />
          </Card>
          <Card>
            <div class="panel-header">
              <div>
                <h2 class="section-title">Nominal quote volume</h2>
                <p class="section-copy">
                  Repository-published `quote_volume` derived from close multiplied by share
                  volume.
                </p>
              </div>
            </div>
            <VolumeChart points={marketPoints} />
          </Card>
        </section>
      {:else if activePanel === "distribution"}
        <DistributionPanel points={marketPoints} />
      {:else}
        <section class="grid">
          <div class="panel-switcher constituent-switcher">
            <button class:active={selectedIndex === "sp500"} on:click={() => (selectedIndex = "sp500")} type="button">S&amp;P 500</button>
            <button class:active={selectedIndex === "nasdaq100"} on:click={() => (selectedIndex = "nasdaq100")} type="button">Nasdaq-100</button>
          </div>
          <ConstituentTable
            indexLabel={selectedIndex === "sp500" ? "S&P 500" : "Nasdaq-100"}
            records={data.dashboard.constituentsByIndex[selectedIndex]}
          />
        </section>
      {/if}
    {:else}
      <EmptyState
        message="The static site could not find a usable market dataset in the published artifacts."
        title="No market files available"
      />
    {/if}
  </section>
</div>

<style>
  .warning-list {
    color: var(--color-muted-ink);
    margin: 0;
    padding-left: 1rem;
  }

  .panel-switcher {
    display: flex;
    flex-wrap: wrap;
    gap: 0.7rem;
  }

  .panel-switcher button {
    border: 1px solid var(--color-border);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.72);
    cursor: pointer;
    padding: 0.8rem 1rem;
  }

  .panel-switcher button.active {
    background: var(--color-ink);
    color: white;
  }

  .constituent-switcher {
    margin-bottom: 0.4rem;
  }
</style>
