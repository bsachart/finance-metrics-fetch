<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import PriceChart from "$charts/price-chart.svelte";
  import ConstituentTable from "$components/constituent-table.svelte";
  import EmptyState from "$components/empty-state.svelte";
  import MarketSummary from "$components/market-summary.svelte";
  import StatusCard from "$components/status-card.svelte";
  import SymbolSelector from "$components/symbol-selector.svelte";
  import VixContext from "$components/vix-context.svelte";
  import {
    AGGREGATION_PERIODS,
    LOOKBACK_PRESETS,
    applyMarketView,
    buildSummaryMetrics,
    type AggregationPeriod,
    type LookbackPreset,
  } from "$data/market";
  import {
    Alert,
    AlertDescription,
    AlertTitle,
  } from "$lib/components/ui/alert";
  import { Badge } from "$lib/components/ui/badge";
  import { Card } from "$lib/components/ui/card";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
  import { onMount } from "svelte";

  import type { PageData } from "./$types";

  export let data: PageData;

  const refreshIntervalMs = 60_000;

  let selectedSymbol = data.defaultSymbol;
  let activePanel: "market" | "indices" = "market";
  let selectedIndex = data.dashboard.indexOptions[0]?.key ?? "";
  let selectedLookback: LookbackPreset = "1M";
  let selectedAggregation: AggregationPeriod = "1D";

  $: rawMarketPoints = selectedSymbol ? data.dashboard.marketBySymbol[selectedSymbol] ?? [] : [];
  $: marketPoints = applyMarketView(rawMarketPoints, selectedLookback, selectedAggregation);
  $: vixPoints = data.dashboard.vixSymbol
    ? applyMarketView(
        data.dashboard.marketBySymbol[data.dashboard.vixSymbol] ?? [],
        selectedLookback,
        selectedAggregation,
      )
    : [];
  $: summaryMetrics = buildSummaryMetrics(marketPoints);
  $: availableSymbols = new Set(
    data.dashboard.symbolOptions.filter((option) => option.hasMarketData).map((option) => option.symbol),
  );
  $: if (!selectedSymbol || !availableSymbols.has(selectedSymbol)) {
    selectedSymbol = data.defaultSymbol;
  }
  $: availableIndices = new Set(
    data.dashboard.indexOptions
      .filter((option) => option.hasConstituents)
      .map((option) => option.key),
  );
  $: if (!selectedIndex || !availableIndices.has(selectedIndex)) {
    selectedIndex =
      data.dashboard.indexOptions.find((option) => option.hasConstituents)?.key ?? "";
  }

  onMount(() => {
    const intervalId = window.setInterval(() => {
      void invalidateAll();
    }, refreshIntervalMs);

    const handleVisibilityChange = (): void => {
      if (document.visibilityState === "visible") {
        void invalidateAll();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  });
</script>

<svelte:head>
  <title>Finance Metrics Fetch UI</title>
  <meta
    content="Static market dashboard for repository-published OHLC, dollar volume, configurable lookbacks, configurable bar periods, VIX context, and index constituents."
    name="description"
  />
</svelte:head>

<div class="mx-auto w-[min(1200px,calc(100vw-2rem))] pb-12 pt-5 md:pt-8">
  <header class="space-y-6">
    <Badge variant="outline">Published market dashboard</Badge>
    <h1 class="font-heading max-w-6xl text-6xl font-semibold leading-none tracking-[-0.05em] md:text-8xl">
      Market history from the repository, not a live backend.
    </h1>
    <p class="max-w-3xl text-lg leading-8 text-muted-foreground">
      This dashboard reads the published repository data, refreshes it automatically, and
      lets you inspect OHLC price action, dollar volume, configurable lookbacks,
      configurable bar periods, volatility context, and index constituents from the same place.
    </p>
  </header>

  <section class="mt-6 grid gap-4">
    <StatusCard status={data.dashboard.status} />

    {#if data.warnings.length > 0}
      <Alert class="rounded-[28px] border bg-card/90 p-6 shadow-[0_18px_50px_rgba(18,26,33,0.12)]">
        <AlertTitle class="font-heading text-2xl font-semibold tracking-tight">
          Data warnings
        </AlertTitle>
        <AlertDescription>
          <ul class="mt-3 list-disc space-y-1 pl-5 text-muted-foreground">
            {#each data.warnings as warning}
              <li>{warning}</li>
            {/each}
          </ul>
        </AlertDescription>
      </Alert>
    {/if}

    {#if selectedSymbol}
      <Card class="space-y-4 rounded-[28px] border bg-card/90 p-6 shadow-[0_18px_50px_rgba(18,26,33,0.12)]">
        <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 class="font-heading text-3xl font-semibold tracking-tight">Published symbols</h2>
            <p class="mt-2 text-muted-foreground">
              Symbol choices come from the packaged published assets, so the UI only
              offers symbols that exist in the repository snapshot.
            </p>
          </div>
        </div>
        <SymbolSelector bind:selectedSymbol options={data.dashboard.symbolOptions} />
      </Card>

      <Tabs bind:value={activePanel} class="gap-4">
        <TabsList class="rounded-full p-1" variant="default">
          <TabsTrigger class="rounded-full px-4 text-sm" value="market">Market</TabsTrigger>
          <TabsTrigger class="rounded-full px-4 text-sm" value="indices">Indices</TabsTrigger>
        </TabsList>

        <TabsContent class="mt-0 grid gap-4" value="market">
          <MarketSummary metrics={summaryMetrics} />
          <VixContext points={vixPoints} symbol={data.dashboard.vixSymbol} />
          <Card class="space-y-4 rounded-[28px] border bg-card/90 p-6 shadow-[0_18px_50px_rgba(18,26,33,0.12)]">
            <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 class="font-heading text-3xl font-semibold tracking-tight">
                  {selectedSymbol} OHLC with dollar volume
                </h2>
                <p class="mt-2 text-muted-foreground">
                  Candlestick sessions with a lower dollar-volume pane in the same chart.
                  Default view is one month of daily bars.
                </p>
              </div>
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <p class="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Lookback
                </p>
                <div class="flex flex-wrap gap-2">
                  {#each LOOKBACK_PRESETS as lookback}
                    <button
                      class={`rounded-full border px-3 py-1.5 text-sm transition ${
                        lookback === selectedLookback
                          ? "border-ring bg-accent/60 text-foreground"
                          : "bg-background/70 text-muted-foreground hover:border-ring/40 hover:text-foreground"
                      }`}
                      on:click={() => (selectedLookback = lookback)}
                      type="button"
                    >
                      {lookback}
                    </button>
                  {/each}
                </div>
              </div>
              <div>
                <p class="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Bar Period
                </p>
                <div class="flex flex-wrap gap-2">
                  {#each AGGREGATION_PERIODS as aggregation}
                    <button
                      class={`rounded-full border px-3 py-1.5 text-sm transition ${
                        aggregation === selectedAggregation
                          ? "border-ring bg-accent/60 text-foreground"
                          : "bg-background/70 text-muted-foreground hover:border-ring/40 hover:text-foreground"
                      }`}
                      on:click={() => (selectedAggregation = aggregation)}
                      type="button"
                    >
                      {aggregation}
                    </button>
                  {/each}
                </div>
              </div>
            </div>
            {#key selectedSymbol}
              <PriceChart points={marketPoints} />
            {/key}
          </Card>
        </TabsContent>

        <TabsContent class="mt-0 grid gap-4" value="indices">
          {#if data.dashboard.indexOptions.some((option) => option.hasConstituents)}
            <Tabs bind:value={selectedIndex} class="gap-4">
              <TabsList class="rounded-full p-1" variant="default">
                {#each data.dashboard.indexOptions.filter((option) => option.hasConstituents) as option}
                  <TabsTrigger class="rounded-full px-4 text-sm" value={option.key}>
                    {option.label}
                  </TabsTrigger>
                {/each}
              </TabsList>

              <ConstituentTable
                indexLabel={data.dashboard.indexOptions.find((option) => option.key === selectedIndex)?.label ?? selectedIndex}
                records={data.dashboard.constituentsByIndex[selectedIndex] ?? []}
              />
            </Tabs>
          {:else}
            <EmptyState
              message="The packaged repository snapshot did not include any usable constituent files."
              title="No index files available"
            />
          {/if}
        </TabsContent>
      </Tabs>
    {:else}
      <EmptyState
        message="The static site could not find a usable market dataset in the published artifacts."
        title="No market files available"
      />
    {/if}
  </section>
</div>
