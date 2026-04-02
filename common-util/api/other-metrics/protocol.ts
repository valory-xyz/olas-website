import { TOTAL_PROTOCOL_REVENUE_FROM_FEES_ID } from 'common-util/constants';
import { LIQUIDITY_GRAPH_CLIENTS } from 'common-util/graphql/client';
import {
  checkSubgraphLag,
  createStaleStatus,
  getChainBlockNumber,
  getFetchErrorAndCreateStaleStatus,
} from 'common-util/graphql/metric-utils';
import { liquidityEthQuery, liquidityL2Query } from 'common-util/graphql/queries';
import { MetricWithStatus, SubgraphMeta } from 'common-util/graphql/types';
import get from 'lodash/get';

// ─── Dune fetch (kept for fees only) ────────────────────────────────────────

const duneApiFetch = async (queryId: string | number) => {
  const response = await fetch(`https://api.dune.com/api/v1/query/${queryId}/results`, {
    headers: {
      'X-Dune-API-Key': process.env.DUNE_API_KEY || '',
    },
  });
  const data = await response.json();

  if (data?.error) {
    throw new Error(`Dune API error: ${data.error}`);
  }

  if (!response.ok) {
    throw new Error(`Dune API error: ${response.statusText}`);
  }

  return data;
};

// ─── Subgraph types ─────────────────────────────────────────────────────────

type EthSubgraphResponse = {
  lptokenMetrics: {
    treasuryPercentage: string;
    ethUsdPrice: string;
    maticUsdPrice: string;
    solUsdPrice: string;
    poolLiquidityUsd: string;
    protocolOwnedLiquidityUsd: string;
  };
  bridgedPOLHoldings: Array<{
    id: string;
    originChain: string;
    pair: string;
    currentBalance: string;
  }>;
  _meta?: SubgraphMeta;
};

type L2SubgraphResponse = {
  poolMetrics_collection: Array<{
    id: string;
    reserve0: string;
    reserve1: string;
    totalSupply: string;
    celoUsdPrice?: string;
  }>;
  _meta?: SubgraphMeta;
};

type Prices = { eth: number; matic: number; sol: number };

// ─── L2 chain valuation config ──────────────────────────────────────────────
// Token order (reserve0/reserve1) is determined by each pool's contract.
// Each chain uses "2 × paired_token_reserves × price" (no OLAS price needed).

const L2_CHAIN_CONFIG: Record<
  string,
  {
    computeTvl: (
      pool: L2SubgraphResponse['poolMetrics_collection'][0],
      prices: Prices
    ) => number | null;
  }
> = {
  gnosis: {
    // reserve1 = WXDAI (stablecoin ≈ $1), 18 decimals
    // Divide by 10^12 in BigInt space to keep 6 decimal places and avoid Number precision loss
    computeTvl: (pool) => (Number(BigInt(pool.reserve1) / 10n ** 12n) / 1e6) * 2,
  },
  polygon: {
    // reserve0 = WMATIC, 18 decimals
    computeTvl: (pool, prices) => {
      if (prices.matic <= 0) return null;
      return (Number(BigInt(pool.reserve0) / 10n ** 12n) / 1e6) * 2 * prices.matic;
    },
  },
  arbitrum: {
    // reserve1 = WETH, 18 decimals
    computeTvl: (pool, prices) => (Number(BigInt(pool.reserve1) / 10n ** 12n) / 1e6) * 2 * prices.eth,
  },
  optimism: {
    // reserve0 = WETH, 18 decimals
    computeTvl: (pool, prices) => (Number(BigInt(pool.reserve0) / 10n ** 12n) / 1e6) * 2 * prices.eth,
  },
  base: {
    // reserve1 = USDC (6 decimals, stablecoin ≈ $1)
    // Divide by 100 in BigInt space to keep 4 decimal places
    computeTvl: (pool) => (Number(BigInt(pool.reserve1) / 100n) / 1e4) * 2,
  },
  celo: {
    // reserve0 = CELO, 18 decimals; price from celoUsdPrice (8 decimals, Chainlink on Celo)
    computeTvl: (pool) => {
      const r0 = BigInt(pool.reserve0);
      if (r0 === 0n) return null;
      if (!pool.celoUsdPrice || pool.celoUsdPrice === '0') return null;
      const celoPrice = Number(BigInt(pool.celoUsdPrice)) / 1e8;
      return (Number(r0 / 10n ** 12n) / 1e6) * 2 * celoPrice;
    },
  },
};

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

