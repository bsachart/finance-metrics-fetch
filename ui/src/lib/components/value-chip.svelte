<script lang="ts">
  import { Badge } from "$lib/components/ui/badge";

  export let label: string;
  export let value: string;
  export let tone: "default" | "accent" | "warm" | "danger" = "default";

  const toneByBadgeClass = {
    accent: "border-emerald-200 bg-emerald-50 text-emerald-800",
    danger: "border-red-200 bg-red-50 text-red-800",
    default: "",
    warm: "border-amber-200 bg-amber-50 text-amber-800",
  } as const;

  const toneByCardClass = {
    accent: "border-emerald-200/80 bg-emerald-50/70",
    danger: "border-red-200/80 bg-red-50/70",
    default: "bg-card/80",
    warm: "border-amber-200/80 bg-amber-50/70",
  } as const;
</script>

<article class={`rounded-[24px] border p-4 shadow-sm ${toneByCardClass[tone]}`}>
  <Badge class={toneByBadgeClass[tone]} variant="outline">{label}</Badge>
  <strong class="font-heading mt-3 block text-2xl font-semibold tracking-tight">{value}</strong>
</article>
