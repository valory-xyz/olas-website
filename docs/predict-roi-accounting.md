# Predict ROI accounting

> **Status:** in force since 2026-08. Written after the 2026-08-26 external
> trader-analysis report showed the published Polystrat all-time ROI at −13.56%
> where the correct figure was −7.47% (two defects fixed below).
> **Last verified against code:** 2026-09-25.

The rules behind every published Predict ROI number (agent-economies predict
pages, `/data` methodology, Explorer ROI series). The pure formulas live in
`common-util/api/predict/roi-math.ts`; the pipeline around them is
`roi-distribution.ts` / `windowed-roi.ts`.

## Rule 1 — accrual basis: payouts are booked at market resolution

A won bet counts on the day its market resolves, at the payout projected from
the agent's outcome-token balance. We never wait for (or read) redemption.

The subgraphs expose both bases; only the accrual fields may enter ROI:

| basis | per-agent field | daily field | written when |
|---|---|---|---|
| **accrual (use this)** | `totalExpectedPayout` | `dailyProfit`, `dailyTradedSettled`, `dailyFeesSettled` | market resolution (re-adjusted on Omen re-answer) |
| redemption (never in ROI) | `totalPayout` | `DailyProfitStatistic.totalPayout` | `PayoutRedemption` event |

Why: many traders never redeem (the 2026-08 measurement: 9,693 xDAI on Omen,
2,441 USDC on Polymarket of won-but-unclaimed winnings). A redemption-basis ROI
books those wins as trading losses — that was the Max-window defect. The
windowed tabs always used `dailyProfit` and were correct.

Consumers:
- 7/30/90/365D: `byDay` sums of `dailyProfit` over `dailyTradedSettled + dailyFeesSettled`.
  (The old Max window, on `fetchAllTimeAgents` lifetime totals, was replaced by 365D
  in 2026-09; `fetchAllTimeAgents` now only supplies `totalBets` for the histogram's
  activity floor.)
- Explorer daily ROI (`common-util/api/explorer.ts`): `dailyProfit / (dailyTradedSettled + dailyFeesSettled)`.
  Never derive cost as `totalPayout − dailyProfit`: those fields land on
  different days (redemption vs resolution).

## Rule 2 — mech requests are counted once

Sender lifetime count = `totalLegacyRequests`, alone. The marketplace subgraph
increments it for EVERY request kind (legacy `Request`, marketplace request,
off-chain delivery), so despite its name it is the full counter — per chain it
sums to the subgraph's own `global.totalRequests`. `totalMarketplaceRequests`
is a near-identical subset; `legacy + marketplace` counted ~every request twice
(the second Max-window defect: 132k booked vs 66k actual on Polygon).

A follow-up rename in the subgraph (`Sender.totalLegacyRequests` →
`totalRequests`) is desirable; until then the misleading name is documented at
the query (`getMarketplaceSendersQuery`) and in `roi-math.ts`.

Each settled request costs `DEFAULT_MECH_FEE` (0.01, 18-dec) and enters both
the numerator (net gain −) and the denominator (cost base +).

## QMR lifecycle (windowed mech attribution)

QMR = the open set of mech requests, `title → agentId → request timestamps`
(`<agent>-requests` blob). Per daily run:

1. **Ingest** new requests (mech-analytics rows, or subgraph requests when
   `USE_MECH_ANALYTICS=false`) via `mergeQmr`.
2. **Match**: when a market appears in a day's `profitParticipants`, that
   (title, agent) entry is consumed onto the settlement day's
   `byDay[...].mechRequests`.
3. **Flush**: entries older than `QMR_MAX_AGE_DAYS` (14) — requests for markets
   the agent never bet on, or title mismatches — are booked on their request
   day instead.

Rebuild rules (no valid mech-analytics watermark — first flag-on run, or a
forced `?rebuildMech=1` on `/api/refresh-metrics/predict-roi-distribution`):
- Fetch the **full** 14-day window, pending AND resolved rows. Fetching only
  `resolved=false` once silently dropped every already-resolved request in the
  window — Polystrat windows then booked ~zero mech cost.
- **Merge** into the existing open set, deduplicating per (title, agent,
  timestamp) — never wipe it. The dedupe is count-aware: each stored copy of a
  timestamp absorbs one incoming copy, so N same-second requests survive a
  rebuild as N, not 1.
- A forced `?rebuildMech=1` drops only the `lastComputedAt` watermark;
  `ingestedRequestIds` is kept, so rows already ingested (and possibly matched
  onto a settlement day) are suppressed by id, not double-booked. Rows the old
  `resolved=false` filter lost were never ingested, so they are not in the map
  and get picked up.
