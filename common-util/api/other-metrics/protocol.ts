import { LIQUIDITY_GRAPH_CLIENTS } from 'common-util/graphql/client';
import {
  checkSubgraphLag,
  createStaleStatus,
  getChainBlockNumber,
  getFetchErrorAndCreateStaleStatus,
} from 'common-util/graphql/metric-utils';
import { liquidityEthQuery, liquidityL2Query } from 'common-util/graphql/queries';
import { MetricWithStatus, SubgraphMeta } from 'common-util/graphql/types';

// ─── Subgraph response types ─────────────────────────────────────────────────

type EthSubgraphResponse = {
  lptokenMetrics: {
    treasuryPercentage: string;
    ethUsdPrice: string;
    maticUsdPrice: string;
    solUsdPrice: string;
    poolLiquidityUsd: string;
    protocolOwnedLiquidityUsd: string;
    cumulativeFeesUsd: string | null;
    cumulativeProtocolFeesUsd: string | null;
    cumulativeExternalFeesUsd: string | null;
  };
  bridgedPOLHoldings: Array<{
    id: string;
    originChain: string;
    pair: string;
    currentBalance: string;
  }>;
  _meta?: SubgraphMeta;
};

type L2Pool = {
  id: string;
  reserve0: string;
  reserve1: string;
  totalSupply: string;
  celoUsdPrice?: string;
  cumulativeFeesToken0?: string;
  cumulativeFeesToken1?: string;
};

type L2SubgraphResponse = {
  poolMetrics_collection: L2Pool[];
  _meta?: SubgraphMeta;
};

type Prices = { eth: number; matic: number; sol: number };

// ─── Per-pool valuation + fee logic (mirrors pol-aggregation.js) ────────────
// For each pool the paired (non-OLAS) token is priced directly; we never price
// OLAS. Pool TVL = 2 × paired_reserves × price. Treasury POL = Pool TVL × share.

type PoolConfig = {
  originChain: string; // key into bridgedPOLHoldings[].originChain
  computeTvlUsd: (pool: L2Pool, prices: Prices) => number | null;
  computeTotalFeesUsd: (pool: L2Pool, prices: Prices) => number | null;
};

// Convert cumulative L2 token-denominated fees to USD. feePriced is in the
// priced token; feeOlas is in OLAS, converted via pool ratio reservePriced/reserveOlas.
// Uses BigInt throughout to avoid Number precision loss for 18-decimal cumulative values.
function l2FeesToUsd(
  feePriced: bigint,
  feeOlas: bigint,
  reservePriced: bigint,
  reserveOlas: bigint,
  price: number,
  decimals = 18
): number {
  const outputScale = 10n ** 8n;
  const pricedDecimalsScale = 10n ** BigInt(decimals);
  const fpScaled = (feePriced * outputScale) / pricedDecimalsScale;

  let olasInPricedScaled = 0n;
  if (reserveOlas > 0n) {
    olasInPricedScaled =
      (feeOlas * reservePriced * outputScale) / (reserveOlas * pricedDecimalsScale);
  }

  const totalPricedScaled = fpScaled + olasInPricedScaled;
  return (Number(totalPricedScaled) / Number(outputScale)) * price;
}

function pairedFromReserve(reserve: string, decimals: number): number {
  // Scale BigInt down to keep precision, then convert to Number.
  const scale = 10n ** BigInt(Math.max(decimals - 6, 0));
  return Number(BigInt(reserve) / scale) / 10 ** Math.min(decimals, 6);
}

