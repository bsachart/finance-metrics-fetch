<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import PriceChart from "$charts/price-chart.svelte";
  import ConstituentTable from "$components/constituent-table.svelte";
  import EmptyState from "$components/empty-state.svelte";
  import RecentTickers from "$components/recent-tickers.svelte";
  import StatusCard from "$components/status-card.svelte";
  import TickerFilters from "$components/ticker-filters.svelte";
  import TickerList from "$components/ticker-list.svelte";
  import TickerSearch from "$components/ticker-search.svelte";
  import {
    AGGREGATION_PERIODS,
    LOOKBACK_PRESETS,
    applyMarketView,
    shouldDisplayVixOverlay,
    type AggregationPeriod,
    type LookbackPreset,
  } from "$data/market";
  import {
    buildTickerDiscoveryState,
    pushRecentSymbol,
    sanitizeRecentSymbols,
  } from "$data/dashboard";
  import type { DashboardSection, TickerFilterKey } from "$data/types";
  import {
    Alert,
    AlertDescription,
    AlertTitle,
  } from "$lib/components/ui/alert";
  import { Card } from "$lib/components/ui/card";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
  import { onMount } from "svelte";

  import type { PageData } from "./$types";

  export let data: PageData;

  const refreshIntervalMs = 60_000;
  const storageKey = "finance-metrics-fetch-ui";

  type DashboardPreferences = {
    activeSection?: DashboardSection;
    activeFilter?: TickerFilterKey;
    recentSymbols?: string[];
    selectedAggregation?: AggregationPeriod;
    selectedIndex?: string;
    selectedIndexPreference?: string;
    selectedLookback?: LookbackPreset;
    selectedSymbol?: string | null;
    showVix?: boolean;
  };

  let selectedSymbol = data.defaultSymbol;
  let activeSection: DashboardSection = "tickers";
  let activeFilter: TickerFilterKey = "all";
  let recentSymbols: string[] = [];
  let searchQuery = "";
  let selectedIndex = getDefaultIndexKey();
  let selectedLookback: LookbackPreset = "1M";
  let selectedAggregation: AggregationPeriod = "1D";
  let showVix = true;
  let hasLoadedPreferences = false;
  let vixToggleId = "show-vix";

  $: snapshotDate = new Date(data.dashboard.status.finished_at);
  $: snapshotDayLabel = snapshotDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  $: rawMarketPoints = selectedSymbol ? data.dashboard.marketBySymbol[selectedSymbol] ?? [] : [];
  $: marketPoints = applyMarketView(rawMarketPoints, selectedLookback, selectedAggregation);
  $: vixPoints = data.dashboard.vixSymbol
    ? applyMarketView(
        data.dashboard.marketBySymbol[data.dashboard.vixSymbol] ?? [],
        selectedLookback,
        selectedAggregation,
      )
    : [];
  $: availableSymbols = new Set(
    data.dashboard.symbolOptions
      .filter(
        (option) => option.hasMarketData && option.symbol !== data.dashboard.vixSymbol,
      )
      .map((option) => option.symbol),
  );
  $: selectedSymbolOption =
    data.dashboard.symbolOptions.find((option) => option.symbol === selectedSymbol) ?? null;
  $: tickerDiscovery = buildTickerDiscoveryState(
    data.dashboard,
    searchQuery,
    activeFilter,
    selectedSymbol,
    recentSymbols,
  );
  $: recentSymbols = sanitizeRecentSymbols(data.dashboard, recentSymbols);
  $: hasAnyVixData = Boolean(data.dashboard.vixSymbol && vixPoints.length > 0);
  $: showVixOverlay = shouldDisplayVixOverlay(
    selectedSymbol,
    data.dashboard.vixSymbol,
    showVix,
    vixPoints,
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
    selectedIndex = getDefaultIndexKey();
  }
  $: hasStatusIssues =
    data.dashboard.status.status !== "success" ||
    data.dashboard.status.failed_symbols.length > 0 ||
    data.dashboard.status.messages.length > 0;
  $: if (hasLoadedPreferences) {
    savePreferences();
  }

  onMount(() => {
    restorePreferences();
    recentSymbols = sanitizeRecentSymbols(data.dashboard, recentSymbols);
    if (selectedSymbol) {
      recentSymbols = pushRecentSymbol(data.dashboard, recentSymbols, selectedSymbol);
    }
    hasLoadedPreferences = true;

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

  function restorePreferences(): void {
    const rawValue = window.localStorage.getItem(storageKey);
    if (!rawValue) {
      return;
    }

    try {
      const preferences = JSON.parse(rawValue) as DashboardPreferences;

      if (preferences.activeSection === "tickers" || preferences.activeSection === "constituents") {
        activeSection = preferences.activeSection;
      }

      if (
        preferences.activeFilter === "all" ||
        preferences.activeFilter === "sp500" ||
        preferences.activeFilter === "nasdaq100"
      ) {
        activeFilter = preferences.activeFilter;
      }

      if (preferences.selectedLookback && LOOKBACK_PRESETS.includes(preferences.selectedLookback)) {
        selectedLookback = preferences.selectedLookback;
      }

      if (
        preferences.selectedAggregation &&
        AGGREGATION_PERIODS.includes(preferences.selectedAggregation)
      ) {
        selectedAggregation = preferences.selectedAggregation;
      }

      if (typeof preferences.showVix === "boolean") {
        showVix = preferences.showVix;
      }

      if (preferences.selectedSymbol && availableSymbols.has(preferences.selectedSymbol)) {
        selectedSymbol = preferences.selectedSymbol;
      }

      if (
        preferences.selectedIndexPreference &&
        availableIndices.has(preferences.selectedIndexPreference)
      ) {
        selectedIndex = preferences.selectedIndexPreference;
      } else if (preferences.selectedIndex && availableIndices.has(preferences.selectedIndex)) {
        selectedIndex = getDefaultIndexKey();
      }

      if (Array.isArray(preferences.recentSymbols)) {
        recentSymbols = preferences.recentSymbols.filter(
          (symbol): symbol is string => typeof symbol === "string",
        );
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }

  function savePreferences(): void {
    const preferences: DashboardPreferences = {
      activeSection,
      activeFilter: tickerDiscovery.activeFilter,
      recentSymbols,
      selectedAggregation,
      selectedIndexPreference: selectedIndex,
      selectedLookback,
      selectedSymbol,
      showVix,
    };

    window.localStorage.setItem(storageKey, JSON.stringify(preferences));
  }

  function selectSymbol(symbol: string): void {
    selectedSymbol = symbol;
    recentSymbols = pushRecentSymbol(data.dashboard, recentSymbols, symbol);
    searchQuery = "";
  }

  function getDefaultIndexKey(): string {
    return (
      data.dashboard.indexOptions.find(
        (option) => option.hasConstituents && option.key === "sp500",
      )?.key ??
      data.dashboard.indexOptions.find((option) => option.hasConstituents)?.key ??
      ""
    );
  }
</script>

<svelte:head>
  <title>Finance Metrics Fetch UI</title>
  <meta
    content="Static market dashboard for repository-published OHLC, dollar volume, VIX context, and market constituents."
    name="description"
  />
</svelte:head>

<div class="mx-auto w-[min(1200px,calc(100vw-2rem))] pb-12 pt-4 md:pt-6">
  <header class="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
    <div class="space-y-1">
      <p class="text-sm font-medium text-muted-foreground">Finance Metrics Fetch</p>
      <h1 class="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
        Published market dashboard
      </h1>
      <p class="max-w-2xl text-sm text-muted-foreground md:text-base">
        Repository-backed ticker analysis and market constituent browsing.
      </p>
    </div>

    {#if activeSection === "tickers"}
      <div class="rounded-[20px] border bg-card/80 px-4 py-3 text-sm shadow-[0_12px_32px_rgba(18,26,33,0.08)]">
        <p class="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Data last updated
        </p>
        <p class="mt-1 font-medium">
          {snapshotDate.toLocaleString()}
        </p>
      </div>
    {:else}
      <div class="rounded-[20px] border bg-card/80 px-4 py-3 text-sm shadow-[0_12px_32px_rgba(18,26,33,0.08)]">
        <p class="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Snapshot day
        </p>
        <p class="mt-1 font-medium">
          {snapshotDayLabel}
        </p>
      </div>
    {/if}
  </header>

  <section class="grid gap-4">
    {#if selectedSymbol}
      <Tabs bind:value={activeSection} class="gap-4">
        <TabsList class="rounded-full p-1" variant="default">
          <TabsTrigger class="rounded-full px-4 text-sm" value="tickers">Tickers</TabsTrigger>
          <TabsTrigger class="rounded-full px-4 text-sm" value="constituents">
            Market Constituents
          </TabsTrigger>
        </TabsList>

        <TabsContent class="mt-0 grid gap-4" value="tickers">
          <Card class="space-y-4 rounded-[28px] border bg-card/90 p-6 shadow-[0_18px_50px_rgba(18,26,33,0.12)]">
            <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 class="font-heading text-xl font-semibold tracking-tight md:text-2xl">
                  {selectedSymbol} market history
                </h2>
                <p class="mt-2 text-sm text-muted-foreground">
                  {selectedSymbolOption?.label ?? "Published symbol"} with price, volume, and
                  optional volatility context.
                </p>
              </div>
            </div>

            <div class="space-y-5">
              <TickerSearch
                bind:query={searchQuery}
                entries={tickerDiscovery.entries}
                {selectedSymbol}
                onSelect={selectSymbol}
              />

              <RecentTickers
                entries={tickerDiscovery.recentEntries}
                {selectedSymbol}
                onSelect={selectSymbol}
              />

              <TickerFilters
                activeFilter={tickerDiscovery.activeFilter}
                options={tickerDiscovery.filterOptions}
                onSelect={(key) => {
                  activeFilter = key;
                }}
              />

              <div class="rounded-[22px] border bg-background/55 p-4">
                <div class="flex flex-col gap-5">
                  <div class="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.8fr)_auto]">
                    <div>
                      <p class="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        Timeframe
                      </p>
                      <div class="flex flex-wrap gap-2">
                        {#each LOOKBACK_PRESETS as lookback}
                          <button
                            class={`rounded-full border px-3 py-1.5 text-sm transition ${
                              lookback === selectedLookback
                                ? "border-ring bg-accent/70 text-foreground"
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
                        Bars
                      </p>
                      <div class="flex flex-wrap gap-2">
                        {#each AGGREGATION_PERIODS as aggregation}
                          <button
                            class={`rounded-full border px-3 py-1.5 text-sm transition ${
                              aggregation === selectedAggregation
                                ? "border-ring bg-accent/55 text-foreground"
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

                    <div>
                      <p class="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        VIX
                      </p>
                      <label
                        class={`inline-flex min-w-[8rem] items-center justify-between gap-3 rounded-full border px-3 py-2 text-sm transition ${
                          showVixOverlay || (showVix && !hasAnyVixData)
                            ? "border-ring bg-accent/70 text-foreground"
                            : "bg-background/70 text-muted-foreground hover:border-ring/40 hover:text-foreground"
                        } ${(!hasAnyVixData || selectedSymbol === data.dashboard.vixSymbol) ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                        for={vixToggleId}
                      >
                        <span>Show VIX</span>
                        <span
                          class={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                            showVixOverlay ? "bg-primary" : "bg-muted"
                          }`}
                        >
                          <input
                            bind:checked={showVix}
                            class="sr-only"
                            disabled={!hasAnyVixData || selectedSymbol === data.dashboard.vixSymbol}
                            id={vixToggleId}
                            type="checkbox"
                          />
                          <span
                            class={`h-4 w-4 rounded-full bg-white shadow-sm transition ${
                              showVixOverlay ? "translate-x-6" : "translate-x-1"
                            }`}
                          ></span>
                        </span>
                      </label>
                    </div>
                  </div>

                  <p class="text-sm text-muted-foreground">
                    {#if showVixOverlay}
                      {data.dashboard.vixSymbol} is shown as chart context for {selectedSymbol}.
                    {:else if hasAnyVixData}
                      {data.dashboard.vixSymbol} is hidden.
                    {:else}
                      VIX data is unavailable in the published snapshot.
                    {/if}
                  </p>
                </div>
              </div>
            </div>

            {#key selectedSymbol}
              <PriceChart
                points={marketPoints}
                showVix={showVixOverlay}
                vixPoints={showVixOverlay ? vixPoints : []}
              />
            {/key}
          </Card>

          <Card class="space-y-4 rounded-[28px] border bg-card/90 p-6 shadow-[0_18px_50px_rgba(18,26,33,0.12)]">
            <div>
              <h3 class="font-heading text-lg font-semibold tracking-tight">Published tickers</h3>
              <p class="mt-1 text-sm text-muted-foreground">
                Search and scan the current published ticker universe in a compact list.
              </p>
            </div>

            <TickerList
              entries={tickerDiscovery.entries}
              {selectedSymbol}
              onSelect={selectSymbol}
            />
          </Card>

          {#if data.warnings.length > 0}
            <Alert class="rounded-[28px] border bg-card/90 p-6 shadow-[0_18px_50px_rgba(18,26,33,0.12)]">
              <AlertTitle class="font-heading text-xl font-semibold tracking-tight">
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

          {#if hasStatusIssues}
            <StatusCard status={data.dashboard.status} />
          {/if}
        </TabsContent>

        <TabsContent class="mt-0 grid gap-4" value="constituents">
          {#if data.dashboard.indexOptions.some((option) => option.hasConstituents)}
            <Card class="space-y-4 rounded-[28px] border bg-card/90 p-6 shadow-[0_18px_50px_rgba(18,26,33,0.12)]">
              <div>
                <h2 class="font-heading text-xl font-semibold tracking-tight md:text-2xl">
                  Market constituents
                </h2>
                <p class="mt-2 text-sm text-muted-foreground">
                  Browse the latest published index memberships separately from ticker analysis.
                </p>
                <p class="mt-1 text-sm text-muted-foreground">
                  Snapshot day: {snapshotDayLabel}
                </p>
              </div>

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
            </Card>
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