- Known rebuild caveats (why `rebuildMech=1` is a deliberate lever, not a
  routine): rows ingested while `USE_MECH_ANALYTICS` was off carry no
  analytics request ids, so an already-matched one from that era can be
  re-ingested and later TTL-flushed onto its request day, counting twice;
  a rebuild also refetches the full 14-day window in one run against the
  function's 300s budget.

## 365D history (1Y tab)

`byDay` keeps 366 days (`BYDAY_RETENTION_DAYS`); it kept 90 until 2026-09. A range is
published only once `byDay` reaches its start (`isRoiWindowCovered` against
`historyFrom`, clamped to the platform genesis), so a short history shows `--`, never a
365D label on fewer days.

The genesis clamp is deliberate for Omenstrat: predict-omen daily stats go back to
2023-07, but the accuracy, Brier and staking-rewards accumulators start at
`OMEN_GENESIS_TS` (2025-11-22), so ROI starts there too and every 1Y tile covers the
same days. The text layer says "since <genesis date>" while the clamp applies.

The days the 90-day pruning had already dropped were refilled once by
`backfillRoiHistory` (`?backfillHistory=1` on `/api/refresh-metrics/predict-roi-distribution`,
repeated while `remainingDays > 0`: Polystrat 1 call, Omenstrat ~10 of ~2 min). Profit and settled
costs come from the same daily stats as the live run. Mech requests are a replay of the
QMR lifecycle above — ingest, settlement-day match (the same `consumeSettledRequests`),
TTL flush — walking forward from the range start, so every range books mech cost on the
settlement day. The live feed only ever held ~14 days, so the replay reads the
marketplace subgraph's per-request records instead: they hold legacy (`mechRequest`) and
marketplace requests, but not off-chain ones (~7% of Omenstrat's in 2026-07..09).

- Progress (cursor, open requests, processed days) is kept between calls in
  `roi-distribution/<agent>-history-replay`; `byDay` is written once, at the end, and
  only for days before `historyFrom` — never the day cursor or the live QMR blob. The
  boundary is recorded as `backfilledBefore`.
- Requests still open at `historyFrom` are dropped — the live run booked or flushed them.
- The call fails (writes nothing) when `allTimeAgents` is empty: the trader set filters
  the scan, and an empty one would write zero mech cost.
- The scan reads every request on the chain and filters senders in code; server-side
  `sender_in` measured ~5x slower per row.

Measured while building it (2026-09-25): on-chain requests per bet for Omenstrat agents
ran 1.9–3.5 by month, so a fixed requests-per-bet estimate was rejected. Over
2026-06-27..09-24 the subgraph held 10,132 requests from Polystrat agents — all with a
question title — against ~6,100 the live run booked (4,043 settled + 2,044 open): the live
feed may undercount Polystrat mech cost, so the 1Y window mixes two counts. Tracked in #602.
separately.

These days leave the 365D range by 2027-06; the `/data` paragraph and `backfilledBefore`
can go then (#603).

## Observability

- `AgentBlueprintRoiData.mechAttribution` (`matched` / `flushed` / `ingested` /
  `openRequests` / `runAt`) is written on every run and returned by the refresh
  endpoint. `ingested` is counted post-dedupe (what the merge actually added),
  so the counters reconcile.
- `windowed-roi.ts` raises `roi-distribution:<agent>:mech-attribution-low`
  when, over the last 7 full days, booked mech fees fall below
  `MIN_MECH_FEE_BPS` (0.5%) of settled trading costs. The alarm rides the
  `laggingSubgraphs` channel: the page's `StaleIndicator` flags the metric
  while the fresh value still publishes — a `fetchError` would instead make
  `mergeWithFallback` freeze ROI on the held-over pre-recovery value for the
  whole recovery window. A ratio, not a zero check: the
  2026-08 failure booked a trickle (15 of ~580 weekly requests), never a clean
  zero. Threshold derivation (live data, 2026-08-31, week of 08-23..08-29):
  healthy Polystrat ≈ 630bps (580 req × 0.01 / 92.7 USDC settled), healthy
  Omenstrat ≈ 200bps floor (≥5,511 bets ≥ as many requests / 2,796 xDAI);
  the broken feed ran ≈ 16bps. 50bps sits ≥4× from both sides.

## History (what shipped wrong, for regression context)

- Max window on redeemed `totalPayout` → all-time ROI overstated losses
  (Polystrat −13.56% vs −7.47%; Omenstrat ≈ −33.6% vs ≈ −19%).
- `totalLegacyRequests + totalMarketplaceRequests` → mech fees doubled.
- Explorer daily ROI cost as `totalPayout − dailyProfit` → mixed
  redemption/resolution days.
- Mech-analytics rebuild wiped the QMR open set and fetched only pending rows
  → Polystrat windowed mech cost ≈ 0.
