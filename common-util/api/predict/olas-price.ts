import { readChainlinkUsdAnswer } from 'common-util/chainlink';
import {
  CHAINLINK_PRICE_FEED_ADDRESS_POLYGON_POL_USD,
  CHAINLINK_USD_FEED_DECIMALS,
  GNOSIS_BALANCER_OLAS_WXDAI_POOL_ID,
  OLAS_TOKEN_ADDRESS_BY_CHAIN,
  POLYGON_BALANCER_OLAS_WMATIC_POOL_ID,
} from 'common-util/constants';
import { BALANCER_GRAPH_CLIENTS } from 'common-util/graphql/client';
import { balancerGetPoolQuery } from 'common-util/graphql/queries';

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

// POL/USD scaled by 1e18, or null when the feed can't be read.
const getPolygonPolUsdPriceScaled = async (): Promise<bigint | null> => {
  try {
    const answer = await readChainlinkUsdAnswer(
      'polygon',
      CHAINLINK_PRICE_FEED_ADDRESS_POLYGON_POL_USD
    );
    return (answer * PRICE_SCALE) / 10n ** BigInt(CHAINLINK_USD_FEED_DECIMALS);
  } catch (error) {
    console.error('Error fetching Polygon POL/USD from Chainlink:', error);
    return null;
  }
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
