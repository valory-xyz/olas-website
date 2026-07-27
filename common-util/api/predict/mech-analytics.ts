/**
 * Client for the mech-analytics `/v1/data/scored-rows` endpoint.
 * It replaces the per-request reads from the marketplace subgraph,
 * because the subgraph has no data for off-chain requests.
 * Full details: docs/mech-analytics-migration.md
 */

/** One switch that turns on all mech-analytics read paths. */
export const USE_MECH_ANALYTICS = process.env.USE_MECH_ANALYTICS === 'true';

const PAGE_SIZE = 5000; // endpoint max limit

export const MECH_ANALYTICS_CHAIN_IDS: Record<'gnosis' | 'polygon', number> = {
  gnosis: 100,
  polygon: 137,
};

/** Same value as QMR_MAX_AGE_DAYS in roi-distribution.ts. Older requests cannot be open anymore. */
const QMR_WINDOW_SECONDS = 14 * 86400;

/** Fields we use from `/v1/data/scored-rows` rows. Other fields are ignored. */
export type ScoredRow = {
  request_id: string;
  requester: string | null;
  requested_at: string; // ISO 8601, tz-aware
  question_title: string | null;
  tool: string | null;
  resolution_status: string;
  computed_at: string; // ISO 8601, tz-aware
};

type ScoredRowsPage = {
  rows: ScoredRow[];
  next_cursor: string | null;
};

/** Loads scored rows page by page until next_cursor is null. Throws an error if any request fails. */
export async function* iterateScoredRows(
  searchParams: Record<string, string>
): AsyncGenerator<ScoredRow[]> {
  const base = process.env.MECH_ANALYTICS_URL;
  if (!base) {
    throw new Error('MECH_ANALYTICS_URL not set — cannot fetch mech-analytics scored rows');
  }

  let cursor: string | null = null;
  while (true) {
    const url = new URL(`${base.replace(/\/$/, '')}/v1/data/scored-rows`);
    for (const [key, value] of Object.entries(searchParams)) {
      url.searchParams.set(key, value);
    }
    if (cursor) url.searchParams.set('cursor', cursor);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`mech-analytics /v1/data/scored-rows returned ${response.status}`);
    }
    const page = (await response.json()) as ScoredRowsPage;
    yield page.rows ?? [];

    if (!page.next_cursor) break;
    cursor = page.next_cursor;
  }
}

export type AnalyticsQmrUpdate = {
  additions: Record<string, Record<string, number[]>>;
  /** When true, the caller must drop the existing QMR map: `additions` holds the complete open set. */
  rebuild: boolean;
  /** New computed_at watermark to save. Null when a rebuild failed — save nothing then. */
  lastComputedAt: string | null;
  /** Ids of rows we already processed (request_id → requested_at, unix seconds). */
  ingestedRequestIds: Record<string, number>;
  /** Highest requested_at we saved. Stored as lastMechRequestTimestamp so a rollback to the subgraph path can continue from it. */
  lastTimestamp: number;
  ok: boolean;
};

/**
 * Fetches mech requests for the QMR blob.
 * The first flag-on run rebuilds the whole open set (`resolved=false`).
 * Later runs fetch only rows scored after the watermark (`since_computed_at`)
 * and skip request ids we already have — the API sends a row again every
 * time its resolution updates, so ids are the only safe way to avoid
 * counting a row twice.
 */
