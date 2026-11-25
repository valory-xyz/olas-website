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

// ─── Per-request mech charge ──────────────────────────────────────────────────

/** 0.01, 18-dec: a request with no known charge. = `DEFAULT_MECH_FEE` (constants.ts, not importable here). */
export const DEFAULT_MECH_FEE_WEI = 10n ** 16n;

/** Never-delivered requests: 0.01 as before. The one switch: 0n = mech-analytics' requester rule. */
export const UNDELIVERED_MECH_FEE_WEI = DEFAULT_MECH_FEE_WEI;

const USD_DECIMAL = /^\d+(\.\d+)?$/;

/** Exact USD decimal string ("0.0118") → 18-dec bigint, truncating past 18 decimals; else null. */
export const usdToWei = (value: unknown): bigint | null => {
  const text = typeof value === 'number' ? String(value) : value;
  if (typeof text !== 'string' || !USD_DECIMAL.test(text)) return null;
  const [whole, fraction = ''] = text.split('.');
  return BigInt(whole) * 10n ** 18n + BigInt(fraction.slice(0, 18).padEnd(18, '0'));
};

/** One scored row's cost, 18-dec: undelivered rule, else `charge_usd`, else 0.01. Same rule as KPIs. */
export const mechChargeWei = (row: {
  delivered_at?: string | null;
  charge_usd?: string | number | null;
}): bigint => {
  if (!row.delivered_at) return UNDELIVERED_MECH_FEE_WEI;
  return usdToWei(row.charge_usd) ?? DEFAULT_MECH_FEE_WEI;
};

/** Mech cost of a stored day entry; entries without `mechFeesWei` (older days) book count × 0.01. */
export const entryMechFeesWei = (entry: { mechRequests: number; mechFeesWei?: string }): bigint =>
  entry.mechFeesWei !== undefined
    ? BigInt(entry.mechFeesWei)
    : BigInt(entry.mechRequests) * DEFAULT_MECH_FEE_WEI;

/** Books `count` requests costing `feesWei` in total onto a day entry (mutates it). */
export const addMechRequests = (
  entry: { mechRequests: number; mechFeesWei?: string },
  count: number,
  feesWei: bigint
): void => {
  const total = entryMechFeesWei(entry) + feesWei;
  entry.mechRequests += count;
  if (total === BigInt(entry.mechRequests) * DEFAULT_MECH_FEE_WEI) delete entry.mechFeesWei;
  else entry.mechFeesWei = total.toString();
};

/**
 * Non-0.01 charges of open QMR requests: title → agentId → timestamp → wei strings, one per
 * request (a sub-multiset of the QmrMap timestamps). Unlisted requests and older blobs book 0.01.
 */
export type QmrChargeMap = Record<string, Record<string, Record<string, string[]>>>;

/** Records one ingested request's charge (only when it is not 0.01). */
export const recordCharge = (
  charges: QmrChargeMap,
  title: string,
  agentId: string,
  ts: number,
  feeWei: bigint
): void => {
  if (feeWei === DEFAULT_MECH_FEE_WEI) return;
  charges[title] ??= {};
  charges[title][agentId] ??= {};
  (charges[title][agentId][String(ts)] ??= []).push(feeWei.toString());
};

/** Removes and returns one open request's charge (0.01 if none). Call for every request leaving QMR. */
export const popCharge = (
  charges: QmrChargeMap,
  title: string,
  agentId: string,
  ts: number
): bigint => {
  const byTs = charges[title]?.[agentId];
  const list = byTs?.[String(ts)];
  if (!byTs || !list || list.length === 0) return DEFAULT_MECH_FEE_WEI;
  const fee = BigInt(list.shift() as string);
  if (list.length === 0) delete byTs[String(ts)];
  if (Object.keys(byTs).length === 0) delete charges[title][agentId];
  if (Object.keys(charges[title]).length === 0) delete charges[title];
  return fee;
};

