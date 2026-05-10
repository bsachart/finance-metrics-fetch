# Research: fix-chart-colors

## Technical Context Unknowns Resolved
- The chart implementation uses Lightweight Charts and is found in `ui/src/lib/charts/price-chart.svelte`.
- The chart conditionally colors the VIX line: `#d97706` (amber) if VIX >= 20, else `#7c5cff` (purple/violet).
- The legend text in `ui/src/routes/+page.svelte` hardcodes `<span class="text-amber-600">` for VIX regardless of its value.
- To fix the discrepancy, we must ensure the legend color matches the dynamic chart color.

## Decision
Compute the dynamic VIX color tone in `ui/src/routes/+page.svelte` based on the same threshold (20) used in `price-chart.svelte` and apply the correct Tailwind text color class, or use a shared exported value.
The simplest approach is to add a reactive variable `vixTone` in `+page.svelte` that mirrors the logic: `(vixPoints.at(-1)?.close ?? 0) >= 20 ? "text-amber-600" : "text-[#7c5cff]"` or similar tailwind classes.

## Alternatives Considered
- Moving color constants into a shared `market.ts` configuration file. This might be better for long term consistency but simple logic in `+page.svelte` is also fine. Let's export the color constants or write them in `+page.svelte`. Since Tailwind `text-amber-600` is used for amber, we can use `text-violet-500` for purple. Let's stick to inline style or arbitrary tailwind class like `text-[#7c5cff]` to match exactly.
