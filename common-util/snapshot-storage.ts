import { list, put } from '@vercel/blob';
import { AgentEconomiesMetricsData } from 'common-util/api/agent-economies';
import { MainMetricsData } from 'common-util/api/main-metrics';
import { OtherMetricsData } from 'common-util/api/other-metrics';
import { PredictMetricsData } from 'common-util/api/predict';
import { isMetricWithStatus, MetricWithStatus } from 'common-util/graphql/types';
import { isNil, isPlainObject } from 'lodash';

// Update this prefix when making breaking changes to the metrics schema.
const METRICS_PREFIX = `metrics-${process.env.NODE_ENV}`;
const CONTENT_TYPE = 'application/json';

const getSnapshotFilename = (category: string) => `${METRICS_PREFIX}-${category}.json`;

type SaveSnapshotParams = {
  category: string;
  data: unknown;
};

type MetricsData =
  | MainMetricsData
  | PredictMetricsData
  | OtherMetricsData
  | AgentEconomiesMetricsData;

export type MetricsSnapshot = {
  data: MetricsData;
  timestamp: number;
};

const isMetricsSnapshot = (data: unknown): data is MetricsSnapshot =>
  typeof data === 'object' && data !== null && 'data' in data && 'timestamp' in data;

// TODO: refactor this fn to make it more readable.
const mergeWithFallback = (newData: unknown, oldData: unknown, path: string = ''): unknown => {
  if (!newData || typeof newData !== 'object') {
    return newData;
  }

  if (isMetricWithStatus(newData)) {
    const newMetric = newData as MetricWithStatus<unknown>;
    const oldMetric = isMetricWithStatus(oldData) ? (oldData as MetricWithStatus<unknown>) : null;

    const newValueIsInvalid = isNil(newMetric.value) || newMetric.status?.stale;

    if (newValueIsInvalid) {
      // Try to fall back to old data if available and valid
      if (oldMetric && !isNil(oldMetric.value)) {
        return {
          value: oldMetric.value,
          status: {
            ...newMetric.status,
            stale: true,
            lastValidAt: oldMetric.status?.lastValidAt ?? null,
          },
        };
      }
      // No valid fallback - return newData as-is with stale status preserved
      return {
        ...newMetric,
        status: {
          ...newMetric.status,
          stale: true,
          lastValidAt: newMetric.status?.lastValidAt ?? null,
        },
      };
    }

    // New data is valid - update with fresh timestamp
    return {
      ...newMetric,
      status: {
        ...newMetric.status,
        stale: false,
        lastValidAt: Date.now(),
      },
    };
  }

  const result: Record<string, unknown> = {};
  if (Array.isArray(newData)) {
    return newData;
  }

  const allKeys = new Set([
    ...Object.keys(isPlainObject(newData) ? (newData as object) : {}),
    ...Object.keys(isPlainObject(oldData) ? (oldData as object) : {}),
  ]);

  for (const key of allKeys) {
    const newPath = path ? `${path}.${key}` : key;
    if (isPlainObject(newData) && key in (newData as Record<string, unknown>)) {
      result[key] = mergeWithFallback(
        (newData as Record<string, unknown>)[key],
        isPlainObject(oldData) && key in (oldData as Record<string, unknown>)
          ? (oldData as Record<string, unknown>)[key]
          : undefined,
        newPath
      );
    } else if (isPlainObject(oldData) && key in (oldData as Record<string, unknown>)) {
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
}: SaveSnapshotParams): Promise<string | undefined> => {
  if (!isMetricsSnapshot(data)) return;

  let dataToSave = data;
  const filename = getSnapshotFilename(category);

  try {
    const oldSnapshot = await getSnapshot({ category });

    if (isMetricsSnapshot(oldSnapshot)) {
      const mergedData = mergeWithFallback(data.data, oldSnapshot.data);
      dataToSave = {
        ...data,
        data: mergedData as MetricsData,
      };
    }
  } catch (error) {
    console.warn(`Failed to load previous snapshot for ${category} fallback`, error);
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
}: GetSnapshotParams): Promise<MetricsSnapshot | null> => {
  try {
    const filename = getSnapshotFilename(category);
    const { blobs } = await list({ prefix: filename, limit: 1 });

    if (!blobs || blobs.length === 0) return null;

    const blob = blobs.find((b) => b.pathname === filename);

    if (!blob) return null;

    const response = await fetch(blob.url, {
      cache: 'no-store',
    });

    if (!response.ok) throw new Error(`Failed to fetch snapshot from ${blob.url}`);

    const data = await response.json();

    if (isMetricsSnapshot(data)) {
      return data;
    }

    console.warn(`Snapshot for ${category} does not match expected structure`);
    return null;
  } catch (error) {
    console.error(`Error reading snapshot for ${category}:`, error);
    return null;
  }
};
