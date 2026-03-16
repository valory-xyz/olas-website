import {
  BASE_BALANCER_OLAS_USDC_POOL_ID,
  OLAS_TOKEN_ADDRESS_BY_CHAIN,
} from 'common-util/constants';
import { BALANCER_GRAPH_CLIENTS } from 'common-util/graphql/client';
import { balancerGetPoolQuery } from 'common-util/graphql/queries';

const BASE_CHAIN_KEY = 'base';
const OLAS_ADDRESS_BASE = OLAS_TOKEN_ADDRESS_BY_CHAIN[BASE_CHAIN_KEY];

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

/**
 * Fetches the current OLAS price in USD using the OLAS-USDC Balancer pool on Base.
 *
 * Return value is the OLAS price in USD scaled by 1e18 (BigInt).
 */
export const fetchOlasPriceInUsdFromBalancer = async (): Promise<bigint | null> => {
  const client = BALANCER_GRAPH_CLIENTS.base;

  if (!client) {
    console.error('Balancer client for Base is not configured');
    return null;
  }

  if (!OLAS_ADDRESS_BASE) {
    console.error('OLAS token address for Base is not configured in constants');
    return null;
  }

  try {
    const data = (await client.request(
      balancerGetPoolQuery(BASE_BALANCER_OLAS_USDC_POOL_ID)
    )) as BalancerPoolResponse;

    const poolTokens = data.pool?.tokens || [];
    if (!poolTokens.length) {
      console.error('No tokens returned from Balancer pool for OLAS price');
      return null;
    }

    const olasToken = poolTokens.find(
      (token) => token.address.toLowerCase() === OLAS_ADDRESS_BASE.toLowerCase()
    );
    const otherToken = poolTokens.find(
      (token) => token.address.toLowerCase() !== OLAS_ADDRESS_BASE.toLowerCase()
    );

    if (!olasToken || !otherToken) {
      console.error('Could not identify OLAS and counterparty token in Balancer pool');
      return null;
    }

    const olasBalance = Number(olasToken.balance || 0);
    const counterpartyBalance = Number(otherToken.balance || 0);

    if (!Number.isFinite(olasBalance) || !Number.isFinite(counterpartyBalance)) {
      console.error('Invalid Balancer balances for OLAS price');
      return null;
    }

    if (olasBalance <= 0 || counterpartyBalance <= 0) {
      return null;
    }

    // For OLAS-USDC pool, counterparty token is effectively USD stable.
    const priceInUsd = counterpartyBalance / olasBalance;

    if (!Number.isFinite(priceInUsd) || priceInUsd <= 0) {
      return null;
    }

    const scaledPrice = BigInt(Math.floor(priceInUsd * 1e18));
    return scaledPrice;
  } catch (error) {
    console.error('Error fetching OLAS price from Balancer:', error);
    return null;
  }
};
