<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import PriceChart from "$charts/price-chart.svelte";
  import ConstituentTable from "$components/constituent-table.svelte";
  import EmptyState from "$components/empty-state.svelte";
  import SearchModal from "$components/search-modal.svelte";
  import {
    AGGREGATION_PERIODS,
    LOOKBACK_PRESETS,
    applyMarketView,
    buildChartHudState,
    formatChartHudDate,
    formatChartHudPrice,
    formatChartHudVolume,
    getVolumeScale,
    shouldDisplayVixOverlay,
    type AggregationPeriod,
    type LookbackPreset,
  } from "$data/market";
  import {
    buildTickerDiscoveryState,
    pushRecentSymbol,
    sanitizeRecentSymbols,
  } from "$data/dashboard";
  import type { ChartHudState, DashboardSection, TickerFilterKey } from "$data/types";
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
  let isFinderOpen = false;
  let recentSymbols: string[] = [];
  let searchQuery = "";
  let selectedIndex = getDefaultIndexKey();
  let selectedLookback: LookbackPreset = "1M";
  let selectedAggregation: AggregationPeriod = "1D";
  let showVix = true;
  let hasLoadedPreferences = false;
  let vixToggleId = "show-vix";
  let hoverHudState: ChartHudState | null = null;

  $: snapshotDate = new Date(data.dashboard.status.finished_at);
  $: dataAsOfLabel = snapshotDate.toLocaleString("en-US", {
    weekday: activeSection === "constituents" ? "short" : undefined,
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: activeSection === "tickers" ? "numeric" : undefined,
    minute: activeSection === "tickers" ? "2-digit" : undefined,
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
  $: selectedLatestPoint = rawMarketPoints.at(-1) ?? null;
  $: selectedLatestPrice = selectedLatestPoint
    ? selectedLatestPoint.close.toLocaleString("en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: selectedLatestPoint.close >= 100 ? 2 : 0,
      })
    : "--";
  $: selectedLatestDate = selectedLatestPoint
    ? new Date(`${selectedLatestPoint.date}T00:00:00Z`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;
  $: tickerDiscovery = buildTickerDiscoveryState(
    data.dashboard,
    searchQuery,
    activeFilter,
    selectedSymbol,
    recentSymbols,
    selectedLookback,
    selectedAggregation,
  );
  $: trendLabel = `Trend (${selectedLookback})`;
  $: recentSymbols = sanitizeRecentSymbols(data.dashboard, recentSymbols);
  $: hasAnyVixData = Boolean(data.dashboard.vixSymbol && vixPoints.length > 0);
  $: volumeScale = getVolumeScale(marketPoints);
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
    data.dashboard.status.failed_sources.length > 0;
  $: statusIssueLabel = hasStatusIssues
    ? [
        data.dashboard.status.failed_symbols.length > 0
          ? `Failed symbols: ${data.dashboard.status.failed_symbols.join(", ")}`
          : null,
        data.dashboard.status.failed_sources.length > 0
          ? `Failed sources: ${data.dashboard.status.failed_sources.join(", ")}`
          : null,
        data.dashboard.status.status !== "success"
          ? `Refresh status: ${data.dashboard.status.status}`
          : null,
      ]
        .filter((value): value is string => Boolean(value))
        .join(" • ")
    : "";
  $: latestHudState = buildChartHudState(
    marketPoints.at(-1) ?? null,
    showVixOverlay ? (vixPoints.at(-1) ?? null) : null,
    "latest",
  );
  $: displayedHudState = hoverHudState ?? latestHudState;
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

    const handleKeydown = (event: KeyboardEvent): void => {
      const target = event.target;
      const isEditableTarget =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable);

      if (isEditableTarget) {
        return;
      }

      if (
        activeSection === "tickers" &&
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        isFinderOpen = true;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("keydown", handleKeydown);
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
    isFinderOpen = false;
    hoverHudState = null;
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

  function handleHudChange(state: ChartHudState | null): void {
    hoverHudState = state;
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

    <div class="flex flex-col gap-3 sm:items-end">
      <div class="rounded-[20px] border bg-card/80 px-4 py-3 text-sm shadow-[0_12px_32px_rgba(18,26,33,0.08)]">
        <div class="flex items-start gap-2">
          <div class="min-w-0">
            <p class="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Data as of
            </p>
            <p class="mt-1 font-medium">
              {dataAsOfLabel}
            </p>
          </div>
          {#if hasStatusIssues}
            <span
              aria-label={statusIssueLabel}
              class="mt-0.5 inline-flex h-2.5 w-2.5 rounded-full bg-amber-500"
              title={statusIssueLabel}
            ></span>
          {/if}
        </div>
      </div>
    </div>
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
            <div class="space-y-3">
              <div>
                <p class="text-sm font-medium text-muted-foreground">
                  {selectedSymbolOption?.label ?? "Published symbol"}
                </p>
                <div class="mt-1 flex flex-wrap items-end gap-3">
                  <h2 class="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
                    {selectedSymbol}
                  </h2>
                  <p class="text-2xl font-semibold tracking-tight text-foreground/90 md:text-3xl">
                    ${selectedLatestPrice}
                  </p>
                </div>
                <p class="mt-2 text-sm text-muted-foreground">
                  {#if selectedLatestDate}
                    Latest published close from {selectedLatestDate}.
                  {:else}
                    Latest published close is unavailable in this snapshot.
                  {/if}
                </p>
              </div>

              <div class="rounded-[22px] border bg-background/55 p-4">
                <div class="flex flex-col gap-5">
                  <div class="flex justify-end">
                    <button
                      class="flex w-full min-w-[18rem] items-center gap-3 rounded-full border bg-card/78 px-4 py-2 text-left transition hover:border-ring/30 hover:bg-card sm:w-auto"
                      on:click={() => {
                        isFinderOpen = true;
                      }}
                      type="button"
                    >
                      <span aria-hidden="true" class="text-muted-foreground">
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle
                            cx="11"
                            cy="11"
                            r="7"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-width="1.8"
                          ></circle>
                          <path
                            d="m20 20-3.5-3.5"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-width="1.8"
                          ></path>
                        </svg>
                      </span>
                      <span class="flex-1 text-sm text-muted-foreground">Find ticker...</span>
                      <span class="rounded-md border bg-background/70 px-2 py-0.5 text-xs text-muted-foreground">
                        Cmd/Ctrl+K
                      </span>
                    </button>
                  </div>

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
                      <label
                        class={`inline-flex min-w-[8rem] items-center justify-between gap-3 rounded-full border px-3 py-2 text-sm transition ${
                          showVixOverlay || (showVix && !hasAnyVixData)
                            ? "border-ring bg-accent/70 text-foreground"
                            : "bg-background/70 text-muted-foreground hover:border-ring/40 hover:text-foreground"
                        } ${(!hasAnyVixData || selectedSymbol === data.dashboard.vixSymbol) ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                        for={vixToggleId}
                      >
                        <span>VIX</span>
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

                  {#if displayedHudState}
                    <div class="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-[18px] border bg-card/78 px-4 py-3 font-mono text-sm">
                      <span class="text-muted-foreground">{formatChartHudDate(displayedHudState.date)}</span>
                      <span><span class="text-muted-foreground">O</span> {formatChartHudPrice(displayedHudState.open)}</span>
                      <span><span class="text-muted-foreground">H</span> {formatChartHudPrice(displayedHudState.high)}</span>
                      <span><span class="text-muted-foreground">L</span> {formatChartHudPrice(displayedHudState.low)}</span>
                      <span><span class="text-muted-foreground">C</span> {formatChartHudPrice(displayedHudState.close)}</span>
                      <span class="text-blue-600">Vol {formatChartHudVolume(displayedHudState.quoteVolume, volumeScale)}</span>
                      {#if displayedHudState.vix !== null}
                        <span class="text-amber-600">VIX {formatChartHudPrice(displayedHudState.vix)}</span>
                      {/if}
                    </div>
                  {/if}
                </div>
              </div>
            </div>

            <div class="pt-2">
              {#key selectedSymbol}
                <PriceChart
                  onHudChange={handleHudChange}
                  points={marketPoints}
                  showVix={showVixOverlay}
                  vixPoints={showVixOverlay ? vixPoints : []}
                />
              {/key}
            </div>

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

          </Card>
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

<SearchModal
  bind:activeFilter
  bind:isOpen={isFinderOpen}
  bind:query={searchQuery}
  entries={tickerDiscovery.entries}
  options={tickerDiscovery.filterOptions}
  recentEntries={tickerDiscovery.recentEntries}
  {selectedSymbol}
  {trendLabel}
  onSelect={selectSymbol}
/>
