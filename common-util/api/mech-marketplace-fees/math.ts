import { formatUnits } from 'viem';

// Pure helpers behind "fees collected"; covered by math.test.mjs.

export type DrainedTotals = { raw: bigint; usd: number };

export type DrainTotalsRow = { id: string; totalDrainedRaw: string; totalDrainedUSD: string };

export type TrackerFees = {
  // Lifetime amount in the tracker's token (un-drained + drained) and its USD value.
  amount: number;
  usd: number;
};

// Above this the sum is a decimals or price bug, not fees.
export const MAX_MARKETPLACE_FEES_USD = 100_000_000;

// Subgraph BigDecimal of a raw token amount, e.g. "1575" or "1575.0".
export const parseRawUnits = (raw: string): bigint => BigInt(raw.split('.')[0] || '0');

export const toDrainedByModel = (
  rows: DrainTotalsRow[] | null | undefined
): Record<string, DrainedTotals> =>
  Object.fromEntries(
    (rows ?? []).map((row) => [
      row.id,
      { raw: parseRawUnits(row.totalDrainedRaw), usd: Number(row.totalDrainedUSD) },
    ])
  );

export const trackerFees = (
  collected: bigint,
  decimals: number,
  priceUsd: number,
  drained: DrainedTotals = { raw: 0n, usd: 0 }
): TrackerFees => ({
  amount: Number(formatUnits(collected + drained.raw, decimals)),
  usd: Number(formatUnits(collected, decimals)) * priceUsd + drained.usd,
});

export const isSaneFeesUsd = (usd: number): boolean =>
  Number.isFinite(usd) && usd >= 0 && usd <= MAX_MARKETPLACE_FEES_USD;

// Per-token lifetime amounts can only grow (un-drained + drained, price-independent), so a
// drop means a source under-reported. Returns the first token that fell, else null.
export const findDecreasedToken = (
  previous: Record<string, number> | null | undefined,
  next: Record<string, number>
): string | null => {
  for (const [token, before] of Object.entries(previous ?? {})) {
    const after = next[token];
    if (typeof after === 'number' && after < before * (1 - 1e-9)) return token;
  }
  return null;
};
