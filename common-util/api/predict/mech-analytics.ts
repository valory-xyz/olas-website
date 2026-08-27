import { QMR_MAX_AGE_DAYS } from 'common-util/constants';

/**
 * Client for the mech-analytics `/v1/data/scored-rows` endpoint.
 * It replaces the per-request reads from the marketplace subgraph,
 * because the subgraph has no data for off-chain requests.
 * Full details: docs/mech-analytics-migration.md
 */

/** One switch that turns on all mech-analytics read paths. Default ON
 * after the mech-analytics cutover (undelivered rows admitted as shell
 * shape in mech-analytics PR #36 + placeholder repair against the
 * marketplace subgraph). Two knobs turn it back off:
 *   * ``USE_MECH_ANALYTICS=false`` (case-insensitive) — the operator
 *     rollback lever during an incident; case-insensitive so a typo
 *     under pressure (``FALSE`` / ``False``) still rolls back.
 *   * ``MECH_ANALYTICS_URL`` unset — automatic fallback for previews
 *     and local dev that never wired the API URL, so a missing
 *     endpoint doesn't 500 refresh runs on every reload. Prod always
 *     has the URL set; this only affects environments that don't. */
const rawFlag = process.env.USE_MECH_ANALYTICS ?? '';
export const USE_MECH_ANALYTICS =
  rawFlag.toLowerCase() !== 'false' && !!process.env.MECH_ANALYTICS_URL;

const PAGE_SIZE = 5000; // endpoint max limit

export const MECH_ANALYTICS_CHAIN_IDS = {
  gnosis: 100,
  polygon: 137,
} as const;

export type MechAnalyticsChain = keyof typeof MECH_ANALYTICS_CHAIN_IDS;

/** Requests older than this window cannot be open anymore. */
const QMR_WINDOW_SECONDS = QMR_MAX_AGE_DAYS * 86400;

/** Converts an ISO 8601 string to unix seconds. Returns NaN for a bad input. */
export const isoToUnixSec = (iso: string): number => Math.floor(Date.parse(iso) / 1000);

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

  const url = new URL(`${base.replace(/\/$/, '')}/v1/data/scored-rows`);
  for (const [key, value] of Object.entries(searchParams)) {
    url.searchParams.set(key, value);
  }

  let cursor: string | null = null;
  while (true) {
    if (cursor) url.searchParams.set('cursor', cursor);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`mech-analytics /v1/data/scored-rows returned ${response.status}`);
    }
    const page = (await response.json()) as ScoredRowsPage;
    // A 200 without a rows array is a broken response, not an empty page.
    if (!Array.isArray(page.rows)) {
      throw new Error('mech-analytics /v1/data/scored-rows returned no rows array');
    }
    yield page.rows;

    if (!page.next_cursor) break;
    // A truthy non-string cursor is a broken response, same as a missing rows array.
    if (typeof page.next_cursor !== 'string') {
      throw new Error('mech-analytics /v1/data/scored-rows returned a non-string next_cursor');
    }
    cursor = page.next_cursor;
  }
}

type QmrFetchData = {
  additions: Record<string, Record<string, number[]>>;
  /** New computed_at watermark to save. */
  lastComputedAt: string;
  /** Ids of rows we already processed (request_id → requested_at, unix seconds). */
  ingestedRequestIds: Record<string, number>;
  /** Highest requested_at we saved. Stored as lastMechRequestTimestamp so a rollback to the subgraph path can continue from it. */
  lastTimestamp: number;
};

/**
 * Result of a mech-analytics QMR fetch.
 * `null` = a rebuild failed or returned no rows at all. Save nothing; the
 * next run retries the rebuild.
 * `kind: 'rebuild'` = the caller must drop the existing QMR map: `additions`
 * holds the complete open set.
 * `kind: 'incremental', ok: false` = a page failed. The result can still be
 * saved: the next run fetches the missed rows again, and `ingestedRequestIds`
 * filters out the rows we already have.
 * More: docs/mech-analytics-migration.md
 */
export type AnalyticsQmrUpdate =
  | (QmrFetchData & { kind: 'rebuild' })
  | (QmrFetchData & { kind: 'incremental'; ok: boolean });

/**
 * Fetches mech requests for the QMR blob.
 * The first flag-on run rebuilds the whole open set (`resolved=false`).
 * Later runs fetch only rows scored after the watermark (`since_computed_at`)
 * and skip request ids we already have — the API sends a row again every
 * time its resolution updates, so ids are the only safe way to avoid
 * counting a row twice.
 */
