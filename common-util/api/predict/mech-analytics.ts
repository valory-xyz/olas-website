/**
 * mech-analytics client for the mech-request incremental fetch.
 *
 * Off-chain migration context: mech requests are moving off-chain,
 * which stops the marketplace subgraph from creating individual
 * `Request` / `ParsedRequest` entities for post-switch requests. The
 * blob-backed `additions[questionTitle][agentId] = [ts, ...]` map
 * built by `fetchIncrementalMechRequests` in `roi-distribution.ts`
 * relies on those entities for `question_title`, and it goes empty
 * for off-chain activity if we keep reading the subgraph.
 *
 * mech-analytics is the new public read path for that data. It reads
 * from the predict-api data lake (which continues to accumulate
 * off-chain requests via a private write path) and exposes
 * `/v1/data/scored-rows` — one row per scored mech request with
 * `requester`, `requested_at`, `question_title` on it. This module
 * pages that endpoint and returns rows in the same shape the caller
 * expects.
 *
 * Everything downstream of `fetchIncrementalMechRequests` (the
 * `openQmr` map, `normalizeTitle` matching, `settledMechRequests =
 * senderTotal - openRequestCount` computation in `fetchAllTimeAgents`)
 * stays exactly as-is — mech-analytics only replaces the subgraph
 * call inside `fetchIncrementalMechRequests`, nothing else.
 */

const MECH_ANALYTICS_URL = process.env.MECH_ANALYTICS_URL;
const CHAIN_ID_BY_KEY: Record<'gnosis' | 'polygon', number> = {
  gnosis: 100,
  polygon: 137,
};
const PAGE_SIZE = 5000; // matches the endpoint's DEFAULT_LIMIT

/** Shape returned by `/v1/data/scored-rows`. Only the fields the mech-request
 *  path uses are named — the endpoint returns more, and extras are ignored. */
type ScoredRow = {
  request_id: string;
  requester: string | null;
  requested_at: string; // ISO 8601, timezone-aware
  question_title: string | null;
  // ...plus fields the caller does not use (tool, platform, brier, etc.)
};

type ScoredRowsPage = {
  rows: ScoredRow[];
  next_cursor: string | null;
};

/**
 * Page mech-analytics for mech requests newer than `lastTimestamp`.
 *
 * Returns the same shape as the marketplace-subgraph path so the
 * downstream `fetchAllTimeAgents` needs no changes:
 *   { additions: {[title]: {[agentId]: [ts, ...]}}, lastTimestamp, ok }
 *
 * `lastTimestamp` is a unix-seconds cutoff (matching the existing
 * subgraph path's `blockTimestamp_gt`). Rows without a `requester`
 * or a `question_title` are skipped (mirrors `roi-distribution.ts:241`).
 *
 * If MECH_ANALYTICS_URL is not set, returns `ok=false` so the caller
 * can fall back to the subgraph path without partial data being merged.
 */
export const fetchIncrementalMechRequestsFromAnalytics = async (
  chain: 'gnosis' | 'polygon',
  lastTimestamp: number
): Promise<{
  additions: Record<string, Record<string, number[]>>;
  lastTimestamp: number;
  ok: boolean;
}> => {
  const additions: Record<string, Record<string, number[]>> = {};
  let latestTs = lastTimestamp;

  if (!MECH_ANALYTICS_URL) {
    console.error('MECH_ANALYTICS_URL not set — cannot fetch mech-requests from mech-analytics');
    return { additions, lastTimestamp: latestTs, ok: false };
  }

  const chainId = CHAIN_ID_BY_KEY[chain];
  // `since` is an ISO 8601 timestamp on the endpoint; convert from unix seconds.
  // Use `> lastTimestamp` semantics (the subgraph path uses `blockTimestamp_gt`)
  // by adding 1 second — the endpoint's `since` filter is `>=`.
  const since = new Date((lastTimestamp + 1) * 1000).toISOString();

  let cursor: string | null = null;
  while (true) {
    const url = new URL(`${MECH_ANALYTICS_URL.replace(/\/$/, '')}/v1/data/scored-rows`);
    url.searchParams.set('chain_id', String(chainId));
    url.searchParams.set('since', since);
    url.searchParams.set('limit', String(PAGE_SIZE));
    if (cursor) url.searchParams.set('cursor', cursor);

    let page: ScoredRowsPage;
    try {
      const response = await fetch(url.toString());
      if (!response.ok) {
        console.error(
          `mech-analytics /v1/data/scored-rows returned ${response.status} for ${chain}`
        );
        return { additions, lastTimestamp: latestTs, ok: false };
      }
      page = (await response.json()) as ScoredRowsPage;
    } catch (e) {
      console.error(`Error fetching mech-analytics scored-rows for ${chain}`, e);
      // Partial additions are safe to keep: latestTs only reflects rows actually
      // fetched, so the next run resumes from there. Report the failure so it
      // isn't invisible. Matches the subgraph path's error semantics.
      return { additions, lastTimestamp: latestTs, ok: false };
    }

    for (const row of page.rows) {
      const agentId = row.requester?.toLowerCase();
      const questionTitle = row.question_title;
      const ts = Math.floor(new Date(row.requested_at).getTime() / 1000);
      if (!agentId || !questionTitle || !Number.isFinite(ts) || ts <= 0) continue;
      if (!additions[questionTitle]) additions[questionTitle] = {};
      if (!additions[questionTitle][agentId]) additions[questionTitle][agentId] = [];
      additions[questionTitle][agentId].push(ts);
      if (ts > latestTs) latestTs = ts;
    }

    if (!page.next_cursor) break;
    cursor = page.next_cursor;
  }

  return { additions, lastTimestamp: latestTs, ok: true };
};
