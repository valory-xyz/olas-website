import { list, put } from '@vercel/blob';
import { MetricWithStatus } from 'common-util/graphql/types';
import lodash from 'lodash';

// Update this prefix when making breaking changes to the metrics schema.
const METRICS_PREFIX = `metrics-${process.env.NODE_ENV}`;
const CONTENT_TYPE = 'application/json';

const getSnapshotFilename = (category: string) =>
  `${METRICS_PREFIX}-${category}.json`;

type SaveSnapshotParams = {
  category: string;
  data: unknown;
};

type MetricsSnapshot = {
  data: Record<string, any>;
  timestamp: number;
};

const isMetricsSnapshot = (data: unknown): data is MetricsSnapshot =>
  typeof data === 'object' &&
  data !== null &&
  'data' in data &&
  'timestamp' in data;

const mergeWithFallback = (
  newData: unknown,
  oldData: unknown,
  path: string = ''
): unknown => {
  if (!newData || typeof newData !== 'object') {
    return newData;
  }

  if ('value' in newData && 'status' in newData) {
    const newMetric = newData as MetricWithStatus<unknown>;
    const oldMetric = oldData as MetricWithStatus<unknown>;

    if (
      newMetric.value === null ||
      newMetric.value === undefined ||
      newMetric.status?.stale
    ) {
      if (
        oldMetric &&
        oldMetric.value !== null &&
        oldMetric.value !== undefined
      ) {
        return {
          value: oldMetric.value,
          status: {
            ...newMetric.status,
            stale: true,
            lastValidAt: oldMetric.status?.lastValidAt ?? null,
          },
        };
      }
    } else {
      return {
        ...newMetric,
        status: {
          ...newMetric.status,
          stale: false,
          lastValidAt: Date.now(),
        },
      };
    }
    return newData;
  }

  const result: unknown = Array.isArray(newData) ? [] : {};
  if (Array.isArray(newData)) {
    return newData;
  }

  const allKeys = new Set([
    ...Object.keys(lodash.isPlainObject(newData) ? (newData as object) : {}),
    ...Object.keys(lodash.isPlainObject(oldData) ? (oldData as object) : {}),
  ]);

  for (const key of allKeys) {
    const newPath = path ? `${path}.${key}` : key;
    if (
      lodash.isPlainObject(newData) &&
      key in (newData as Record<string, unknown>)
    ) {
      result[key] = mergeWithFallback(
        (newData as Record<string, unknown>)[key],
        lodash.isPlainObject(oldData) &&
          key in (oldData as Record<string, unknown>)
          ? (oldData as Record<string, unknown>)[key]
          : undefined,
        newPath
      );
    } else if (
      lodash.isPlainObject(oldData) &&
      key in (oldData as Record<string, unknown>)
    ) {
      result[key] = (oldData as Record<string, unknown>)[key];
    }
  }

  return result;
};

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
}: SaveSnapshotParams): Promise<string> => {
  if (!isMetricsSnapshot(data)) return;

  let dataToSave = data;
  const filename = getSnapshotFilename(category);

  try {
    const oldSnapshot = await getSnapshot({ category });

    if (isMetricsSnapshot(oldSnapshot)) {
      const mergedData = mergeWithFallback(data.data, oldSnapshot.data);
      dataToSave = {
        ...data,
        data: mergedData,
      };
    }
  } catch (error) {
    console.warn(
      `Failed to load previous snapshot for ${category} fallback`,
      error
    );
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
 * Retrieves the latest snapshot for a given category.
 */
export const getSnapshot = async ({
  category,
}: GetSnapshotParams): Promise<unknown | null> => {
  try {
    const filename = getSnapshotFilename(category);
    const { blobs } = await list({ prefix: filename, limit: 1 });

    if (!blobs || blobs.length === 0) return null;

    const blob = blobs.find((b) => b.pathname === filename);

    if (!blob) return null;

    const response = await fetch(blob.url, {
      cache: 'no-store',
    });

    if (!response.ok)
      throw new Error(`Failed to fetch snapshot from ${blob.url}`);

    return await response.json();
  } catch (error) {
    console.error(`Error reading snapshot for ${category}:`, error);
    return null;
  }
};
