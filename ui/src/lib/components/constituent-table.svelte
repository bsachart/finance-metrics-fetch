<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "$lib/components/ui/table";
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
        Latest published constituents from the repository data, with dated daily
        snapshots retained in history files.
      </p>
    </div>
    <div class="w-full md:max-w-sm">
      <Input bind:value={query} placeholder="Filter by symbol, name, or sector" />
    </div>
  </div>

  <div class="mt-5 overflow-auto rounded-[20px] border bg-background/70">
    <Table class="min-w-full text-sm">
      <TableHeader>
        <TableRow>
          <TableHead class="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Symbol</TableHead>
          <TableHead class="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Name</TableHead>
          <TableHead class="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Sector</TableHead>
          <TableHead class="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Sub-industry</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {#each filteredRecords.slice(0, 120) as record}
          <TableRow>
            <TableCell class="px-4 py-3 font-medium">{record.symbol}</TableCell>
            <TableCell class="px-4 py-3">{record.name}</TableCell>
            <TableCell class="px-4 py-3 text-muted-foreground">{record.sector}</TableCell>
            <TableCell class="px-4 py-3 text-muted-foreground">{record.sub_industry}</TableCell>
          </TableRow>
        {/each}
      </TableBody>
    </Table>
  </div>
</section>