// ─── POL fetcher (from subgraphs) ───────────────────────────────────────────

const L2_CHAINS = ['gnosis', 'polygon', 'arbitrum', 'optimism', 'base', 'celo'] as const;

async function fetchProtocolOwnedLiquidity(): Promise<MetricWithStatus<number | null>> {
  const indexingErrors: string[] = [];
  const fetchErrors: string[] = [];
  const laggingSubgraphs: string[] = [];

  try {
    const ethClient = LIQUIDITY_GRAPH_CLIENTS.ethereum;

    // Fetch Ethereum subgraph + all L2 subgraphs in parallel
    const [ethResult, ...l2Results] = await Promise.allSettled([
      ethClient.request(liquidityEthQuery) as Promise<EthSubgraphResponse>,
      ...L2_CHAINS.map(async (chain) => {
        const client = LIQUIDITY_GRAPH_CLIENTS[chain];
        const data = (await client.request(liquidityL2Query)) as L2SubgraphResponse;
        return { chain, data };
      }),
    ]);

    // Ethereum subgraph is required — fail if it's not available
    if (ethResult.status !== 'fulfilled') {
      console.error('Error fetching Ethereum liquidity subgraph:', ethResult.reason);
      return { value: null, status: getFetchErrorAndCreateStaleStatus('liquidity:ethereum') };
    }

    const ethData = ethResult.value;

    // Check Ethereum subgraph health
    if (ethData._meta?.hasIndexingErrors) {
      indexingErrors.push('liquidity:ethereum');
    }
    try {
      const ethBlock = await getChainBlockNumber('ethereum');
      if (checkSubgraphLag(ethBlock, ethData._meta?.block?.number, 'ethereum')) {
        laggingSubgraphs.push('liquidity:ethereum');
      }
    } catch {
      laggingSubgraphs.push('liquidity:ethereum');
    }

    // Ethereum POL (pre-computed by subgraph: 2 × ETH_reserves × ETH/USD × treasury% / 10000)
    const ethPolUsd = Number(BigInt(ethData.lptokenMetrics.protocolOwnedLiquidityUsd)) / 1e8;

    // Prices from Chainlink oracles (stored by Ethereum subgraph, 8 decimals)
    const prices: Prices = {
      eth: Number(BigInt(ethData.lptokenMetrics.ethUsdPrice)) / 1e8,
      matic: Number(BigInt(ethData.lptokenMetrics.maticUsdPrice || '0')) / 1e8,
      sol: Number(BigInt(ethData.lptokenMetrics.solUsdPrice || '0')) / 1e8,
    };

    // Bridged LP balances (Treasury's balance of each bridged LP token on L1)
    const bridgedBalances: Record<string, bigint> = {};
    for (const holding of ethData.bridgedPOLHoldings) {
      bridgedBalances[holding.originChain] = BigInt(holding.currentBalance);
    }

    // Process L2 chains
    let totalPolUsd = ethPolUsd;

    for (let i = 0; i < L2_CHAINS.length; i++) {
      const chain = L2_CHAINS[i];
      const result = l2Results[i];
      const source = `liquidity:${chain}`;

      if (result.status !== 'fulfilled') {
        fetchErrors.push(source);
        console.error(`Error fetching ${chain} liquidity subgraph:`, result.reason);
        continue;
      }

      try {
        const { data } = result.value;

        if (data._meta?.hasIndexingErrors) {
          indexingErrors.push(source);
        }
        try {
          const chainBlock = await getChainBlockNumber(chain);
          if (checkSubgraphLag(chainBlock, data._meta?.block?.number, chain)) {
            laggingSubgraphs.push(source);
          }
        } catch {
          laggingSubgraphs.push(source);
        }

        const pool = data.poolMetrics_collection?.[0];
        if (!pool) {
          fetchErrors.push(source);
          continue;
        }

        const config = L2_CHAIN_CONFIG[chain];
        const tvl = config.computeTvl(pool, prices);
        if (tvl === null) continue;

        // Treasury's share = bridged_LP_balance / BPT_total_supply
        const totalSupply = BigInt(pool.totalSupply);
        const bridgedBalance = bridgedBalances[chain] || 0n;
        // Compute share using BigInt scaling to avoid precision loss from Number(BigInt)
        const SCALE = 1_000_000_000_000n; // 1e12
        const shareScaled = totalSupply > 0n ? (bridgedBalance * SCALE) / totalSupply : 0n;
        const share = Number(shareScaled) / 1e12;

        totalPolUsd += tvl * share;
      } catch (error) {
        console.error(`Error processing ${chain} liquidity:`, error);
        fetchErrors.push(source);
      }
    }

    // Solana: 2 × SOL_vault × SOL/USD × treasury_share (~99.995%)
    const solBalance = await fetchSolanaVaultBalance();
    if (solBalance !== null && prices.sol > 0) {
      totalPolUsd += solBalance * 2 * prices.sol * SOLANA_TREASURY_SHARE;
    } else {
      fetchErrors.push('liquidity:solana');
    }

    return {
      value: Math.round(totalPolUsd),
      status: createStaleStatus({ indexingErrors, fetchErrors, laggingSubgraphs }),
    };
  } catch (error) {
    console.error('Error fetching protocol owned liquidity:', error);
    return { value: null, status: getFetchErrorAndCreateStaleStatus('liquidity:all') };
  }
}

