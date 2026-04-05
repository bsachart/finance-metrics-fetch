<script lang="ts">
  import { cn } from "$lib/utils";

  export let className = "";
  export let value = "";
  export let placeholder = "";
</script>

<input
  bind:value
  class={cn(
    "border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-11 w-full rounded-2xl border px-4 py-2 text-sm outline-none focus-visible:ring-2",
    className,
  )}
  {placeholder}
/>
