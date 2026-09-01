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

// Booked mech fees below this share of settled costs mean QMR attribution is
// broken. Healthy weeks run 200–600bps; the 2026-08 Polystrat incident ran
// ~16bps (derivation: docs/predict-roi-accounting.md, Observability).
export const MIN_MECH_FEE_BPS = 50n;

/**
 * True when booked mech fees are implausibly low relative to settled trading
 * costs (both 1e18-scaled). A ratio, not a zero check — a broken QMR feed
 * books a trickle, not a clean zero.
 */
export const isLowMechAttribution = (totals: {
  mechRequests: number;
  settledCosts: bigint;
  mechFeeWei: bigint;
}): boolean => {
  const mechFees = BigInt(totals.mechRequests) * totals.mechFeeWei;
  return totals.settledCosts > 0n && mechFees * 10000n < totals.settledCosts * MIN_MECH_FEE_BPS;
};

/**
 * Merges freshly fetched QMR additions into the existing open set (mutates
 * `existing`, returns it with the number of timestamps actually added). Pass
 * `dedupeTimestamps: true` for a rebuild, whose fetched window overlaps
 * requests the set already holds: the dedupe is count-aware per (title, agent,
 * timestamp) — each stored copy of a timestamp absorbs one incoming copy, so
 * the merged list keeps max(stored, incoming) same-second requests, never
 * fewer. Incremental runs pass false — their rows are deduplicated by request
 * id upstream, and two distinct same-second requests must both count.
 */
export const mergeQmr = (
  existing: QmrMap,
  additions: QmrMap,
  dedupeTimestamps: boolean
): { merged: QmrMap; added: number } => {
  let added = 0;
  for (const [title, agentLists] of Object.entries(additions)) {
    if (!existing[title]) existing[title] = {};
    for (const [agentId, tsList] of Object.entries(agentLists)) {
      const current = existing[title][agentId] ?? [];
      let incoming = tsList;
      if (dedupeTimestamps) {
        const held = new Map<number, number>();
        for (const ts of current) held.set(ts, (held.get(ts) ?? 0) + 1);
        incoming = tsList.filter((ts) => {
          const left = held.get(ts) ?? 0;
          if (left === 0) return true;
          held.set(ts, left - 1);
          return false;
        });
      }
      added += incoming.length;
      existing[title][agentId] = [...current, ...incoming].sort((a, b) => a - b);
    }
  }
  return { merged: existing, added };
};