// ─── Fees fetcher (still from Dune — subgraphs don't track fees) ────────────

type DuneFeesResult = {
  result: {
    rows: {
      Cumulative_Protocol_Earned_Fees: number;
    }[];
  };
};

async function fetchProtocolFees(): Promise<MetricWithStatus<number | null>> {
  try {
    const data = (await duneApiFetch(TOTAL_PROTOCOL_REVENUE_FROM_FEES_ID)) as DuneFeesResult;
    return {
      value: get(data, 'result.rows[0].Cumulative_Protocol_Earned_Fees') ?? null,
      status: createStaleStatus({ indexingErrors: [], fetchErrors: [], laggingSubgraphs: [] }),
    };
  } catch (error) {
    console.error('Error fetching protocol fees from Dune:', error);
    return { value: null, status: getFetchErrorAndCreateStaleStatus('dune:revenue') };
  }
}

// ─── Combined fetcher ───────────────────────────────────────────────────────

export const fetchProtocolMetrics = async () => {
  try {
    const [polResult, feesResult] = await Promise.allSettled([
      fetchProtocolOwnedLiquidity(),
      fetchProtocolFees(),
    ]);

    return {
      totalProtocolOwnedLiquidity:
        polResult.status === 'fulfilled'
          ? polResult.value
          : { value: null, status: getFetchErrorAndCreateStaleStatus('liquidity:all') },
      totalProtocolRevenue:
        feesResult.status === 'fulfilled'
          ? feesResult.value
          : { value: null, status: getFetchErrorAndCreateStaleStatus('dune:revenue') },
    };
  } catch (error) {
    console.error('Error fetching protocol metrics:', error);
    return {
      totalProtocolOwnedLiquidity: {
        value: null,
        status: getFetchErrorAndCreateStaleStatus('liquidity:all'),
      },
      totalProtocolRevenue: {
        value: null,
        status: getFetchErrorAndCreateStaleStatus('dune:revenue'),
      },
    };
  }
};
