/**
 * Rate-limit retry for RPC reads.
 *
 * Public RPC endpoints answer a rate limit with HTTP 200 and a JSON-RPC error body
 * rather than an HTTP 429 — Base's `https://mainnet.base.org` uses `-32016 "over rate
 * limit"`. viem's own retry (`shouldRetry` in `viem/utils/buildRequest`) does not
 * recognise that code, so it gives up on the first attempt. The caller then sees a hard
 * failure, which for POL means the whole chain drops out of the total and the homepage
 * figure freezes (`mergeWithFallback`).
 *
 * This layer covers *only* what viem's does not. viem still owns its own cases (it
 * retries them 3 times by default, and both transports keep that default), so anything
 * it already retried is rethrown here rather than retried again — otherwise one throttled
 * request would cost up to 3 x 4 = 12 requests against an endpoint that is asking us to
 * slow down. That includes errors with no numeric code at all: viem retries those.
 *
 * It also depends on the transport NOT batching. A batched rate limit reaches us as
 * `UnknownRpcError` with the provider's code stripped, so `getChainReader` sends one
 * request per read — see the comment there and the tests in `rpc-retry.test.mjs`.
 *
 * The cheap structural fixes are elsewhere — a dedicated RPC endpoint, and cron
 * schedules that don't all fire on the same minute (`vercel.json`). This is the
 * last line: a transient limit should cost a few hundred ms, not a stale metric.
 */

// Rate limits viem's `shouldRetry` does not recognise: -32016 = Base "over rate limit",
// -32029 = Arbitrum Nitro's rate-limit code.
const RATE_LIMIT_RPC_CODES = new Set([-32016, -32029]);
const RATE_LIMIT_TEXT = /rate limit|too many requests|rate.?limited/i;

// viem retries these itself: -1 (unknown), -32005 (LimitExceededRpcError), -32603
// (InternalRpcError), and 429 for providers that put the HTTP status in the JSON-RPC
// body (Alchemy in batch mode).
const VIEM_RETRIED_RPC_CODES = new Set([-1, -32005, -32603, 429]);
// ...and these HTTP statuses, on an HttpRequestError.
const VIEM_RETRIED_HTTP_STATUSES = new Set([403, 408, 413, 429, 500, 502, 503, 504]);

const MAX_CAUSE_DEPTH = 6;

/**
 * viem wraps the transport error several layers deep
 * (ContractFunctionExecutionError → CallExecutionError → RpcRequestError), and only
 * the innermost one carries the numeric code — so walk the `cause` chain rather than
 * inspecting the top-level error.
 */
const walkCauses = (error: unknown): Record<string, unknown>[] => {
  const chain: Record<string, unknown>[] = [];
  let current = error as Record<string, unknown> | undefined;

  for (let depth = 0; current && depth < MAX_CAUSE_DEPTH; depth += 1) {
    chain.push(current);
    current = current.cause as Record<string, unknown> | undefined;
  }

  return chain;
};

/**
 * True when viem's transport already retried this error to exhaustion. The markers are
 * read off the whole chain, not just the level that carries the rate-limit wording: a
 * 429's body ("Too Many Requests") is copied into the outer error's `details`, so
 * matching text first would retry something viem has already retried four times.
 *
 * An error carrying no numeric code and no HTTP status counts too — viem's `shouldRetry`
 * falls through to `true` for those, so a provider answering `{"error":"rate limit
 * exceeded"}` with no code has already had its four requests.
 */
const wasRetriedByViem = (levels: Record<string, unknown>[]): boolean =>
  levels.every((level) => typeof level.code !== 'number' && typeof level.status !== 'number') ||
  levels.some(
    (level) =>
      (typeof level.code === 'number' && VIEM_RETRIED_RPC_CODES.has(level.code)) ||
      (typeof level.status === 'number' && VIEM_RETRIED_HTTP_STATUSES.has(level.status))
  );

export const isRateLimitError = (error: unknown): boolean => {
  const levels = walkCauses(error);
  if (levels.length === 0 || wasRetriedByViem(levels)) return false;

  // Reached only for an error viem gave up on: a numeric code (or an HTTP status) it
  // does not retry. The wording is the fallback for providers whose rate-limit code
  // isn't one of the two below.
  return levels.some((level) => {
    if (typeof level.code === 'number' && RATE_LIMIT_RPC_CODES.has(level.code)) return true;

    const text = [level.details, level.shortMessage, level.message]
      .filter((part): part is string => typeof part === 'string')
      .join(' ');
    return RATE_LIMIT_TEXT.test(text);
  });
};

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const DEFAULT_ATTEMPTS = 3;
const BASE_DELAY_MS = 400;
// Pools are read in parallel, so without jitter every retry from one run would
// land on the provider in the same millisecond and trip the limit again. With the
// transport unbatched, a retry re-sends exactly the one read that was limited, so a
// run never costs the endpoint more requests on retry than it did on the first try.
const JITTER_MS = 250;

type RetryOptions = {
  attempts?: number;
  /** Injected by the tests so they don't spend the backoff. */
  sleepFn?: (ms: number) => Promise<void>;
};

/**
 * Retries `fn` only on rate limits viem did not already retry — any other failure
 * (revert, bad address, wrong ABI) is deterministic and is rethrown immediately, so a
 * genuine bug still fails fast.
 */
export const retryOnRateLimit = async <T>(
  fn: () => Promise<T>,
  label: string,
  { attempts = DEFAULT_ATTEMPTS, sleepFn = sleep }: RetryOptions = {}
): Promise<T> => {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      if (attempt >= attempts || !isRateLimitError(error)) throw error;

      const delay = BASE_DELAY_MS * 2 ** (attempt - 1) + Math.floor(Math.random() * JITTER_MS);
      console.warn(
        `[rpc-retry] ${label}: rate limited (attempt ${attempt}/${attempts}) — retrying in ${delay}ms`
      );
      await sleepFn(delay);
    }
  }
};
