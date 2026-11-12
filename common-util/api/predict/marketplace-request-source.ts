import { MARKETPLACE_SQUID_URLS } from '../../indexers.ts';
import type { MechAnalyticsChain, ScoredRow } from './mech-analytics';

/** SQD has no parsed IPFS entities, so its enriched reads cannot roll back to Graph. */
export const usesMechAnalyticsForRequests = (chain: MechAnalyticsChain, enabled: boolean) =>
  enabled || chain in MARKETPLACE_SQUID_URLS;

/** Emit each historical request once, within the same [from, to) bounds as Graph. */
export const scanAnalyticsRequestRows = async (
  pages: AsyncIterable<ScoredRow[]>,
  fromTs: number,
  toTs: number,
  onRequest: (requester: string, title: string | null, timestamp: number) => void
): Promise<void> => {
  const seen = new Set<string>();
  for await (const page of pages) {
    for (const row of page) {
      const ts = Math.floor(Date.parse(row.requested_at) / 1000);
      if (
        !row.requester ||
        !Number.isFinite(ts) ||
        ts < fromTs ||
        ts >= toTs ||
        seen.has(row.request_id)
      )
        continue;
      seen.add(row.request_id);
      onRequest(row.requester.toLowerCase(), row.question_title, ts);
    }
  }
};
