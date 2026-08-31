# Predict ROI accounting

> **Status:** in force since 2026-08. Written after the 2026-08-26 external
> trader-analysis report showed the published Polystrat all-time ROI at −13.56%
> where the correct figure was −7.47% (two defects fixed below).
> **Last verified against code:** 2026-08-31.

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
- Max window: `fetchAllTimeAgents` → `totalExpectedPayout` (`roi-distribution.ts`).
- 7/30/90D: `byDay` sums of `dailyProfit` over `dailyTradedSettled + dailyFeesSettled`.
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
  timestamp) — never wipe it.
- Known rebuild caveats (why `rebuildMech=1` is a deliberate lever, not a
  routine): requests whose settlement day was already processed can only be
  TTL-flushed onto their request day, and if they were already matched back
  then they count twice; until the flush they also inflate `openRequests`,
  temporarily understating the Max-window mech count.

## Observability

- `AgentBlueprintRoiData.mechAttribution` (`matched` / `flushed` / `ingested` /
  `openRequests` / `runAt`) is written on every run and returned by the refresh
  endpoint.
- `windowed-roi.ts` raises `roi-distribution:<agent>:mech-attribution-zero`
  when a full active week settled trading volume with zero booked mech
  requests — the page's `StaleIndicator` then flags the metric. That exact
  silent failure ran for months before 2026-08.

## History (what shipped wrong, for regression context)

- Max window on redeemed `totalPayout` → all-time ROI overstated losses
  (Polystrat −13.56% vs −7.47%; Omenstrat ≈ −33.6% vs ≈ −19%).
- `totalLegacyRequests + totalMarketplaceRequests` → mech fees doubled.
- Explorer daily ROI cost as `totalPayout − dailyProfit` → mixed
  redemption/resolution days.
- Mech-analytics rebuild wiped the QMR open set and fetched only pending rows
  → Polystrat windowed mech cost ≈ 0.
