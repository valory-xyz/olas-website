// Pure helpers behind the Mech request totals; covered by mech-requests-math.test.mjs.

export type ChainRequestCounts = {
  totalRequests: number;
  totalDeliveries: number;
  // Sum of `Sender.totalOffChainRequests`, read at the same block as the globals.
  senderOffChain: number;
  // Sum of `numDeliveries` over signed-delivery event rows, read at the same block.
  offChain: number;
};

export type ChainRequestSplit = {
  onChainRequests: number;
  onChainDeliveries: number;
  offChain: number;
};

/**
 * Splits one chain's globals into on-chain counts and settled off-chain requests.
 *
 * The signed-delivery handler adds the same `numDeliveries` to the requester's
 * `totalOffChainRequests` and to both globals in one run, so `senderOffChain` is exactly
 * the off-chain part of the globals however many times the handler ran per event.
 * Removing it leaves the on-chain counts. Event rows are stored once per event, so their
 * sum is the off-chain count. An off-chain request is only visible once settled, which
 * makes it both a request and a delivery.
 */
export const splitChainRequests = ({
  totalRequests,
  totalDeliveries,
  senderOffChain,
  offChain,
}: ChainRequestCounts): ChainRequestSplit => {
  const onChainRequests = totalRequests - senderOffChain;
  const onChainDeliveries = totalDeliveries - senderOffChain;
  if (onChainRequests < 0 || onChainDeliveries < 0) {
    throw new Error(
      `off-chain sender total ${senderOffChain} exceeds the globals (${totalRequests} requests, ${totalDeliveries} deliveries)`
    );
  }
  return { onChainRequests, onChainDeliveries, offChain };
};

// Subgraph BigInt fields arrive as strings; anything that is not a non-negative safe
// integer is a schema or transport fault, not a count.
export const parseCount = (raw: string | number): number => {
  const value = typeof raw === 'string' && raw.trim() !== '' ? Number(raw) : raw;
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) {
    throw new Error(`not a count: ${String(raw)}`);
  }
  return value;
};

// Percentage of requests settled off-chain, or null when there is nothing to divide.
export const offChainSharePercent = (
  offChain: number | null | undefined,
  onChain: number | null | undefined
): number | null => {
  if (typeof offChain !== 'number' || typeof onChain !== 'number') return null;
  const total = offChain + onChain;
  if (total <= 0) return null;
  return (offChain / total) * 100;
};
