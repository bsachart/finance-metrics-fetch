<script lang="ts">
  import Input from "$components/ui/input.svelte";
  import { filterConstituents } from "$data/constituents";
  import type { ConstituentRecord } from "$data/types";

  export let records: ConstituentRecord[] = [];
  export let indexLabel: string;
  let query = "";

  $: filteredRecords = filterConstituents(records, query);
</script>

<section class="table-root">
  <div class="panel-header">
    <div>
      <h3 class="section-title">{indexLabel}</h3>
      <p class="section-copy">Published constituents packaged from the repository data.</p>
    </div>
    <div class="search-root">
      <Input bind:value={query} placeholder="Filter by symbol, name, or sector" />
    </div>
  </div>

  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Name</th>
          <th>Sector</th>
          <th>Sub-industry</th>
        </tr>
      </thead>
      <tbody>
        {#each filteredRecords.slice(0, 120) as record}
          <tr>
            <td>{record.symbol}</td>
            <td>{record.name}</td>
            <td>{record.sector}</td>
            <td>{record.sub_industry}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>

<style>
  .table-root {
    border: 1px solid var(--color-border);
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.72);
    padding: 1rem;
  }

  .search-root {
    min-width: min(320px, 100%);
  }

  .table-wrap {
    overflow: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    border-top: 1px solid rgba(19, 33, 47, 0.08);
    padding: 0.75rem 0.4rem;
    text-align: left;
  }

  th {
    color: var(--color-muted-ink);
    font-size: 0.78rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
</style>
