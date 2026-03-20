import {
  CHAIN_CONFIG,
  CHAINLINK_PRICE_FEED_ADDRESS_POLYGON_POL_USD,
  CHAINLINK_PRICE_FEED_DECIMALS_POLYGON_POL_USD,
  GNOSIS_BALANCER_OLAS_WXDAI_POOL_ID,
  OLAS_TOKEN_ADDRESS_BY_CHAIN,
  POLYGON_BALANCER_OLAS_WMATIC_POOL_ID,
} from 'common-util/constants';
import { BALANCER_GRAPH_CLIENTS } from 'common-util/graphql/client';
import { balancerGetPoolQuery } from 'common-util/graphql/queries';
import Web3 from 'web3';

type BalancerPoolToken = {
  address: string;
  balance: string;
};

type BalancerPoolResponse = {
  pool?: {
    tokens: BalancerPoolToken[];
    totalShares: string;
  } | null;
};

const PRICE_SCALE = 10n ** 18n;

const parseBalanceAsBigInt = (balance: string): bigint => {
  const [intPart, decPart = ''] = balance.split('.');
  const padded = decPart.padEnd(18, '0').slice(0, 18);
  return BigInt(intPart + padded);
};

const CHAINLINK_AGGREGATOR_V3_ABI = [
  {
    inputs: [],
    name: 'latestRoundData',
    outputs: [
      { internalType: 'uint80', name: 'roundId', type: 'uint80' },
      { internalType: 'int256', name: 'answer', type: 'int256' },
      { internalType: 'uint256', name: 'startedAt', type: 'uint256' },
      { internalType: 'uint256', name: 'updatedAt', type: 'uint256' },
      { internalType: 'uint80', name: 'answeredInRound', type: 'uint80' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

const pow10 = (exp: number) => 10n ** BigInt(exp);

// Cache POL/USD for a short period to reduce redundant RPC calls.
const POL_USD_PRICE_CACHE_DURATION_MS = 2 * 60 * 1000; // 2 minutes
let polUsdCache: { value: bigint | null; lastUpdated: number } | null = null;
let polUsdPromiseCache: Promise<bigint | null> | null = null;

let polygonPolUsdWeb3: Web3 | null = null;
let polygonPolUsdFeed: any | null = null;
let polygonPolUsdFeedRpcUrl: string | null = null;

const getPolygonPolUsdPriceScaled = async (): Promise<bigint | null> => {
  const rpcUrl = CHAIN_CONFIG.polygon?.rpc;
  if (!rpcUrl) return null;

  const currentTime = Date.now();

  if (polUsdCache && currentTime - polUsdCache.lastUpdated < POL_USD_PRICE_CACHE_DURATION_MS) {
    return polUsdCache.value;
  }

  if (polUsdPromiseCache) return polUsdPromiseCache;

  polUsdPromiseCache = (async () => {
    try {
      if (!polygonPolUsdWeb3 || polygonPolUsdFeedRpcUrl !== rpcUrl || !polygonPolUsdFeed) {
        polygonPolUsdWeb3 = new Web3(rpcUrl);
        polygonPolUsdFeed = new polygonPolUsdWeb3.eth.Contract(
          CHAINLINK_AGGREGATOR_V3_ABI as unknown as any,
          CHAINLINK_PRICE_FEED_ADDRESS_POLYGON_POL_USD
        );
        polygonPolUsdFeedRpcUrl = rpcUrl;
      }

      const latest: any = await polygonPolUsdFeed.methods.latestRoundData().call();
      const answerStr = Array.isArray(latest) ? latest[1] : latest?.answer;
      if (typeof answerStr !== 'string') return null;

      const answer = BigInt(answerStr);
      if (answer <= 0n) return null;

      return (answer * PRICE_SCALE) / pow10(CHAINLINK_PRICE_FEED_DECIMALS_POLYGON_POL_USD);
    } catch (error) {
      console.error('Error fetching Polygon POL/USD from Chainlink:', error);
      return null;
    } finally {
      polUsdPromiseCache = null;
    }
  })();

  const result = await polUsdPromiseCache;
  polUsdCache = { value: result, lastUpdated: currentTime };
  return result;
};

/**
 * Fetches the current OLAS price in USD for Predict ROI.
 *
 * - `gnosis`: uses Gnosis Balancer OLAS-WXDAI (WXDAI ≈ 1 USD), so OLAS/USD is directly derived from the pool.
 * - `polygon`: uses Balancer OLAS-WMATIC to get OLAS/MATIC, then converts WMATIC -> USD via on-chain POL/USD Chainlink feed.
 *
 * Return value is the OLAS price in USD scaled by 1e18 (BigInt).
 */
export const fetchOlasPriceInUsd = async (chain: 'gnosis' | 'polygon'): Promise<bigint | null> => {
  const olasAddress = OLAS_TOKEN_ADDRESS_BY_CHAIN[chain];
  if (!olasAddress) {
    console.error(`OLAS token address for ${chain} missing in data/tokens.json`);
    return null;
  }

  const client = BALANCER_GRAPH_CLIENTS[chain];
  const poolId =
    chain === 'gnosis' ? GNOSIS_BALANCER_OLAS_WXDAI_POOL_ID : POLYGON_BALANCER_OLAS_WMATIC_POOL_ID;

  try {
    const data = (await client.request(balancerGetPoolQuery(poolId))) as BalancerPoolResponse;
    const poolTokens = data.pool?.tokens || [];
    if (!poolTokens.length) {
      console.error('No tokens returned from Balancer pool for OLAS price');
      return null;
    }

    const olasToken = poolTokens.find(
      (token) => token.address.toLowerCase() === olasAddress.toLowerCase()
    );
    const otherToken = poolTokens.find(
      (token) => token.address.toLowerCase() !== olasAddress.toLowerCase()
    );

    if (!olasToken || !otherToken) {
      console.error('Could not identify OLAS and counterparty token in Balancer pool');
      return null;
    }

    const olasBalance = parseBalanceAsBigInt(olasToken.balance);
    const otherTokenBalance = parseBalanceAsBigInt(otherToken.balance);

    if (olasBalance <= 0n || otherTokenBalance <= 0n) {
      return null;
    }

    if (chain === 'gnosis') {
      return (otherTokenBalance * PRICE_SCALE) / olasBalance;
    }

    if (chain === 'polygon') {
      // `polygon`: WMATIC (18 decimals) -> USD via Chainlink POL/USD
      const polUsdScaled = await getPolygonPolUsdPriceScaled();
      if (!polUsdScaled) return null;

      const olasInMaticScaled = (otherTokenBalance * PRICE_SCALE) / olasBalance;

      return (olasInMaticScaled * polUsdScaled) / PRICE_SCALE;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching OLAS price from Balancer (${chain}):`, error);
    return null;
  }
};