// Single-pool chains: keyed by chain name.
// Multi-pool chains (Base): keyed by lowercased pool address.
const POOL_CONFIG_BY_CHAIN: Record<string, PoolConfig> = {
  gnosis: {
    originChain: 'gnosis',
    // OLAS-WXDAI: reserve0=OLAS, reserve1=WXDAI (stablecoin ≈ $1)
    computeTvlUsd: (pool) => pairedFromReserve(pool.reserve1, 18) * 2,
    computeTotalFeesUsd: (pool) => {
      const f0 = BigInt(pool.cumulativeFeesToken0 || '0');
      const f1 = BigInt(pool.cumulativeFeesToken1 || '0');
      return l2FeesToUsd(f1, f0, BigInt(pool.reserve1), BigInt(pool.reserve0), 1.0);
    },
  },
  polygon: {
    originChain: 'polygon',
    // OLAS-WMATIC: reserve0=WMATIC, reserve1=OLAS
    computeTvlUsd: (pool, prices) => {
      if (prices.matic <= 0) return null;
      return pairedFromReserve(pool.reserve0, 18) * 2 * prices.matic;
    },
    computeTotalFeesUsd: (pool, prices) => {
      if (prices.matic <= 0) return null;
      const f0 = BigInt(pool.cumulativeFeesToken0 || '0');
      const f1 = BigInt(pool.cumulativeFeesToken1 || '0');
      return l2FeesToUsd(f0, f1, BigInt(pool.reserve0), BigInt(pool.reserve1), prices.matic);
    },
  },
  arbitrum: {
    originChain: 'arbitrum',
    // OLAS-WETH: reserve0=OLAS, reserve1=WETH
    computeTvlUsd: (pool, prices) => pairedFromReserve(pool.reserve1, 18) * 2 * prices.eth,
    computeTotalFeesUsd: (pool, prices) => {
      const f0 = BigInt(pool.cumulativeFeesToken0 || '0');
      const f1 = BigInt(pool.cumulativeFeesToken1 || '0');
      return l2FeesToUsd(f1, f0, BigInt(pool.reserve1), BigInt(pool.reserve0), prices.eth);
    },
  },
  optimism: {
    originChain: 'optimism',
    // WETH-OLAS: reserve0=WETH, reserve1=OLAS
    computeTvlUsd: (pool, prices) => pairedFromReserve(pool.reserve0, 18) * 2 * prices.eth,
    computeTotalFeesUsd: (pool, prices) => {
      const f0 = BigInt(pool.cumulativeFeesToken0 || '0');
      const f1 = BigInt(pool.cumulativeFeesToken1 || '0');
      return l2FeesToUsd(f0, f1, BigInt(pool.reserve0), BigInt(pool.reserve1), prices.eth);
    },
  },
  celo: {
    originChain: 'celo',
    // CELO-OLAS: reserve0=CELO, reserve1=OLAS. CELO/USD from Chainlink on Celo.
    computeTvlUsd: (pool) => {
      const r0 = BigInt(pool.reserve0);
      if (r0 === 0n) return null;
      if (!pool.celoUsdPrice || pool.celoUsdPrice === '0') return null;
      const celoPrice = Number(BigInt(pool.celoUsdPrice)) / 1e8;
      return pairedFromReserve(pool.reserve0, 18) * 2 * celoPrice;
    },
    computeTotalFeesUsd: (pool) => {
      if (!pool.celoUsdPrice || pool.celoUsdPrice === '0') return null;
      const celoPrice = Number(BigInt(pool.celoUsdPrice)) / 1e8;
      const f0 = BigInt(pool.cumulativeFeesToken0 || '0');
      const f1 = BigInt(pool.cumulativeFeesToken1 || '0');
      return l2FeesToUsd(f0, f1, BigInt(pool.reserve0), BigInt(pool.reserve1), celoPrice);
    },
  },
};

