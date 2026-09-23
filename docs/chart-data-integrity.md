# Chart data integrity

Every chart on this site is drawn from a subgraph query, and a GraphQL query returns a
**page**, not a set. A page that silently stops short produces a chart that looks
perfectly healthy and is wrong — no error, no gap, just a smaller number.

That is not hypothetical. The staking chart on `/olas-token` fetched `first: 1000`
reward updates per epoch. Gnosis has ~137k of them, 33 of 48 epochs hit the cap, and the
chart published **2.27M OLAS against a true 6.54M** — a third of the real figure, for
months. See [staking-emissions-chart.md](./staking-emissions-chart.md).

## The rule

**Every set is either paged or provably bounded.** Provably bounded means something in
the query caps it — a date window, a singleton id, a fixed enum — not "it is small at
the moment".

**A query with no `first` is capped at 100.** That is The Graph's default, verified:
`rewardUpdates { id }` against a 137k-row set returns exactly 100 rows. Omitting `first`
is the most dangerous form of this bug, because the number never appears in the source.

## Inventory

| Chart / metric | Source | Bounding | Status |
|---|---|---|---|
| 4 emissions charts, `/olas-token` | `emissionsPageQuery` → `epoches` | cursor-paged on `counter` | ok — **was unbounded**, see below |
| Staking emissions maths | `staking-emissions-math.ts` | unit-tested in CI | epoch boundaries and paging termination pinned |
| Staking 4-line series | `mintedForStakingSets`, `stakingChainSets` | cursor-paged per set | ok |
| Emission schedule | `getActualInflationForYear` × 13 | fixed loop | ok |
| Supply pie | contract reads + `total_supply` | singletons | ok, see *circulating supply* |
| Usage pie | `getEpochDistribution` | singleton | ok |
| Predict ROI distribution | `predict-roi-distribution` blob | precomputed | ok |
| Daily active agents | `dailyPredictAgentsPerformancesQuery` | 8-day window × few agent ids | ok — window bounds it |
| Explorer Omenstrat series | `explorerOmenstratSeriesQuery` | skip-paged, `MAX_PAGES` | ok |
| Explorer mech transactions | `mechAtaTransactionsQuery` | timestamp cursor + dedupe | ok |
| Total agents | `agentServicesQuery` | id cursor, **throws** past `SERVICES_MAX_PAGES` | ok — the pattern to copy |
| Staking APR | `stakingContractAgentIdsQuery` | `first: 1000`, 68 rows | ok |

## Findings

### Fixed: `epoches` had no `first`

`emissionsQuery` requested `epoches(orderBy: startBlock)` with no limit, so it was capped
at 100 by default. There are 49 epochs arriving every ~26 days, so it would have started
truncating around **2030**, silently dropping the oldest epochs from all four emissions
charts.

It is now `emissionsPageQuery`, cursor-paged on `counter`. Raising the cap to 1000 would
also have worked for a while, which is the trap: "bounded because it is small today" is
the state this set was already in.

### Correct, do not "fix": null epoch fields

`devIncentivesTotalTopUp` is null in 30 of 49 epochs and `totalBondsClaimed` in 27.
That looks alarming next to this repo's rule against `?? 0` silent zeros, but here it is
right: both are accumulators the subgraph only initialises when the first matching event
fires in that epoch (`mappings.ts`, `olas.ts`). Null means *nothing was claimed*, which
is zero. `getCumulativeEmissions` reading `|| 0` is correct.

`blockTimestamp` and `totalBondsClaimable` are null only on the open epoch, which
`EmissionsSummaryTable` already excludes.

### Fixed: wei through `Number` in the summary table

`getCumulativeEmissions` accumulates in JS `Number` because Chart.js plots numbers, so a
cumulative wei total (~1e24) loses precision past 2^53. That is fine for a plotted point.

`EmissionsSummaryTable` reused it to publish **full numbers**, and only worked because
`String(6.2e24)` is exponential, `BigInt()` throws on it, and `formatWeiNumber`'s catch
branch divides by 1e18 instead. Correct output by way of an exception. The table now sums
in `BigInt` from the raw fields and passes the `BigInt` straight to `formatWeiNumber`.

The charts still use the `Number` helper, which is the right tool for an axis.

### Fixed: circulating supply could go negative

`circulatingSupply = totalSupply - (veOlas + dao + valory)` guarded `totalSupply > 0` but
not the result, so a stale `total_supply` or a holder address added to
`OLAS_SUPPLY_DISTRIBUTION_ADDRESSES` would have rendered a negative pie slice. It now
throws when the non-circulating balances exceed total supply, which surfaces as a
fetchError and leaves `mergeWithFallback` holding the last good snapshot — the same
shape as the sanity clamps used for cross-chain aggregates.

### Removed: dead queries and unread fields

`checkpointsQuery` and `dailyPredictAgentPerformancesWithMultisigsQuery` were defined and
never used, both carrying `first: 1000` over sets already past it — gnosis has 14,942
checkpoints — so they would have truncated on their first use. Deleted; page them if they
are ever revived.

`availableStakingIncentives` and `totalStakingIncentives` were fetched on every epoch and
read by nothing. Dropped from the query and from `SubgraphEpoch`. `OlasTokenPage/types.ts`
held only a `PropTypes` shape nothing imported, and is gone.

### Fixed: a published query that truncated

`fixedProductMarketMakerCreations` in `getMarketsAndBetsQuery` had no `first:`, so it
took the default 100 — against 180 markets in the window the page actually uses. Nothing
on the site consumes those rows; the query is rendered on `/data` as a copy-paste
verification `curl`, so the only person affected was a reader checking our numbers, who
got 100 markets and no sign there were more.

It now takes an explicit `first`, like the other published queries on that page. The
audit rule applies to queries we publish for other people to run, not only to the ones
that feed a chart.

### Absent is not zero

Adding a field to a snapshot is a schema change with a window: the code ships before the
next refresh writes it. Reading a missing key as `0` publishes a confident wrong number
for that window, which is the same failure this page exists to prevent — a smaller
figure, no error.

Test for presence (`field in epoch`), not for a falsy value. A `0` that has been read is
a fact; a `0` that came from an absent key is not.

## Checking a chart

1. Find every set the chart's query asks for. A nested field (`multisigs(first: 1000)`
   inside a parent) is its own set with its own cap.
2. For each, count the rows live and compare against the cap. Full count:
   `{ entity(first:1000, orderBy:id, orderDirection:asc, where:{id_gt:"<cursor>"}) { id } }`,
   paged until a short page.
3. If the count can ever reach the cap, page it. If it cannot, say *why* in a comment —
   the reason is what a later reader needs, not the number.
4. Prefer failing loudly over truncating: `agentServicesQuery`'s call site throws past a
   page ceiling rather than returning a plausible short answer.