export const fetchMechRequestsFromAnalytics = async (
  chain: MechAnalyticsChain,
  lastComputedAt: string | undefined,
  previousIngestedIds: Record<string, number> | undefined,
  previousLastTimestamp: number
): Promise<AnalyticsQmrUpdate | null> => {
  const nowSec = Math.floor(Date.now() / 1000);
  const windowStartSec = nowSec - QMR_WINDOW_SECONDS;
  // A watermark that does not parse would make the endpoint reject every run.
  const hasValidWatermark =
    Boolean(lastComputedAt) && !Number.isNaN(Date.parse(lastComputedAt as string));
  if (lastComputedAt && !hasValidWatermark) {
    console.warn(`[mech-analytics:${chain}] invalid watermark "${lastComputedAt}" — rebuilding`);
  }
  const isRebuild = !hasValidWatermark;
  // Taken before fetching. After a successful rebuild it becomes the
  // watermark, so the next run also sees rows scored while we were fetching.
  const runStart = new Date().toISOString();

  const additions: Record<string, Record<string, number[]>> = {};
  const ingestedRequestIds: Record<string, number> = isRebuild
    ? {}
    : { ...(previousIngestedIds ?? {}) };
  let lastTimestamp = previousLastTimestamp;
  // Updated row by row, before the skip checks below. This order is safe only
  // because `ingestedRequestIds` is always checked before a row is ingested —
  // the next run re-reads the boundary and the map removes the duplicates.
  let maxComputedAt = isRebuild ? null : (lastComputedAt as string);
  let ok = true;
  let rowsSeen = 0;
  const skips = { duplicate: 0, outOfWindow: 0, invalid: 0, missingKey: 0 };

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
      rowsSeen += rows.length;
      for (const row of rows) {
        // A malformed computed_at must not become the saved watermark.
        if (
          row.computed_at &&
          !Number.isNaN(Date.parse(row.computed_at)) &&
          (!maxComputedAt || row.computed_at > maxComputedAt)
        ) {
          maxComputedAt = row.computed_at;
        }

        if (ingestedRequestIds[row.request_id] !== undefined) {
          skips.duplicate++;
          continue;
        }
        const ts = isoToUnixSec(row.requested_at);
        if (!Number.isFinite(ts) || ts <= 0 || ts < windowStartSec) {
          skips.outOfWindow++;
          continue;
        }

        if (row.resolution_status === 'invalid') {
          ingestedRequestIds[row.request_id] = ts; // remember the id so we skip this row later
          skips.invalid++;
          continue;
        }

        const agentId = row.requester?.toLowerCase();
        const questionTitle = row.question_title;
        if (!agentId || !questionTitle) {
          skips.missingKey++;
          continue;
        }

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
    return null;
  }

  if (isRebuild && rowsSeen === 0) {
    // Zero rows can mean the endpoint is still catching up (or a wrong
    // chain filter). Wiping the open set on that would inflate
    // settledMechRequests, so treat it like a failed rebuild.
    console.error(`[mech-analytics:${chain}] rebuild returned zero rows — keeping the old QMR`);
    return null;
  }

  for (const [id, ts] of Object.entries(ingestedRequestIds)) {
    if (ts < windowStartSec) delete ingestedRequestIds[id];
  }

  console.log(
    `[mech-analytics:${chain}] ${isRebuild ? 'rebuild' : 'incremental'} ok=${ok} ` +
      `ingestedIds=${Object.keys(ingestedRequestIds).length} ` +
      `skipped: dup=${skips.duplicate} old=${skips.outOfWindow} ` +
      `invalid=${skips.invalid} noKey=${skips.missingKey}`
  );

  const data: QmrFetchData = {
    additions,
    lastComputedAt: isRebuild ? runStart : (maxComputedAt as string),
    ingestedRequestIds,
    lastTimestamp,
  };
  return isRebuild ? { kind: 'rebuild', ...data } : { kind: 'incremental', ok, ...data };
};

/**
 * Loads all scored rows for one requester made after the given time
 * (unix seconds). Keeps no state between runs.
 * `since` filters on requested_at; +1 second turns ">=" into ">".
 * Throws on any page failure — callers must handle the rejection
 * (current callers wrap each call in `Promise.allSettled`).
 */
export const fetchScoredRowsForRequester = async (
  chain: MechAnalyticsChain,
  requester: string,
  timestampGt: number,
  pageSize: number,
  maxPages: number
): Promise<ScoredRow[]> => {
  const rows: ScoredRow[] = [];
  let pages = 0;
  let lastPageFull = false;
  const params: Record<string, string> = {
    chain_id: String(MECH_ANALYTICS_CHAIN_IDS[chain]),
    requester,
    since: new Date((timestampGt + 1) * 1000).toISOString(),
    limit: String(pageSize),
  };
  for await (const page of iterateScoredRows(params)) {
    rows.push(...page);
    lastPageFull = page.length === pageSize;
    if (++pages >= maxPages) break;
  }
  // Can fire when the row count is exactly pageSize × maxPages and no more
  // rows exist — a rare false positive, accepted to keep the pager simple.
  if (pages >= maxPages && lastPageFull) {
    console.warn(
      `[mech-analytics:${chain}] page cap hit for ${requester} — rows beyond ${rows.length} were not fetched`
    );
  }
  return rows;
};
