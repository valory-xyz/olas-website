import { list, put } from '@vercel/blob';
import { AgentEconomiesMetricsData } from 'common-util/api/agent-economies';
import { ExplorerMetricsData } from 'common-util/api/explorer';
import { MainMetricsData } from 'common-util/api/main-metrics';
import { OtherMetricsData } from 'common-util/api/other-metrics';
import { PredictMetricsData } from 'common-util/api/predict';
import { StakingAprMetricsData } from 'common-util/api/staking-apr';
import { mergeSnapshotTree } from 'common-util/graphql/metric-utils';

// Blob filenames embed a schema version, so a breaking change to a snapshot's
// shape writes to a fresh blob instead of colliding with the old one. Versions
// are scoped per category: bump the changed category's entry in SCHEMA_VERSIONS
// so only its blob is renamed (and re-populated). A global bump would also reset
// unrelated categories — including slow-to-rebuild accumulators such as
// roi-distribution, which backfill from genesis over many daily cron runs.
const METRICS_BASE_PREFIX = `metrics-${process.env.NODE_ENV}`;
const DEFAULT_SCHEMA_VERSION = '20260708';
// Keyed by the category's first path segment ('roi-distribution/omenstrat-main'
// → 'roi-distribution'), so blob families written by the same code version
// together. Categories not listed here use DEFAULT_SCHEMA_VERSION.
const SCHEMA_VERSIONS: Record<string, string> = {
  // 20260901: apr became windowed (was a scalar string).
  predict: '20260901',
  // 20260901: rebuild from genesis under the agent-id based predict contract filter.
  'predict-staking-rewards': '20260901',
};
const CONTENT_TYPE = 'application/json';

const getSnapshotFilename = (category: string) => {
  const version = SCHEMA_VERSIONS[category.split('/')[0]] ?? DEFAULT_SCHEMA_VERSION;
  return `${METRICS_BASE_PREFIX}-${version}-${category}.json`;
};

type SaveSnapshotParams = {
  category: string;
  data: unknown;
  overwrite?: boolean;
};

type MetricsData =
  | MainMetricsData
  | PredictMetricsData
  | OtherMetricsData
  | AgentEconomiesMetricsData
  | ExplorerMetricsData
  | StakingAprMetricsData;

export type MetricsSnapshot = {
  data: MetricsData;
  timestamp: number;
};

const isMetricsSnapshot = (data: unknown): data is MetricsSnapshot =>
  typeof data === 'object' && data !== null && 'data' in data && 'timestamp' in data;

// The walk itself lives in metric-status.ts alongside the leaf decision, so both are
// covered by `yarn metric-status:test` rather than only the leaf.
const mergeWithFallback = (newData: unknown, oldData: unknown): unknown =>
  mergeSnapshotTree(newData, oldData, Date.now());

/**
 * Snapshot Storage:
 * Stores metric snapshots in Vercel Blob storage. We keep
 * one blob per category per environment (eg: 'main', 'other', 'predict').
 *
 * When we save, we overwrite the existing blob instead of creating new ones.
 * This way, the refresh-metrics endpoints can just update the same file with
 * fresh data.
 */
export const saveSnapshot = async ({
  category,
  data,
  overwrite = false,
}: SaveSnapshotParams): Promise<string | undefined> => {
  if (!isMetricsSnapshot(data)) return;

  let dataToSave = data;
  const filename = getSnapshotFilename(category);

  // Merge data if we are not explicitly overwriting
  if (!overwrite) {
    const previous = await loadSnapshot({ category });

    if (previous.outcome === 'error') {
      // Writing unmerged data here would strip the hold-last-good-value fallback from every
      // hard-errored metric in the category, for a reason unrelated to those metrics — a
      // transient blob read is enough. Better to leave the existing blob intact and let the
      // next cron retry than to overwrite good values with nulls.
      throw new Error(
        `Refusing to save ${category}: could not read the previous snapshot to merge against ` +
          `(${previous.error}). Existing blob left untouched; the next run will retry.`
      );
    }

    // 'absent' is the legitimate bootstrap path (first run, or a SCHEMA_VERSIONS bump):
    // there is nothing to merge against, so the raw fetch is what should be written.
    if (previous.outcome === 'found') {
      dataToSave = {
        ...data,
        data: mergeWithFallback(data.data, previous.snapshot.data) as MetricsData,
      };
    }
  }

  const blob = await put(filename, JSON.stringify(dataToSave), {
    access: 'public',
    addRandomSuffix: false,
    contentType: CONTENT_TYPE,
    allowOverwrite: true,
    cacheControlMaxAge: 0, // Disables caching so that old content is not served
  });

  return blob.url;
};

type GetSnapshotParams = {
  category: string;
};

/**
 * A snapshot genuinely not existing yet and a failed read are very different things to the
 * merge — the first must write raw to bootstrap, the second must not write at all — but
 * both collapse to `null` through `getSnapshot`. `loadSnapshot` keeps them apart.
 */
export type LoadSnapshotResult =
  | { outcome: 'found'; snapshot: MetricsSnapshot }
  | { outcome: 'absent' }
  | { outcome: 'error'; error: string };

export const loadSnapshot = async ({
  category,
}: GetSnapshotParams): Promise<LoadSnapshotResult> => {
  const filename = getSnapshotFilename(category);
  let blobUrl: string;

  try {
    const { blobs } = await list({ prefix: filename, limit: 1 });
    const blob = blobs?.find((b) => b.pathname === filename);
    // An empty listing is authoritative: the blob has never been written.
    if (!blob) return { outcome: 'absent' };
    blobUrl = blob.url;
  } catch (error) {
    console.error(`Error listing snapshot for ${category}:`, error);
    return { outcome: 'error', error: `list failed: ${(error as Error)?.message}` };
  }

  try {
    const response = await fetch(blobUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status} from ${blobUrl}`);

    const data = await response.json();
    if (isMetricsSnapshot(data)) return { outcome: 'found', snapshot: data };

    // The blob exists but is unusable. Treated as an error, not 'absent': overwriting it
    // unmerged would discard whatever valid values it still holds.
    console.warn(`Snapshot for ${category} does not match expected structure`);
    return { outcome: 'error', error: 'malformed snapshot' };
  } catch (error) {
    console.error(`Error reading snapshot for ${category}:`, error);
    return { outcome: 'error', error: (error as Error)?.message ?? 'read failed' };
  }
};

/**
 * Retrieves the latest snapshot for a given category, or null if it is missing or
 * unreadable. Read paths (pages, ISR) cannot act on the difference, so they use this;
 * `saveSnapshot` uses `loadSnapshot` because for a write the difference matters.
 */
export const getSnapshot = async ({
  category,
}: GetSnapshotParams): Promise<MetricsSnapshot | null> => {
  const result = await loadSnapshot({ category });
  return result.outcome === 'found' ? result.snapshot : null;
};
