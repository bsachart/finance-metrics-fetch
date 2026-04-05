<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import { filterConstituents } from "$data/constituents";
  import type { ConstituentRecord } from "$data/types";

  export let records: ConstituentRecord[] = [];
  export let indexLabel: string;
  let query = "";

  $: filteredRecords = filterConstituents(records, query);
</script>

<section class="rounded-[24px] border bg-card/80 p-5 shadow-sm">
  <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
    <div>
      <h3 class="font-heading text-3xl font-semibold tracking-tight">{indexLabel}</h3>
      <p class="mt-2 text-muted-foreground">
        Published constituents packaged from the repository data.
      </p>
    </div>
    <div class="w-full md:max-w-sm">
      <Input bind:value={query} placeholder="Filter by symbol, name, or sector" />
    </div>
  </div>

  <div class="mt-5 overflow-auto rounded-[20px] border bg-background/70">
    <table class="w-full border-collapse">
      <thead>
        <tr>
          <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Symbol</th>
          <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Name</th>
          <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Sector</th>
          <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Sub-industry</th>
        </tr>
      </thead>
      <tbody>
        {#each filteredRecords.slice(0, 120) as record}
          <tr class="border-t">
            <td class="px-4 py-3 font-medium">{record.symbol}</td>
            <td class="px-4 py-3">{record.name}</td>
            <td class="px-4 py-3 text-muted-foreground">{record.sector}</td>
            <td class="px-4 py-3 text-muted-foreground">{record.sub_industry}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>
