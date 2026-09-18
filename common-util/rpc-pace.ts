/**
 * Per-chain RPC pacing.
 *
 * The retry in `rpc-retry.ts` is the last line of defence; this is the first. Every
 * snapshot builder fans its reads out with `Promise.all`, so a single cron run lands
 * several `eth_call`s on one endpoint inside the same few milliseconds — on 2026-09-18
 * the `other` run sent Base a head-block lookup plus three reads per POL pool (two
 * pools), and `getPoolTokens` came back `-32016 "over rate limit"` while its siblings
 * succeeded. That is a burst limit: the requests were fine, their spacing was not.
 * Backing off after the fact cannot fix it, because the burst has already been spent
 * by the time the first error arrives.
 *
 * So reads go through a per-chain queue that issues them a minimum gap apart. What is
 * serialised is the *sending*, not the waiting: a request's slot is released the moment
 * it is in flight, so a chain's wall time is its issue schedule plus one read, never the
 * sum of its reads. Holding the slot until each read answered would turn one hung
 * endpoint into a queue of timeouts — `other` issues 21 Ethereum reads, and at viem's
 * defaults (10s timeout, 3 retries ≈ 41s each) that is ~860s against a `maxDuration` of
 * 300, so the run would be killed before `saveSnapshot` and *every* chain's metrics
 * would stop refreshing. Requests for different chains run concurrently throughout —
 * the budget being protected is per endpoint, not global.
 *
 * Callers should reach for `pacedRead` rather than `paceRpc` directly: it fixes the
 * order this has to compose in with the rate-limit retry, which is easy to invert.
 *
 * Rate is the thing endpoints count, so rate is the thing this bounds. In-flight
 * requests are left unbounded on purpose: any cap would re-introduce the stall above.
 * The natural ceiling is read latency divided by the gap, which is ~1 in practice.
 *
 * The rates below are a self-imposed budget, not a published provider limit. Public
 * endpoints do not commit to a number we could encode, and on Vercel the egress IP is
 * shared with other tenants, so whatever budget the provider does apply is not ours
 * alone. They are set below the burst that was observed to fail, and the cost of being
 * conservative is a few seconds inside a 300s cron — not a stale metric.
 */

// Relative and extension-bearing so Node's type-stripping test runner can load this
// module directly — ESM resolution knows nothing of the tsconfig aliases and will not
// resolve an extensionless specifier. Same reason as `metric-context.ts`.
import { type RetryOptions, retryOnRateLimit } from './rpc-retry.ts';

// Requests per second we allow ourselves per chain.
const DEFAULT_RPS = 5;
const RPS_BY_CHAIN: Record<string, number> = {
  // The endpoint that actually broke, and the one Base's own docs describe as
  // rate-limited and unsuitable for production traffic.
  base: 2,
};

export const minIntervalMs = (chain: string): number =>
  Math.round(1000 / (RPS_BY_CHAIN[chain] ?? DEFAULT_RPS));

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

type ChainQueue = {
  /** Start time of the most recent request, so the gap is measured start-to-start. */
  lastStartedAt: number;
  /** Resolves once the request ahead of a newcomer has been *sent* (not answered). */
  tail: Promise<void>;
};

const queues: Record<string, ChainQueue> = {};

type PaceOptions = {
  /** Injected by the tests so they don't spend the wait. */
  sleepFn?: (ms: number) => Promise<void>;
  now?: () => number;
};

/**
 * Sends `fn` once the chain's queue reaches it and the minimum gap has elapsed, and
 * resolves with whatever `fn` resolves with.
 *
 * Retries belong *outside* this call (`retryOnRateLimit(() => paceRpc(...))`), so the
 * backoff does not hold the queue slot against reads that could be making progress,
 * and each retried attempt is paced like any other request rather than jumping ahead.
 */
export const paceRpc = <T>(
  chain: string,
  fn: () => Promise<T>,
  { sleepFn = sleep, now = Date.now }: PaceOptions = {}
): Promise<T> => {
  const queue = queues[chain] ?? { lastStartedAt: 0, tail: Promise.resolve() };
  queues[chain] = queue;

  // Resolved by the turn below once its request is away, which is what lets the next
  // one start timing its gap. Nothing here ever waits on a response.
  let sent: () => void;
  const nextCanStart = new Promise<void>((resolve) => {
    sent = resolve;
  });

  const result = queue.tail.then(async () => {
    const wait = queue.lastStartedAt + minIntervalMs(chain) - now();
    if (wait > 0) await sleepFn(wait);
    queue.lastStartedAt = now();
    try {
      return fn();
    } finally {
      // `finally` runs when `fn()` returns its promise, not when that promise settles —
      // so a read that hangs, or throws synchronously, still frees the queue.
      sent();
    }
  });

  queue.tail = nextCanStart;

  return result;
};

type PacedReadOptions = PaceOptions & {
  /** Forwarded to `retryOnRateLimit` — attempts, and the injected sleep in tests. */
  retry?: RetryOptions;
};

/**
 * The one way to issue an RPC read: paced, and retried on the rate limits viem misses.
 *
 * The composition order is the point of this helper. Retry has to sit *outside* pacing,
 * so that a backed-off attempt re-enters the chain's queue like any other request.
 * Inverted — `paceRpc(chain, () => retryOnRateLimit(fn))` — the slot is released as soon
 * as the first attempt is away, and every retry after it bypasses the queue entirely:
 * a throttled endpoint would get its extra requests unpaced, which is the burst this
 * module exists to remove. Written out at each call site that inversion looks harmless,
 * so it is written out once here instead and pinned by a test.
 */
export const pacedRead = <T>(
  chain: string,
  fn: () => Promise<T>,
  label: string,
  { retry, ...pacing }: PacedReadOptions = {}
): Promise<T> => retryOnRateLimit(() => paceRpc(chain, fn, pacing), label, retry);

/** Test-only: drops the queues so one test's spacing can't leak into the next. */
export const resetRpcPacing = (): void => {
  Object.keys(queues).forEach((chain) => delete queues[chain]);
};
