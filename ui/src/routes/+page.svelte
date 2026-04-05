<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import PriceChart from "$charts/price-chart.svelte";
  import VolumeChart from "$charts/volume-chart.svelte";
  import ConstituentTable from "$components/constituent-table.svelte";
  import DistributionPanel from "$components/distribution-panel.svelte";
  import EmptyState from "$components/empty-state.svelte";
  import MarketSummary from "$components/market-summary.svelte";
  import StatusCard from "$components/status-card.svelte";
  import SymbolSelector from "$components/symbol-selector.svelte";
  import VixContext from "$components/vix-context.svelte";
  import { buildSummaryMetrics } from "$data/market";
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
  let activePanel: "market" | "distribution" | "constituents" = "market";
  let selectedIndex: "sp500" | "nasdaq100" = "sp500";

  $: marketPoints = selectedSymbol ? data.dashboard.marketBySymbol[selectedSymbol] ?? [] : [];
  $: vixPoints =
    data.dashboard.vixSymbol && data.dashboard.vixSymbol !== selectedSymbol
      ? data.dashboard.marketBySymbol[data.dashboard.vixSymbol] ?? []
      : [];
  $: summaryMetrics = buildSummaryMetrics(marketPoints);
  $: availableSymbols = new Set(Object.keys(data.dashboard.marketBySymbol));
  $: if (!selectedSymbol || !availableSymbols.has(selectedSymbol)) {
    selectedSymbol = data.defaultSymbol;
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
    content="Static market dashboard for repository-published OHLCV, quote volume, VIX, and constituent datasets."
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
      lets you inspect price, quote volume, volatility context, and index constituents from
      the same place.
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

      <Tabs bind:value={activePanel} class="gap-4">
        <TabsList class="rounded-full p-1" variant="default">
          <TabsTrigger class="rounded-full px-4 text-sm" value="market">Market view</TabsTrigger>
          <TabsTrigger class="rounded-full px-4 text-sm" value="distribution">Distributions</TabsTrigger>
          <TabsTrigger class="rounded-full px-4 text-sm" value="constituents">Constituents</TabsTrigger>
        </TabsList>

        <TabsContent class="mt-0 grid gap-4" value="market">
          <MarketSummary metrics={summaryMetrics} />
          <VixContext points={vixPoints} symbol={data.dashboard.vixSymbol} />
          <Card class="space-y-4 rounded-[28px] border bg-card/90 p-6 shadow-[0_18px_50px_rgba(18,26,33,0.12)]">
            <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 class="font-heading text-3xl font-semibold tracking-tight">
                  {selectedSymbol} price with VIX context
                </h2>
                <p class="mt-2 text-muted-foreground">
                  Closing history for the selected symbol, overlaid with the published
                  volatility context when available.
                </p>
              </div>
            </div>
            {#key selectedSymbol}
              <PriceChart overlayPoints={vixPoints} points={marketPoints} />
            {/key}
          </Card>
          <Card class="space-y-4 rounded-[28px] border bg-card/90 p-6 shadow-[0_18px_50px_rgba(18,26,33,0.12)]">
            <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 class="font-heading text-3xl font-semibold tracking-tight">Nominal quote volume</h2>
                <p class="mt-2 text-muted-foreground">
                  Repository-published `quote_volume` derived from close multiplied by share
                  volume.
                </p>
              </div>
            </div>
            {#key selectedSymbol}
              <VolumeChart points={marketPoints} />
            {/key}
          </Card>
        </TabsContent>

        <TabsContent class="mt-0" value="distribution">
          <DistributionPanel points={marketPoints} />
        </TabsContent>

        <TabsContent class="mt-0 grid gap-4" value="constituents">
          <Tabs bind:value={selectedIndex} class="gap-4">
            <TabsList class="rounded-full p-1" variant="default">
              <TabsTrigger class="rounded-full px-4 text-sm" value="sp500">S&amp;P 500</TabsTrigger>
              <TabsTrigger class="rounded-full px-4 text-sm" value="nasdaq100">Nasdaq-100</TabsTrigger>
            </TabsList>

          <ConstituentTable
            indexLabel={selectedIndex === "sp500" ? "S&P 500" : "Nasdaq-100"}
            records={data.dashboard.constituentsByIndex[selectedIndex]}
          />
          </Tabs>
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
