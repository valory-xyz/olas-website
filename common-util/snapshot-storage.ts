import { list, put } from '@vercel/blob';

const METRICS_PREFIX = `WEBSITE-METRICS-${process.env.NODE_ENV}`;
const CONTENT_TYPE = 'application/json';

const getSnapshotFilename = (category: string) =>
  `${METRICS_PREFIX}-${category}.json`;

type SaveSnapshotParams = {
  category: string;
  data: unknown;
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
  const filename = getSnapshotFilename(category);

  const blob = await put(filename, JSON.stringify(data), {
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
