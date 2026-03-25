import type { AgentEconomiesMetricsData } from 'common-util/api/agent-economies';
import type { MainMetricsData } from 'common-util/api/main-metrics';
import type { OtherMetricsData } from 'common-util/api/other-metrics';
import type { PredictMetricsData } from 'common-util/api/predict';
import { getSnapshot } from 'common-util/snapshot-storage';

import type { OgSnapshotCategory } from './registry';

const SNAPSHOT_CATEGORY: Record<OgSnapshotCategory, string> = {
  main: 'main',
  other: 'other',
  predict: 'predict',
  'agent-economies': 'agent-economies',
};

export type OgSnapshotBundle = {
  main: MainMetricsData | null;
  other: OtherMetricsData | null;
  predict: PredictMetricsData | null;
  agentEconomies: AgentEconomiesMetricsData | null;
};

export async function loadOgSnapshotBundle(
  categories: OgSnapshotCategory[]
): Promise<OgSnapshotBundle> {
  const bundle: OgSnapshotBundle = {
    main: null,
    other: null,
    predict: null,
    agentEconomies: null,
  };

  const uniq = [...new Set(categories)];
  if (uniq.length === 0) return bundle;

  // Local dev often has no `BLOB_READ_WRITE_TOKEN`; `list()` would throw before useful metrics load.
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return bundle;
  }

  const results = await Promise.all(
    uniq.map(async (cat) => {
      const snap = await getSnapshot({ category: SNAPSHOT_CATEGORY[cat] });
      return { cat, data: snap?.data ?? null };
    })
  );

  for (const { cat, data } of results) {
    if (cat === 'main') bundle.main = data as MainMetricsData | null;
    if (cat === 'other') bundle.other = data as OtherMetricsData | null;
    if (cat === 'predict') bundle.predict = data as PredictMetricsData | null;
    if (cat === 'agent-economies') bundle.agentEconomies = data as AgentEconomiesMetricsData | null;
  }

  return bundle;
}
