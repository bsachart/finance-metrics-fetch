# Research: Unified Analytics Workspace

## Decision: Treat timeframe as one shared analytical context

**Rationale**: The active timeframe is the user's top-level analytical lens.
The chart and ticker-table trends should never disagree about the period they
represent, so one shared timeframe state is the simplest trustworthy model.

**Alternatives considered**:

- Independent timeframe logic for list rows and chart: creates hidden drift and
  higher cognitive load.
- Fixed row-level sparkline window: easier to implement but misleading once the
  user changes timeframe.

## Decision: Keep VIX in the lower analytical pane with its own scale and baseline

**Rationale**: VIX should remain contextual, not compete with price, but it
still needs a dedicated scale and a visible zero baseline so magnitude reads
clearly and honestly.

**Alternatives considered**:

- Overlay VIX on price again: reintroduces dual-axis confusion in the main pane.
- Give VIX a fully separate standalone chart: adds vertical weight for a signal
  that is still secondary to the active ticker.

## Decision: Group tooltip content into price, volume, and indicator blocks

**Rationale**: Hover data is high-value but easy to overload. Grouped blocks
reduce scan time and help users separate primary price context from supporting
market-activity and volatility context.

**Alternatives considered**:

- One flat tooltip list: denser but harder to parse quickly.
- Separate hover widgets outside the chart: increases eye travel and visual noise.

## Decision: Replace button-like legend chips with a simple visual legend

**Rationale**: Static legend chips that look clickable create deceptive UI.
When a legend is only descriptive, a lighter non-button treatment is clearer,
quieter, and more honest about what the user can actually manipulate.

**Alternatives considered**:

- Keep pill-shaped legend chips without interaction: visually misleading.
- Turn every legend item into a toggle: adds more controls and duplicates the
  existing VIX toggle for limited benefit.

## Decision: Reduce scaffolding and redundant status language

**Rationale**: The dashboard already carries substantial quantitative content.
Removing duplicate labels, placeholder failure text, and heavy grid treatment
improves focus without removing useful information.

**Alternatives considered**:

- Keep current labels and boxes: simpler short term but keeps avoidable noise.
- Add more explanatory helper text: solves uncertainty with more words instead
  of clearer visuals.

## Decision: Keep ticker-row trend cues semantically aligned

**Rationale**: Sparkline color and row-level change color must agree or the
table becomes untrustworthy. Consistent direction cues let users scan rows
quickly without double-checking every cell.

**Alternatives considered**:

- Neutral sparkline colors for all rows: quieter but loses directional meaning.
- Independent sparkline palettes: introduces avoidable ambiguity.
