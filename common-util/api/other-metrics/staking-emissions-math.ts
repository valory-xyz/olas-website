/**
 * Pure helpers behind the four staking series on /olas-token, kept free of runtime
 * imports so `node --test` can load this file directly. Run with
 * `yarn staking-emissions-math:test`.
 *
 * Two truncation bugs have shipped from this path already, so the paging termination
 * and the epoch boundaries are pinned by tests rather than eyeballed.
 */

export const PAGE_SIZE = 1000;

export type EpochBoundary = { counter: number; blockTimestamp: string };
export type TimestampedAmount = { blockTimestamp: string; amount: bigint };
export type CumulativePoint = { timestamp: number; value: bigint };
export type PagedRow = { id: string } & Record<string, unknown>;
export type SubgraphMeta = { hasIndexingErrors?: boolean; block?: { number?: number } } | undefined;

/** Epoch `i` covers `(epochs[i - 1], epochs[i]]`. The last epoch is open, so it has no end. */
export const epochIndexFor = (timestamp: number, epochs: EpochBoundary[]): number => {
  for (let i = 0; i < epochs.length; i += 1) {
    const isLast = i === epochs.length - 1;
    const lower = i === 0 ? -Infinity : Number(epochs[i - 1].blockTimestamp);
    const upper = isLast ? Infinity : Number(epochs[i].blockTimestamp);
    if (timestamp > lower && timestamp <= upper) return i;
  }
  return -1;
};

export const bucketByEpoch = (
  events: TimestampedAmount[],
  epochs: EpochBoundary[]
): bigint[] => {
  const totals = epochs.map(() => BigInt(0));
  events.forEach(({ blockTimestamp, amount }) => {
    const index = epochIndexFor(Number(blockTimestamp), epochs);
    if (index >= 0) totals[index] += amount;
  });
  return totals;
};

/**
 * Cumulative daily series to per-epoch deltas. A day without activity has no snapshot,
 * so the last one is carried forward rather than read as a drop to zero.
 *
 * Daily granularity is coarser than the epoch boundaries: a snapshot is keyed to 00:00
 * but holds that day's closing total, so rewards earned later on a boundary day land in
 * the epoch that closed earlier that day. Worth at most a day's rewards per boundary,
 * and the reason a boundary epoch can briefly show claimable above dispensed.
 */
export const cumulativeToEpochDeltas = (
  daily: CumulativePoint[],
  epochs: EpochBoundary[]
): bigint[] => {
  const sorted = [...daily].sort((a, b) => a.timestamp - b.timestamp);
  const totalsAtEpochEnd = epochs.map((epoch, i) => {
    const cutoff = i === epochs.length - 1 ? Infinity : Number(epoch.blockTimestamp);
    let running = BigInt(0);
    for (const point of sorted) {
      if (point.timestamp > cutoff) break;
      running = point.value;
    }
    return running;
  });

  return totalsAtEpochEnd.map((total, i) => (i === 0 ? total : total - totalsAtEpochEnd[i - 1]));
};

export const sumSeries = (series: bigint[][], length: number): bigint[] =>
  series.reduce(
    (totals, deltas) => totals.map((total, i) => total + (deltas[i] ?? BigInt(0))),
    Array.from({ length }, () => BigInt(0))
  );

type GraphClient = { request: (query: string) => Promise<unknown> };

/**
 * Asks one subgraph for several cursor-paged sets in a single request, then re-requests
 * only the sets that came back full. One round trip unless something outgrew a page.
 */
export const pageSets = async (
  client: GraphClient,
  buildSets: (cursors: Record<string, string>) => string[],
  keys: string[],
  metaFields: string
): Promise<{ rows: Record<string, PagedRow[]>; meta: SubgraphMeta }> => {
  const cursors: Record<string, string> = Object.fromEntries(keys.map((key) => [key, '']));
  const rows: Record<string, PagedRow[]> = Object.fromEntries(keys.map((key) => [key, []]));
  const pending = new Set(keys);
  let meta: SubgraphMeta;

  while (pending.size > 0) {
    const requested = keys.filter((key) => pending.has(key));
    const sets = buildSets(cursors).filter((_, index) => pending.has(keys[index]));
    const data = (await client.request(`{ ${metaFields} ${sets.join('\n')} }`)) as Record<
      string,
      unknown
    >;
    meta = data._meta as SubgraphMeta;

    requested.forEach((key) => {
      const page = (data[key] as PagedRow[]) || [];
      rows[key].push(...page);
      if (page.length < PAGE_SIZE) {
        pending.delete(key);
      } else {
        cursors[key] = page[page.length - 1].id;
      }
    });
  }

  return { rows, meta };
};
