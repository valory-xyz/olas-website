# The machine-readable metric text layer

Every number this site publishes also exists as a sentence that states its scope, window
and as-of date. Those sentences are screen-reader-only: **nothing visible changes.**

The problem they solve is that a retrieved passage is read out of context. `4,254,952`
next to the word "Transactions" is not a fact — it does not say what was counted, over
which chains, or when it was last true. `buildMetricContext` in
[`common-util/metric-context.ts`](../common-util/metric-context.ts) composes each of
those sentences so it survives on its own.

## Rules

**Full numbers, never compact.** A tile may read `$13.8K`; the sentence must read
`$13,775`. `formatFullNumber` cannot parse a `K`/`M` suffix, so a compact string passed
in is served verbatim — pass the raw value and let it format.

**No sentence for a value the page is not showing.** A `--` placeholder emits nothing;
publishing "-- transactions" asserts something the page does not say.

**Never invent a date.** `status.lastValidAt` dates the value itself; the snapshot
timestamp only dates the run. When neither exists the clause is omitted.

**Three health states, not two.** `isFrozen` conflates them, so `statusCaveat` separates
them: frozen with a `lastValidAt` is a held-over value; frozen without one is an
incomplete reading; lagging is this run's live data that may undercount. A lagging
metric must not read as unavailable.

**Explanation goes in `note`, not `noun`.** A `noun` containing a full stop strands the
scope and date clauses behind it — *"…may differ, across all supported chains, all time,
as of 4 September 2026."*

**Echo the visible label.** Each sentence carries `(shown as "…")`. Nothing else ties the
hidden text to the tile it describes, so a renamed tile leaves the sentence silently
stale — "Partial ROI" became "Trading ROI" and the hidden copy kept the old name for a
week. Where the label is a variable the binding is structural; hardcoded ones are caught
by `yarn metric-context:check`, which reads the built HTML and fails when a sentence
names a label the page does not show.

## Why tooltips have no screen-reader copy

`components/ui/popover.tsx` renders its children inside a Radix portal, mounted only
while the tooltip is open, so that copy never reaches the served HTML.

Cloning the children into an `sr-only` sibling was tried and reverted. It put
keyboard-focusable links inside an invisible box, pulled whole tooltips into the
accessible name of any button ancestor, and re-rendered stateful children — a healthy
metric was served "sources are behind the chain" alongside a locale-dependent timestamp.

The facts those tooltips carry are published instead as one sentence in the page's
summary — `ActivitySummary`, the Explorer summary, the metric mirrors — where each is
stated once, in context, rather than duplicated at every render of the tooltip. The
homepage flywheel renders twice (desktop and mobile), so a per-tooltip copy emitted
every string twice.

**If a tooltip fact is missing from the text layer, add it to the relevant summary. Do
not reintroduce a per-tooltip copy.**

## Selector states

A crawler fetches a page once. Anything behind a tab or a switcher lives in React state
and never reaches the served HTML, and the tab strip itself serialises as the single
token `7D30D90DMax`. The Predict, ROI-distribution, BabyDegen and Explorer surfaces
therefore write out every state, not only the one on screen.

Each caption names its own state. "The selected range" identifies nothing to a reader who
retrieved that one table.

The off-screen duplicates are generated from the same descriptor lists as the visible
tiles — `PERFORMANCE_METRICS`, `ECONOMIES`, `METRIC_CONFIG` — so the hidden and visible
descriptions of a metric cannot drift apart.

They are `sr-only` and **must not** be `aria-hidden`. Both together would leave content no
human can reach by any means, served only to crawlers, which is the shape Google's
policies call hidden text. Visually-hidden copy is legitimate *because* it serves screen
readers, so it has to actually serve them. They carry
`data-selector-states="off-screen"` instead, which is how `metric-context:check` knows
their labels have no visible counterpart to match.

## Testing

- `yarn metric-context:test` — the sentence rules above, as unit tests. In CI.
- `yarn metric-context:check` — reads `.next/server/pages/**/*.html` and fails when a
  hidden sentence names a label the page does not show. Needs a build, so it runs in
  `postbuild`.
