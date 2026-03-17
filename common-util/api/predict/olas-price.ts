import { GNOSIS_BALANCER_OLAS_WXDAI_POOL_ID } from 'common-util/constants';
import { BALANCER_GRAPH_CLIENTS } from 'common-util/graphql/client';
import { balancerGetPoolQuery } from 'common-util/graphql/queries';

const GNOSIS_OLAS_TOKEN_ADDRESS = '0xcE11e14225575945b8E6Dc0D4F2dD4C570f79d9f';

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
 * Fetches the current OLAS price in USD for Predict ROI.
 * - Omenstrat (Gnosis): uses Gnosis Balancer OLAS-WXDAI (WXDAI ≈ 1 USD).
 * - Polystrat (Polygon): no OLAS/USD pool on Polygon, so uses the same Gnosis oracle.
 * Return value is the OLAS price in USD scaled by 1e18 (BigInt).
 */
export const fetchOlasPriceInUsd = async (chain: 'gnosis' | 'polygon'): Promise<bigint | null> => {
  const client = BALANCER_GRAPH_CLIENTS.gnosis;

  if (!client) {
    console.error('Balancer client for Gnosis is not configured');
    return null;
  }

  const olasAddress = GNOSIS_OLAS_TOKEN_ADDRESS;

  try {
    const data = (await client.request(
      balancerGetPoolQuery(GNOSIS_BALANCER_OLAS_WXDAI_POOL_ID)
    )) as BalancerPoolResponse;

    const poolTokens = data.pool?.tokens || [];
    if (!poolTokens.length) {
      console.error('No tokens returned from Balancer pool for OLAS price');
      return null;
    }

    const olasToken = poolTokens.find(
      (token) => token.address.toLowerCase() === olasAddress.toLowerCase()
    );
    const usdcToken = poolTokens.find(
      (token) => token.address.toLowerCase() !== olasAddress.toLowerCase()
    );

    if (!olasToken || !usdcToken) {
      console.error('Could not identify OLAS and USD-stable token in Balancer pool');
      return null;
    }

    const olasBalance = Number(olasToken.balance || 0);
    const usdcBalance = Number(usdcToken.balance || 0);

    if (!Number.isFinite(olasBalance) || !Number.isFinite(usdcBalance)) {
      console.error('Invalid Balancer balances for OLAS price');
      return null;
    }

    if (olasBalance <= 0 || usdcBalance <= 0) {
      return null;
    }

    const priceInUsd = usdcBalance / olasBalance;
    const scaledPrice = BigInt(Math.floor(priceInUsd * 1e18));
    return scaledPrice;
  } catch (error) {
    console.error(`Error fetching OLAS price from Balancer (${chain}):`, error);
    return null;
  }
};
