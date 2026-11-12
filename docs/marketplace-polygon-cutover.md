# Polygon Marketplace cutover: counter and ROI comparison

Read-only capture: **2026-11-11 17:05:27 UTC**. This records the expected counter
correction for the Base/Polygon Marketplace routing change; it is not a
post-deployment measurement.

## Inputs and scope

- Old Marketplace source: `NEXT_PUBLIC_POLYGON_MARKETPLACE_SUBGRAPH_URL`.
- New source: `https://subgraph.autonolas.tech/squid/marketplace-polygon/graphql`.
- Old Graph reads were pinned to **97,140,847**, the squid's initial height.
  The squid advanced to 97,140,850 during pagination; its request/delivery globals
  and classified request counters were unchanged between the first and last reads.
- The old Graph source reported no indexing errors. Sender pages and the unique
  signed-delivery entity walk completed.
- Predict classification is unchanged: agent IDs **14, 25, 13 and 86**. Graph
  adds `requestsPerAgents` and `requestsPerAgentOnchains`; SQD uses
  `requestsPerAgents` alone.

## Request counts

The old Polygon V1/V2 subscriptions process signed deliveries twice, inflating
globals, sender counters and per-agent classification. The unique settlement
entities remain correct. See
[autonolas-subgraph#140](https://github.com/valory-xyz/autonolas-subgraph/issues/140).

| Polygon source count | Old Graph | SQD | Change |
|---|---:|---:|---:|
| Predict-classified requests | 86,824 | 82,064 | −4,760 |
| Raw `global.totalRequests` | 87,548 | 82,541 | −5,007 |
| Sum of `Sender.totalLegacyRequests` | 87,548 | 82,541 | −5,007 |
| Sum of `Sender.totalOffChainRequests` | 10,016 | 5,008 | −5,008 |
| Unique settled off-chain requests | 5,008 | 5,008 | 0 |
| Website's normalized overall request total | 82,540 | 82,541 | +1 |

The earlier review checkpoint was **86,805 → 82,051** Predict requests and
**87,530 → 82,529** raw total requests. Activity continued before this capture.

The categorized Predict reduction is expected. The website's overall total
already compensates for the old duplicate subscriptions:

```text
Graph: raw global − sender off-chain sum + unique settlements
       87,548 − 10,016 + 5,008 = 82,540
SQD:   82,541 (settlements are counted once)
```

Do not describe the raw −5,007 difference as a drop in the published overall
request total. The **one-request normalized residual remains unexplained by
this comparison**; this is not a claim of exact Polygon parity.

## ROI before and after

Held constant: the production Polystrat ROI snapshot from **04:05:47.898 UTC**,
the open-request/QMR snapshot from **04:05:47.903 UTC**, the same 195 trading
agents, and the same payouts, settled trading costs and open-request exclusions.
Only lifetime sender counters were replaced. The existing ROI helpers were used
without changing their arithmetic; the assumed mech fee remains **$0.01/request**.

| Legacy all-time diagnostic | Old Graph counters | SQD counters |
|---|---:|---:|
| Settled mech requests for those trading agents | 84,244 | 79,484 |
| Mech cost | $842.44 | $794.84 |
| Aggregate prediction ROI | −7.46% | −7.37% |

That diagnostic improves by **0.09 percentage points** from the $47.60 lower
mech-cost estimate. It is not the currently published ROI headline: the Max/
all-time tab was replaced by 1Y in September 2026.

Current ROI uses `byDay` settlement-day data. `allTimeAgents` supplies lifetime
bet counts for the distribution's activity threshold; its lifetime
`mechRequests` does not enter `computeWindowedNetGainAndCosts` or histogram ROI.
Running both variants through those functions produced identical windowed net
gain, costs and distributions.

| Current window | Trading ROI before | Trading ROI after | Total ROI before | Total ROI after |
|---|---:|---:|---:|---:|
| 7D | −32.03% | −32.03% | −28.91% | −28.91% |
| 30D | −25.75% | −25.75% | −18.15% | −18.15% |
| 90D | −6.85% | −6.85% | 0.55% | 0.55% |
| 1Y | −7.26% | −7.26% | −2.50% | −2.50% |

Trading ROI matches the production Predict snapshot from **16:20:04.978 UTC**.
Total ROI is that snapshot's value with staking rewards and OLAS/USD price held
constant: unchanged windowed net gain/costs imply unchanged Total ROI too.
The counter-only effect is **0.00 percentage points** on every current window.

This does not promise the live ROI will stay constant: later daily data, prices,
staking rewards or a separately triggered history replay can change it. No
refresh endpoints were called and no blobs or deployment settings were changed.

Implementation references:

- [`fetchAllTimeAgents` and windowed/histogram calculations](../common-util/api/predict/roi-distribution.ts)
- [ROI accounting helpers](../common-util/api/predict/roi-math.ts)
- [Published windowed ROI](../common-util/api/predict/windowed-roi.ts)
- [Overall request normalization](../common-util/api/agent-economies/mech-requests-math.ts)
