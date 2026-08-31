# POL valuation: live on-chain reserves

**Code:** `common-util/api/other-metrics/protocol.ts`, `common-util/api/other-metrics/live-reserves.ts`

## Problem

The per-chain liquidity subgraphs index the **pool contract** only. The OLAS pools on
Gnosis, Polygon, Arbitrum, Optimism, and Base are Balancer weighted 50/50 pools, and on
Balancer swaps are executed by the **Vault** (`0xBA12222222228d8Ba445958a75a0704d566BF2C8`),
not the pool contract — so the subgraphs never see them. Their `reserve0`/`reserve1` only
refresh on joins/exits and drift with every swap in between.

Observed drift (2026-08-31, subgraph vs Vault `getPoolTokens`):

| Chain | Subgraph | On-chain | Paired-side error |
| --- | --- | --- | --- |
| Arbitrum | 800,137 OLAS / 24.0 WETH | 1,409,073 OLAS / 13.7 WETH | +75% |
| Optimism | 575,815 OLAS / 13.6 WETH | 895,056 OLAS / 8.8 WETH | +55% |
| Base (WETH) | 703,260 OLAS / 10.7 WETH | 863,113 OLAS / 8.8 WETH | +22% |
| Base (USDC) | 1,935,573 OLAS / 36,612 USDC | 1,681,688 OLAS / 42,202 USDC | −13% |
| Polygon | 861,188 OLAS / 297,526 WMATIC | 940,407 OLAS / 274,969 WMATIC | +8% |
| Gnosis | ~2% drift (recent join/exit) | — | ~2% |

Stale reserves corrupt three published outputs:

1. **Per-chain POL USD** — `computeTvlUsd = 2 × paired_reserve × price` inherits the stale
   paired side directly (Arbitrum showed $117.6k vs a real ~$67k).
2. **Tooltip token amounts** — reserves frozen at different dates imply contradictory OLAS
   prices per chain ($0.019–$0.074 when live pools all agreed on ~$0.025), so the two sides
   of a 50/50 pool visibly don't balance.
3. **Cumulative fees USD** — `l2FeesToUsd` converts the OLAS-denominated fee half via the
   `reservePriced/reserveOlas` ratio.

The Ethereum mainnet pool (Uniswap V2) and the Celo pool (Ubeswap V2) are unaffected —
V2 pairs emit `Sync` on every swap and their subgraphs track it.

## Fix

`live-reserves.ts` reads current reserves via RPC at snapshot-build time (RPC URLs come
from `CHAIN_CONFIG`):

- **Balancer pools**: pool `getPoolId()` → Vault `getPoolTokens(poolId)`. The poolId is
  derived on-chain rather than hardcoded so a future pool only needs a `PoolConfig` entry.
- **Uniswap V2 pairs** (Celo): pair `getReserves()` + `token0()`/`token1()` so the
  token-order guard applies here too.

Both return reserves in token-address order (reserve0 = lower address) — the same
convention the subgraph uses — so `protocol.ts` swaps them into the pool object
(`{ ...subgraphPool, reserve0, reserve1 }`) and all downstream math (TVL, tooltip
amounts, fee conversion) is unchanged. Everything else still comes from the subgraphs:
BPT `totalSupply` (joins/exits are indexed, so it's fresh), cumulative fees, bridged LP
balances, and Chainlink prices.

Failure semantics: a failed live read (or a token-order mismatch against
`OLAS_TOKEN_ADDRESS_BY_CHAIN`) fails that chain's POL for the run — never a silent
fallback to stale subgraph reserves — so `mergeWithFallback` freezes the last valid
value, exactly like a subgraph fetch failure.

## Longer term

The proper fix is in the subgraphs themselves: index the Vault's `Swap` event filtered by
poolId (or refresh reserves via `getPoolTokens` calls in existing handlers). Once deployed,
the on-chain reads here become a redundant safety net and could be removed — or kept, since
they are cheap (≤3 `eth_call`s per pool per cron run).