/** Merges ingested charges (mutates `existing`): rebuild keeps the longer list per ts, like `mergeQmr`. */
export const mergeQmrCharges = (
  existing: QmrChargeMap,
  additions: QmrChargeMap,
  dedupeTimestamps: boolean
): QmrChargeMap => {
  for (const [title, agents] of Object.entries(additions)) {
    for (const [agentId, byTs] of Object.entries(agents)) {
      for (const [ts, fees] of Object.entries(byTs)) {
        existing[title] ??= {};
        existing[title][agentId] ??= {};
        const held = existing[title][agentId][ts] ?? [];
        if (!dedupeTimestamps) existing[title][agentId][ts] = [...held, ...fees];
        else if (fees.length > held.length) existing[title][agentId][ts] = [...fees];
      }
    }
  }
  return existing;
};

/** Title match key: lower-case alphanumerics, 100-char prefix (handles truncation/punctuation). */
export const normalizeTitle = (title: string): string =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 100);

/**
 * Consumes the open QMR entries for every market this agent's stat settled, and returns
 * how many requests that booked onto the settlement day and their summed real charges
 * (product intent: all market costs are grouped on the day the market settles, not on
 * the day the request was made). Shared by the daily run and the history backfill so
 * both match titles the same way.
 */
export const consumeSettledRequests = (
  qmr: QmrMap,
  charges: QmrChargeMap,
  normalizedQmrMap: Map<string, string>,
  stat: { profitParticipants?: Array<{ question?: string; metadata?: { title: string } }> },
  agentId: string,
  keysUsed: Set<string>
): { count: number; feesWei: bigint } => {
  // Unique titles from the predict subgraph
  const uniqueTitles = new Set<string>();
  for (const p of stat.profitParticipants ?? []) {
    const title = p.question ?? p.metadata?.title;
    if (title) uniqueTitles.add(title);
  }

  let mechRequests = 0;
  let feesWei = 0n;
  for (const title of uniqueTitles) {
    let matchedKey = qmr[title] ? title : null;
    if (!matchedKey) {
      matchedKey = normalizedQmrMap.get(normalizeTitle(title)) ?? null;
    }
    const tsList = matchedKey ? qmr[matchedKey]?.[agentId] : null;
    if (matchedKey && tsList && tsList.length > 0) {
      mechRequests += tsList.length;
      for (const ts of tsList) feesWei += popCharge(charges, matchedKey, agentId, ts);
      qmr[matchedKey][agentId] = [];
      keysUsed.add(matchedKey);
    }
  }
  return { count: mechRequests, feesWei };
};

export type WindowTotals = {
  profit: bigint;
  payout: bigint;
  mechFeesWei: bigint;
  tradedSettled: bigint;
  feesSettled: bigint; // omenstrat only — 0n for polystrat
};

/** Adds one stored day's agent entries to the per-agent window totals (mutates `totals`). */
export const addDayToWindow = (
  totals: Map<string, WindowTotals>,
  agents: Record<
    string,
    {
      profit: string;
      payout: string;
      mechRequests: number;
      mechFeesWei?: string;
      tradedSettled?: string;
      feesSettled?: string;
    }
  >
): void => {
  for (const [agentId, entry] of Object.entries(agents)) {
    const prev: WindowTotals = totals.get(agentId) ?? {
      profit: 0n,
      payout: 0n,
      mechFeesWei: 0n,
      tradedSettled: 0n,
      feesSettled: 0n,
    };
    prev.profit += BigInt(entry.profit);
    prev.payout += BigInt(entry.payout);
    // Real charges where stored; count × 0.01 for days stored before them.
    prev.mechFeesWei += entryMechFeesWei(entry);
    if (entry.tradedSettled) prev.tradedSettled += BigInt(entry.tradedSettled);
    if (entry.feesSettled) prev.feesSettled += BigInt(entry.feesSettled);
    totals.set(agentId, prev);
  }
};

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
  scale: bigint;
  /** Booked mech cost over the window, 18-dec (sum of `entryMechFeesWei`). */
  mechFeesWei: bigint;
}): { netGain: bigint; totalCosts: bigint } => {
  const tradingCosts = (totals.tradedSettled + totals.feesSettled) * totals.scale;
  const mechFees = totals.mechFeesWei;
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