export const fetchMechRequestsFromAnalytics = async (
  chain: 'gnosis' | 'polygon',
  lastComputedAt: string | undefined,
  previousIngestedIds: Record<string, number> | undefined,
  previousLastTimestamp: number
): Promise<AnalyticsQmrUpdate> => {
  const nowSec = Math.floor(Date.now() / 1000);
  const windowStartSec = nowSec - QMR_WINDOW_SECONDS;
  const isRebuild = !lastComputedAt;
  // Taken before fetching. After a successful rebuild it becomes the
  // watermark, so the next run also sees rows scored while we were fetching.
  const runStart = new Date().toISOString();

  const additions: Record<string, Record<string, number[]>> = {};
  const ingestedRequestIds: Record<string, number> = isRebuild
    ? {}
    : { ...(previousIngestedIds ?? {}) };
  let lastTimestamp = previousLastTimestamp;
  // Updated row by row. If a page fails, the saved watermark covers only the
  // rows we processed; the next run fetches the boundary again and the id
  // ledger skips the duplicates.
  let maxComputedAt = lastComputedAt ?? null;
  let ok = true;

  const params: Record<string, string> = {
    chain_id: String(MECH_ANALYTICS_CHAIN_IDS[chain]),
    since: new Date(windowStartSec * 1000).toISOString(),
    limit: String(PAGE_SIZE),
  };
  if (isRebuild) {
    params.resolved = 'false';
  } else {
    params.since_computed_at = lastComputedAt as string;
  }

  try {
    for await (const rows of iterateScoredRows(params)) {
      for (const row of rows) {
        if (row.computed_at && (!maxComputedAt || row.computed_at > maxComputedAt)) {
          maxComputedAt = row.computed_at;
        }

        if (ingestedRequestIds[row.request_id] !== undefined) continue; // already processed
        const ts = Math.floor(Date.parse(row.requested_at) / 1000);
        if (!Number.isFinite(ts) || ts <= 0 || ts < windowStartSec) continue;

        if (isRebuild && row.resolution_status === 'invalid') {
          ingestedRequestIds[row.request_id] = ts; // remember the id so we skip this row later
          continue;
        }

        const agentId = row.requester?.toLowerCase();
        const questionTitle = row.question_title;
        if (!agentId || !questionTitle) continue;

        if (!additions[questionTitle]) additions[questionTitle] = {};
        if (!additions[questionTitle][agentId]) additions[questionTitle][agentId] = [];
        additions[questionTitle][agentId].push(ts);
        ingestedRequestIds[row.request_id] = ts;
        if (ts > lastTimestamp) lastTimestamp = ts;
      }
    }
  } catch (e) {
    console.error(`Error fetching mech-analytics scored rows for ${chain}`, e);
    ok = false;
  }

  if (isRebuild && !ok) {
    // An incomplete rebuild would give us only part of the open set.
    // Save nothing and try again on the next run.
    return {
      additions: {},
      rebuild: false,
      lastComputedAt: null,
      ingestedRequestIds: previousIngestedIds ?? {},
      lastTimestamp: previousLastTimestamp,
      ok: false,
    };
  }

  for (const [id, ts] of Object.entries(ingestedRequestIds)) {
    if (ts < windowStartSec) delete ingestedRequestIds[id];
  }

  console.log(
    `[mech-analytics:${chain}] ${isRebuild ? 'rebuild' : 'incremental'} ok=${ok} ` +
      `ingestedIds=${Object.keys(ingestedRequestIds).length}`
  );

  return {
    additions,
    rebuild: isRebuild,
    lastComputedAt: isRebuild ? runStart : maxComputedAt,
    ingestedRequestIds,
    lastTimestamp,
    ok,
  };
};

/**
 * Loads all scored rows for one requester made after the given time
 * (unix seconds). Keeps no state between runs.
 * `since` filters on requested_at; +1 second turns ">=" into ">".
 */
export const fetchScoredRowsForRequester = async (
  chain: 'gnosis' | 'polygon',
  requester: string,
  timestampGt: number,
  pageSize: number,
  maxPages: number
): Promise<ScoredRow[]> => {
  const rows: ScoredRow[] = [];
  let pages = 0;
  const params: Record<string, string> = {
    chain_id: String(MECH_ANALYTICS_CHAIN_IDS[chain]),
    requester,
    since: new Date((timestampGt + 1) * 1000).toISOString(),
    limit: String(pageSize),
  };
  for await (const page of iterateScoredRows(params)) {
    rows.push(...page);
    if (++pages >= maxPages) break;
  }
  return rows;
};
