# mech-analytics migration spec

> **Status:** `USE_MECH_ANALYTICS` is off everywhere.
> **Next steps:**
> 1. Turn the flag on in a Vercel preview deployment. Run the checks from the
>    "Verification" section. The flag-on numbers must be equal to the flag-off
>    numbers for the same time window.
> 2. Turn the flag on in production at cut-over. Watch for 24–48 hours.
> 3. Remove the flag and the subgraph code paths.
>
> **Last verified against code:** 2026-07-27. Update this header when the flag
> state changes.

This document tells why and how the website moves its per-request
marketplace-subgraph reads to the
[mech-analytics](https://github.com/valory-xyz/mech-analytics) API.
The `USE_MECH_ANALYTICS` flag controls all new read paths. Default: off.

## Background

Mech requests move off-chain. After the switch, the marketplace subgraph does
not create `Request` or `ParsedRequest` entities anymore. The only on-chain
trace of an off-chain request is the `MarketplaceDeliveryWithSignatures`
settlement event. This event contains request IDs but no payload.

The event handler keeps all **aggregate** counters correct:
`global.totalRequests`, `global.totalDeliveries`, `global.totalAtaTransactions`,
`sender.totalLegacyRequests`, `RequestsPerAgent`, and `AtaTransaction` entities.
We verified this in
`autonolas-subgraph/subgraphs/marketplace/src/marketplace/mech-marketplace.ts`.
But per-request reads (`questionTitle`, `tool`) return nothing.

### What migrates (breaks after the switch)

| Read path | File | Replacement |
|---|---|---|
| ROI incremental mech-request feed | `common-util/api/predict/roi-distribution.ts` — flag branch in `updateAgentBlueprintData`, replaces `fetchIncrementalMechRequests` | `/v1/data/scored-rows` with the `since_computed_at` cursor |
| Tool-accuracy per-sender pulls | `common-util/api/predict/tool-accuracy.ts` — `fetchMechRequestsForSender` selects the source; one shared subgraph fetcher serves both chains | `/v1/data/scored-rows?requester=…`, stateless |

The shared client code is in `common-util/api/predict/mech-analytics.ts`.

### What stays on current sources (keeps working)

- Homepage and `mech-marketplace` page: ATA transactions and fees.
- `agent-economies` mech tiles, with the categorized `RequestsPerAgent` counts.
- Explorer DAA and ATA series.
- Mech DAA (registry subgraph) and all fee subgraphs.
- On-chain `collectedFees`.
- `senderTotal` in ROI: `totalLegacyRequests + totalMarketplaceRequests` grows
  at settlement time, so the subgraph read stays correct.

mech-analytics cannot serve these paths. It has no public chain-level endpoint.
It covers 4 chains; the website queries 6 marketplace chains. It has no DAA
primitive. We rejected `/v1/metrics/ai-agent` for `senderTotal` because it only
covers Safes registered on the service registry.

## The endpoint

`GET {MECH_ANALYTICS_URL}/v1/data/scored-rows` returns one row per scored mech
request: `request_id`, `requester`, `requested_at`, `question_title`, `tool`,
`resolution_status`, `computed_at`, and more. Pages use a keyset cursor on
`(computed_at, request_id)`. `limit` maximum is 5000.

Filters we use: `chain_id`, `requester`, `since` / `until` (on `requested_at`),
`since_computed_at`, `resolved` (`false` = `resolved_outcome IS NULL`).
All datetimes must be ISO 8601 with a timezone.

Two endpoint properties control the whole design:

1. **Rows arrive in scoring order, not in request order.** A late-settled
   request can appear with an old `requested_at`. A watermark on
   `requested_at` skips such rows forever. Only `computed_at` is a safe
   watermark.
2. **The API sends rows more than one time.** The resolution sweep updates
   `computed_at` each time a resolution lands, up to 90 days later. The API
   then serves the row again. A consumer that only accumulates must remove
   duplicates by `request_id`. Timestamps or titles are not safe keys for
   this: the re-served row often arrives when the QMR entry is already
   consumed. Also, `resolution_status` does not show the first serve: rows
   scored after resolution keep the value `'pending'` until the sweep touches
   them.

## ROI feed design (`fetchMechRequestsFromAnalytics`)

The QMR blob gets these fields (additive; no `SCHEMA_VERSIONS` change):

- `lastComputedAt` — the `computed_at` watermark.
- `ingestedRequestIds` — map of `request_id → requested_at` (unix seconds).
  Pruned to the 14-day QMR window (`QMR_MAX_AGE_DAYS`). This map makes the
  ingest exactly-once. It is safe against sweep re-serves, boundary re-serves
  (one scoring batch shares one `computed_at`), and backfill surges.
- `lastMechRequestTimestamp` — we continue to write it (max saved
  `requested_at`). A flag-off rollback continues the subgraph path from it.

**First flag-on run: rebuild, do not merge.** We cannot match subgraph-era QMR
entries with analytics rows. The live writer sets `requested_at` to the mech
authorization time, not to the block timestamp. Titles can also differ. So the
run drops the old map and fetches the open set: `since=<now−14d>` and
`resolved=false`. Rows with `resolution_status='invalid'` are skipped, but
their IDs go into the map, so later re-serves are also skipped. The watermark
becomes a `runStart` value taken *before* the fetch. Rows scored during the
fetch and excluded by `resolved=false` then appear in the next incremental
run. If the rebuild fails, we save nothing and try again on the next run. A
partial rebuild is dangerous: it makes `openRequestCount` too low, and then
`settledMechRequests` becomes too high.

**Incremental runs.** Query: `since_computed_at=<watermark>` and
`since=<now−14d>`, with no `resolved` filter (a recent request with a fast
resolution must still be saved). We skip a row when: its ID is in the map, or
`requested_at` is older than the 14-day window, or `resolution_status` is
`'invalid'` (its ID is still recorded), or the title or requester is null. Old rows cannot be open; `settledMechRequests = senderTotal −
openRequestCount` already counts them as settled, the same as the TTL flush.
When a page fails, we keep the partial additions. The watermark then covers
only the processed rows. This loses no data: the endpoint serves rows in
ascending `(computed_at, request_id)` order, so every row on a failed page has
`computed_at` at or after the saved watermark. `since_computed_at` is
inclusive, so the next run receives those rows again. Rows we already saved
come again too; the `ingestedRequestIds` map filters them out. The error
surface stays the same as the subgraph path (`'mech-requests'` in
fetchErrors).

**A flag-off run drops `lastComputedAt` and `ingestedRequestIds`.** A new
flag-on run then starts with a fresh rebuild. An old watermark could count
rows twice, because the subgraph path added rows without map entries.

Downstream code does not change: `fetchAllTimeAgents`, the `openQmr` and
`normalizeTitle` matching, `settledMechRequests`, byDay consumption, the TTL
flush, and the histograms.

## Tool-accuracy design

This path recomputes fully each day. It keeps no state, so it needs no
watermark and no duplicate handling. For each sender we query:
`chain_id + requester + since=<earliest bet ts + 1s>` (equal to the subgraph
`blockTimestamp_gt`). The rows map into the existing `MechRequest` shape.
The metric definition does not change: "trader bets grouped by tool used,
fraction won". We do not use the Brier-based `/v1/metrics/tool/{tool}`
endpoint — that is a different metric.

## Known risks and one-time effects

- **First-run loss.** The rebuild drops entries for markets that settled
  before the flip, when the settlement day was not yet processed. Cost: about
  one day of byDay fee attribution, one time.
- **Rollback overlap.** A flag-off run continues from
  `lastMechRequestTimestamp`. The live-writer `requested_at` is less than or
  equal to the block timestamp, so the subgraph path can read a small overlap
  again. This is acceptable for an emergency rollback. After a long flag-on
  period, reset the `-requests` blob instead.
- **Map size.** About 170k entries (~10–14 MB) at peak gnosis volume. Each run
  logs the size. Possible fix: cut IDs to 16 hex characters.
- **Title drift.** The duplicate check does not use titles, but the
  `profitParticipants` matching does. `normalizeTitle` absorbs most drift.
  The source comparison before the flip must include live-writer rows.
  Backfilled titles come from the subgraph, so they always match.
- **Backfill coverage.** The predict-api backfill skips `parsed_request_null`
  and unhandled-type rows. Historical counts can be a little lower than the
  subgraph counts.
- **Second backfill on Day N−1.** It bulk-scores the gap rows and causes a
  one-day surge. Pagination and the ID map handle it.

## Rollout

1. Merge with `USE_MECH_ANALYTICS=false`. Nothing changes in production.
2. Set `MECH_ANALYTICS_URL` and turn the flag on in a preview, after
   mech-analytics is deployed and caught up. Run the checks below.
3. Turn the flag on in production at cut-over. Watch for 24–48 hours: blob
   `fetchErrors`, the StaleIndicator on predict ROI, the tool-accuracy table.
   To roll back, turn the flag off.
4. After the watch window: remove the flag and the subgraph code paths. Update
   the `/data` page snippets (`OmenstratRoiInfo`, `PolystratRoiInfo`) to show
   the API instead of the retired subgraph queries.

## Verification

- Flag-on dry run: call `/api/refresh-metrics/predict-roi-distribution?agent=omenstrat`
  (then `polystrat`) two times. The first run logs `rebuild ok=true`. The
  second run logs `incremental` and saves only new rows.
- Source comparison: for a fixed 4-day window, compare flag-on and flag-off
  `openRequestCount` per agent. The numbers must be equal. Also compare the
  mech-analytics count (`resolved=false` and `market_id` not null) with the
  title-normalized open-market count.
- Tool accuracy: compare per-tool `{totalBets, correctBets}` between flag-on
  and flag-off runs. Expect only the backfill coverage delta.
- Failure modes: remove `MECH_ANALYTICS_URL` with the flag on. Expect the
  `'mech-requests'` fetchError, and the watermark must not advance.
