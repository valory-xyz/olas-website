/**
 * Pure ROI accounting helpers for the predict economy pages.
 *
 * Accounting rules (spec: docs/predict-roi-accounting.md):
 * - Accrual basis: payouts count at market resolution (`totalExpectedPayout`,
 *   `dailyProfit`). Redemption-day fields (`totalPayout`) never enter ROI.
 * - Mech requests are counted once, via `totalLegacyRequests`.
 */

/** QMR open set: market title → agentId → ascending request timestamps. */
export type QmrMap = Record<string, Record<string, number[]>>;

/** netGain / totalCosts as a percentage with 2-decimal precision. */
export const roiPercent = (netGain: bigint, totalCosts: bigint): number =>
  Number((netGain * 10000n) / totalCosts) / 100;

/**
 * All-time (Max window) per-agent net gain and cost base.
 * `payout` is the expected payout at resolution, already 1e18-scaled.
 */
export const allTimeNetGainAndCosts = (entry: {
  payout: bigint;
  tradingCosts: bigint;
  mechRequests: number;
  mechFeeWei: bigint;
}): { netGain: bigint; totalCosts: bigint } => {
  const mechFees = BigInt(entry.mechRequests) * entry.mechFeeWei;
  const totalCosts = entry.tradingCosts + mechFees;
  return { netGain: entry.payout - totalCosts, totalCosts };
};

/**
 * Windowed (7/30/90D) per-agent net gain and cost base from settlement-day sums.
 * `scale` lifts values to 1e18: polystrat USDC 1e6 → 1e12, omenstrat → 1n.
 * `feesSettled` is 0 for polystrat (no per-trade fees on Polymarket).
 */
export const windowedNetGainAndCosts = (totals: {
  profit: bigint;
  tradedSettled: bigint;
  feesSettled: bigint;
  mechRequests: number;
  scale: bigint;
  mechFeeWei: bigint;
}): { netGain: bigint; totalCosts: bigint } => {
  const tradingCosts = (totals.tradedSettled + totals.feesSettled) * totals.scale;
  const mechFees = BigInt(totals.mechRequests) * totals.mechFeeWei;
  return {
    netGain: totals.profit * totals.scale - mechFees,
    totalCosts: tradingCosts + mechFees,
  };
};

/**
 * Lifetime mech-request count for one marketplace sender.
 * `totalLegacyRequests` counts every request kind (legacy, marketplace,
 * off-chain), so it is the complete count. `totalMarketplaceRequests` is a
 * subset of it — never add the two.
 */
export const senderLifetimeRequests = (sender: { totalLegacyRequests: string }): number =>
  Number(sender.totalLegacyRequests);

/**
 * Merges freshly fetched QMR additions into the existing open set (mutates and
 * returns `existing`). Pass `dedupeTimestamps: true` for a rebuild, whose
 * fetched window overlaps requests the set already holds: a (title, agent,
 * timestamp) triple already stored is not added again. Incremental runs pass
 * false — their rows are deduplicated by request id upstream, and two distinct
 * same-second requests must both count.
 */
export const mergeQmr = (
  existing: QmrMap,
  additions: QmrMap,
  dedupeTimestamps: boolean
): QmrMap => {
  for (const [title, agentLists] of Object.entries(additions)) {
    if (!existing[title]) existing[title] = {};
    for (const [agentId, tsList] of Object.entries(agentLists)) {
      const current = existing[title][agentId] ?? [];
      const incoming = dedupeTimestamps ? tsList.filter((ts) => !current.includes(ts)) : tsList;
      existing[title][agentId] = [...current, ...incoming].sort((a, b) => a - b);
    }
  }
  return existing;
};