// Base has two pools in one subgraph, dispatched by pool address.
const BASE_POOL_CONFIG: Record<string, PoolConfig> = {
  // OLAS-USDC: reserve0=OLAS(18), reserve1=USDC(6)
  '0x5332584890d6e415a6dc910254d6430b8aab7e69': {
    originChain: 'base',
    computeTvlUsd: (pool) => (Number(BigInt(pool.reserve1)) / 1e6) * 2,
    computeTotalFeesUsd: (pool) => {
      const f0 = BigInt(pool.cumulativeFeesToken0 || '0');
      const f1 = BigInt(pool.cumulativeFeesToken1 || '0');
      return l2FeesToUsd(f1, f0, BigInt(pool.reserve1), BigInt(pool.reserve0), 1.0, 6);
    },
  },
  // WETH-OLAS: reserve0=WETH(18), reserve1=OLAS(18)
  '0x2da6e67c45af2aaa539294d9fa27ea50ce4e2c5f': {
    originChain: 'base-weth',
    computeTvlUsd: (pool, prices) => pairedFromReserve(pool.reserve0, 18) * 2 * prices.eth,
    computeTotalFeesUsd: (pool, prices) => {
      const f0 = BigInt(pool.cumulativeFeesToken0 || '0');
      const f1 = BigInt(pool.cumulativeFeesToken1 || '0');
      return l2FeesToUsd(f0, f1, BigInt(pool.reserve0), BigInt(pool.reserve1), prices.eth);
    },
  },
};

// ─── Sanity bounds ──────────────────────────────────────────────────────────
// Generous upper bounds. OLAS POL is ~$2.5M today; anything over these caps is
// almost certainly a decimals mismatch or similar bug (see the Base WETH-OLAS
// 18→6 decimal bug that produced $1.14×10²⁰). On a breach we return null and
// let mergeWithFallback preserve the previous valid snapshot value.

const MAX_POOL_TVL_USD = 500_000_000; // $500M per pool
const MAX_TOTAL_POL_USD = 1_000_000_000; // $1B across all chains
const MAX_POOL_FEES_USD = 100_000_000; // $100M lifetime fees per pool
const MAX_TOTAL_FEES_USD = 500_000_000; // $500M cumulative protocol fees

const isSaneUsd = (n: number, max: number): boolean =>
  Number.isFinite(n) && n >= 0 && n <= max;

// ─── Solana ─────────────────────────────────────────────────────────────────

const SOL_VAULT_ACCOUNT = 'CLA8hU8SkdCZ9cJVLMfZQfcgAsywZ9txBJ6qrRAqthLx';
const SOLANA_TREASURY_SHARE = 0.99995;

