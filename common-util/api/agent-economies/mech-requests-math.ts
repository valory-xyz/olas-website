// Pure helpers behind the Mech request totals; covered by mech-requests-math.test.mjs.

export type ChainRequestCounts = {
  totalRequests: number;
  totalDeliveries: number;
  // Sum of `Sender.totalOffChainRequests`, read at the same block as the globals.
  senderOffChain: number;
  // Sum of `numDeliveries` over signed-delivery event rows, read at the same block.
  offChain: number;
};

export type ChainRequestSplit = {
  onChainRequests: number;
  onChainDeliveries: number;
  offChain: number;
};

export type MechRequestTotals = {
  requests: number;
  deliveries: number;
  offChainRequests: number;
};

/**
 * Splits one chain's globals into on-chain counts and settled off-chain requests.
 *
 * The signed-delivery handler adds the same `numDeliveries` to the requester's
 * `totalOffChainRequests` and to both globals in one run, so `senderOffChain` is exactly
 * the off-chain part of the globals however many times the handler ran per event.
 * Removing it leaves the on-chain counts. Event rows are stored once per event, so their
 * sum is the off-chain count. An off-chain request is only visible once settled, which
 * makes it both a request and a delivery.
 */
export const splitChainRequests = ({
  totalRequests,
  totalDeliveries,
  senderOffChain,
  offChain,
}: ChainRequestCounts): ChainRequestSplit => {
  const onChainRequests = totalRequests - senderOffChain;
  const onChainDeliveries = totalDeliveries - senderOffChain;
  if (onChainRequests < 0 || onChainDeliveries < 0) {
    throw new Error(
      `off-chain sender total ${senderOffChain} exceeds the globals (${totalRequests} requests, ${totalDeliveries} deliveries)`
    );
  }
  return { onChainRequests, onChainDeliveries, offChain };
};

// Totals across chains, each rebuilt as on-chain plus off-chain.
export const sumChainSplits = (splits: ChainRequestSplit[]): MechRequestTotals =>
  splits.reduce(
    (totals, split) => ({
      requests: totals.requests + split.onChainRequests + split.offChain,
      deliveries: totals.deliveries + split.onChainDeliveries + split.offChain,
      offChainRequests: totals.offChainRequests + split.offChain,
    }),
    { requests: 0, deliveries: 0, offChainRequests: 0 }
  );

// Subgraph BigInt fields arrive as strings; anything that is not a non-negative safe
// integer is a schema or transport fault, not a count.
export const parseCount = (raw: string | number): number => {
  const value = typeof raw === 'string' && raw.trim() !== '' ? Number(raw) : raw;
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) {
    throw new Error(`not a count: ${String(raw)}`);
  }
  return value;
};

export type PageVariables = { block?: number; lastId: string };

export type PageRetry = {
  // Total tries per page, including the first.
  attempts: number;
  // Wait before retry n is `delayMs * n`.
  delayMs: number;
  sleep: (ms: number) => Promise<void>;
};

const TRANSIENT_HTTP_STATUSES = new Set([408, 429, 500, 502, 503, 504]);

/**
 * True for failures a second request can fix: no HTTP response at all (network error,
 * timeout) or a throttling or server status. A response that came back with GraphQL
 * errors fails the same way every time, so it is not retried.
 */
export const isTransientPageError = (error: unknown): boolean => {
  const response = (error as { response?: { status?: unknown } } | null)?.response;
  if (response === undefined || response === null) return true;
  return typeof response.status === 'number' && TRANSIENT_HTTP_STATUSES.has(response.status);
};

const fetchPageWithRetry = async (
  fetchPage: SumPagesOptions['fetchPage'],
  variables: PageVariables,
  { attempts, delayMs, sleep }: PageRetry
): Promise<Record<string, unknown>> => {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await fetchPage(variables);
    } catch (error) {
      if (attempt >= attempts || !isTransientPageError(error)) throw error;
      await sleep(delayMs * attempt);
    }
  }
};

export type SumPagesOptions = {
  fetchPage: (variables: PageVariables) => Promise<Record<string, unknown>>;
  rowsKey: string;
  field: string;
  // Subgraph pages are pinned to `block` and paged by a `Bytes` id; squids cannot
  // time-travel, so theirs read the latest state and page by a `String` id.
  isSubgraph: boolean;
  block: number | undefined;
  maxPages: number;
  retry: PageRetry;
};

/**
 * Walks an id-ordered page query until an empty page and sums one count field. A page
 * request that fails transiently is retried per `retry`. A response without a `rowsKey`
 * array, or a walk needing more than `maxPages` pages, throws so the chain is refused
 * instead of publishing a partial sum.
 */
export const sumPages = async ({
  fetchPage,
  rowsKey,
  field,
  isSubgraph,
  block,
  maxPages,
  retry,
}: SumPagesOptions): Promise<number> => {
  if (isSubgraph && block === undefined) {
    throw new Error('no block to pin subgraph pages to');
  }
  let sum = 0;
  let lastId = isSubgraph ? '0x' : '';
  for (let pages = 1; ; pages += 1) {
    const page = await fetchPageWithRetry(
      fetchPage,
      isSubgraph ? { block, lastId } : { lastId },
      retry
    );
    const rows = page?.[rowsKey];
    if (!Array.isArray(rows)) throw new Error(`response has no ${rowsKey} array`);
    if (rows.length === 0) return sum;
    if (pages > maxPages) throw new Error(`${rowsKey} exceeds ${maxPages} pages`);
    rows.forEach((row) => {
      sum += parseCount(row[field]);
    });
    lastId = rows[rows.length - 1].id;
  }
};

// Percentage of requests settled off-chain, or null when there is nothing to divide.
export const offChainSharePercent = (
  offChainRequests: number | null | undefined,
  totalRequests: number | null | undefined
): number | null => {
  if (typeof offChainRequests !== 'number' || typeof totalRequests !== 'number') return null;
  if (totalRequests <= 0) return null;
  return (offChainRequests / totalRequests) * 100;
};