async function fetchSolanaVaultBalance(): Promise<number | null> {
  const rpcUrl = process.env.SOLANA_RPC;
  if (!rpcUrl) return null;

  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getTokenAccountBalance',
        params: [SOL_VAULT_ACCOUNT],
      }),
    });
    const data = await response.json();
    return data?.result?.value?.uiAmount ?? null;
  } catch (error) {
    console.error('Error fetching Solana vault balance:', error);
    return null;
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

// Share = bridged_LP_balance / BPT_total_supply, as a plain number in [0,1].
// BigInt scaling preserves precision when totalSupply is huge.
function computeShare(bridgedBalance: bigint, totalSupply: bigint): number {
  if (totalSupply === 0n) return 0;
  const SCALE = 1_000_000_000_000n; // 1e12
  return Number((bridgedBalance * SCALE) / totalSupply) / 1e12;
}

// ─── POL + fees fetcher (from subgraphs) ────────────────────────────────────

const L2_CHAINS = ['gnosis', 'polygon', 'arbitrum', 'optimism', 'base', 'celo'] as const;

type ProtocolMetricsResult = {
  totalProtocolOwnedLiquidity: MetricWithStatus<number | null>;
  totalProtocolRevenue: MetricWithStatus<number | null>;
};

async function fetchProtocolMetricsInternal(): Promise<ProtocolMetricsResult> {
  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];
  const laggingSubgraphs: string[] = [];

  const ethClient = LIQUIDITY_GRAPH_CLIENTS.ethereum;

  const [ethResult, ...l2Results] = await Promise.allSettled([
    ethClient.request(liquidityEthQuery) as Promise<EthSubgraphResponse>,
    ...L2_CHAINS.map(async (chain) => {
      const client = LIQUIDITY_GRAPH_CLIENTS[chain];
      const data = (await client.request(liquidityL2Query)) as L2SubgraphResponse;
      return { chain, data };
    }),
  ]);

  // Ethereum subgraph is required for prices, bridged balances, and ETH POL/fees.
  if (ethResult.status !== 'fulfilled') {
    console.error('Error fetching Ethereum liquidity subgraph:', ethResult.reason);
    const status = getFetchErrorAndCreateStaleStatus('liquidity:ethereum');
    return {
      totalProtocolOwnedLiquidity: { value: null, status },
      totalProtocolRevenue: { value: null, status },
    };
  }

  const ethData = ethResult.value;

  if (ethData._meta?.hasIndexingErrors) indexingErrors.push('liquidity:ethereum');
  try {
    const ethBlock = await getChainBlockNumber('ethereum');
    if (checkSubgraphLag(ethBlock, ethData._meta?.block?.number, 'ethereum')) {
      laggingSubgraphs.push('liquidity:ethereum');
    }
  } catch {
    laggingSubgraphs.push('liquidity:ethereum');
  }

  // Prices from Chainlink (stored by Ethereum subgraph, 8 decimals)
  const prices: Prices = {
    eth: Number(BigInt(ethData.lptokenMetrics.ethUsdPrice)) / 1e8,
    matic: Number(BigInt(ethData.lptokenMetrics.maticUsdPrice || '0')) / 1e8,
    sol: Number(BigInt(ethData.lptokenMetrics.solUsdPrice || '0')) / 1e8,
  };

  // Ethereum POL (pre-computed by subgraph)
  const ethPolUsd = Number(BigInt(ethData.lptokenMetrics.protocolOwnedLiquidityUsd)) / 1e8;

  // Ethereum fees (pre-computed by subgraph, 8 decimals)
  const ethProtocolFeesRaw = ethData.lptokenMetrics.cumulativeProtocolFeesUsd;
  const ethProtocolFeesUsd =
    ethProtocolFeesRaw != null ? Number(BigInt(ethProtocolFeesRaw)) / 1e8 : null;

  // Bridged LP balances keyed by originChain (e.g. 'base', 'base-weth')
  const bridgedBalances: Record<string, bigint> = {};
  for (const holding of ethData.bridgedPOLHoldings) {
    bridgedBalances[holding.originChain] = BigInt(holding.currentBalance);
  }

  let totalPolUsd = ethPolUsd;
  let totalProtocolFeesUsd = ethProtocolFeesUsd ?? 0;
  let anyFeeMissing = ethProtocolFeesUsd === null;

  // Process each L2 chain
  for (let i = 0; i < L2_CHAINS.length; i++) {
    const chain = L2_CHAINS[i];
    const result = l2Results[i];
    const source = `liquidity:${chain}`;

    if (result.status !== 'fulfilled') {
      fetchErrors.push(source);
      console.error(`Error fetching ${chain} liquidity subgraph:`, result.reason);
      anyFeeMissing = true;
      continue;
    }

    try {
      const { data } = result.value;

      if (data._meta?.hasIndexingErrors) indexingErrors.push(source);
      try {
        const chainBlock = await getChainBlockNumber(chain);
        if (checkSubgraphLag(chainBlock, data._meta?.block?.number, chain)) {
          laggingSubgraphs.push(source);
        }
      } catch {
        laggingSubgraphs.push(source);
      }

      const pools = data.poolMetrics_collection || [];
      if (pools.length === 0) {
        fetchErrors.push(source);
        anyFeeMissing = true;
        continue;
      }

      // Base: two pools in one subgraph, dispatch by pool address.
      // All other chains: single pool.
      const poolsToProcess: Array<{ pool: L2Pool; config: PoolConfig }> = [];
      if (chain === 'base') {
        for (const pool of pools) {
          const config = BASE_POOL_CONFIG[pool.id.toLowerCase()];
          if (config) poolsToProcess.push({ pool, config });
        }
      } else {
        const config = POOL_CONFIG_BY_CHAIN[chain];
        if (config) poolsToProcess.push({ pool: pools[0], config });
      }

      for (const { pool, config } of poolsToProcess) {
        const tvl = config.computeTvlUsd(pool, prices);
        if (tvl === null) {
          anyFeeMissing = true;
          continue;
        }

        // Per-pool sanity: a single pool over $500M almost certainly means a
        // decimals mismatch. Skip it and surface a fetch error.
        if (!isSaneUsd(tvl, MAX_POOL_TVL_USD)) {
          console.error(
            `[protocol-metrics] ${source} pool ${pool.id} TVL out of bounds: $${tvl} — skipping`
          );
          fetchErrors.push(source);
          anyFeeMissing = true;
          continue;
        }

        const share = computeShare(
          bridgedBalances[config.originChain] || 0n,
          BigInt(pool.totalSupply)
        );
        totalPolUsd += tvl * share;

        const totalFees = config.computeTotalFeesUsd(pool, prices);
        if (totalFees === null) {
          anyFeeMissing = true;
        } else if (!isSaneUsd(totalFees, MAX_POOL_FEES_USD)) {
          console.error(
            `[protocol-metrics] ${source} pool ${pool.id} fees out of bounds: $${totalFees} — skipping`
          );
          anyFeeMissing = true;
        } else {
          totalProtocolFeesUsd += totalFees * share;
        }
      }
    } catch (error) {
      console.error(`Error processing ${chain} liquidity:`, error);
      fetchErrors.push(source);
      anyFeeMissing = true;
    }
  }

  // Solana: 2 × SOL_vault × SOL/USD × treasury_share (~99.995%). No fees (no subgraph).
  const solBalance = await fetchSolanaVaultBalance();
  if (solBalance !== null && prices.sol > 0) {
    totalPolUsd += solBalance * 2 * prices.sol * SOLANA_TREASURY_SHARE;
  } else {
    fetchErrors.push('liquidity:solana');
  }

  // Final-total sanity: even if every per-pool value passed, refuse to publish
  // totals over hard caps. Returning null triggers mergeWithFallback to keep
  // the previous valid snapshot value instead of persisting garbage.
  const polFetchErrors = [...fetchErrors];
  let polValue: number | null = Math.round(totalPolUsd);
  if (!isSaneUsd(totalPolUsd, MAX_TOTAL_POL_USD)) {
    console.error(
      `[protocol-metrics] total POL out of bounds: $${totalPolUsd} — returning null`
    );
    polFetchErrors.push('liquidity:pol-out-of-bounds');
    polValue = null;
  }

  const feesFetchErrors = anyFeeMissing ? [...fetchErrors, 'liquidity:fees-partial'] : [...fetchErrors];
  let feesValue: number | null = Math.round(totalProtocolFeesUsd);
  if (!isSaneUsd(totalProtocolFeesUsd, MAX_TOTAL_FEES_USD)) {
    console.error(
      `[protocol-metrics] total fees out of bounds: $${totalProtocolFeesUsd} — returning null`
    );
    feesFetchErrors.push('liquidity:fees-out-of-bounds');
    feesValue = null;
  }

  return {
    totalProtocolOwnedLiquidity: {
      value: polValue,
      status: createStaleStatus({
        indexingErrors,
        fetchErrors: polFetchErrors,
        laggingSubgraphs,
      }),
    },
    totalProtocolRevenue: {
      value: feesValue,
      status: createStaleStatus({
        indexingErrors,
        fetchErrors: feesFetchErrors,
        laggingSubgraphs,
      }),
    },
  };
}

export const fetchProtocolMetrics = async (): Promise<ProtocolMetricsResult> => {
  try {
    return await fetchProtocolMetricsInternal();
  } catch (error) {
    console.error('Error fetching protocol metrics:', error);
    const status = getFetchErrorAndCreateStaleStatus('liquidity:all');
    return {
      totalProtocolOwnedLiquidity: { value: null, status },
      totalProtocolRevenue: { value: null, status },
    };
  }
};
