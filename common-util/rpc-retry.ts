/**
 * Rate-limit retry for RPC reads.
 *
 * Public RPC endpoints answer a rate limit with HTTP 200 and a JSON-RPC error body
 * rather than an HTTP 429 — Base's `https://mainnet.base.org` uses `-32016 "over rate
 * limit"`. viem's own retry (`shouldRetry` in `viem/utils/buildRequest`) only covers
 * `-32005`, `-32603`, `429` and a set of HTTP statuses, so it gives up on the first
 * attempt. The caller then sees a hard failure, which for POL means the whole chain
 * drops out of the total and the homepage figure freezes (`mergeWithFallback`).
 *
 * The cheap structural fixes are elsewhere — a dedicated RPC endpoint, and cron
 * schedules that don't all fire on the same minute (`vercel.json`). This is the
 * last line: a transient limit should cost a few hundred ms, not a stale metric.
 */

// -32005 = viem's LimitExceededRpcError, -32016 = Base "over rate limit",
// -32029 = Arbitrum Nitro's rate-limit code, 429 = providers that put the HTTP
// status in the JSON-RPC body (Alchemy in batch mode).
const RATE_LIMIT_RPC_CODES = new Set([-32005, -32016, -32029, 429]);
const RATE_LIMIT_TEXT = /rate limit|too many requests|rate.?limited/i;

const MAX_CAUSE_DEPTH = 6;

/**
 * viem wraps the transport error several layers deep
 * (ContractFunctionExecutionError → CallExecutionError → RpcRequestError), and only
 * the innermost one carries the numeric code — so walk the `cause` chain rather than
 * inspecting the top-level error.
 */
export const isRateLimitError = (error: unknown): boolean => {
  let current = error as Record<string, unknown> | undefined;

  for (let depth = 0; current && depth < MAX_CAUSE_DEPTH; depth += 1) {
    if (typeof current.code === 'number' && RATE_LIMIT_RPC_CODES.has(current.code)) return true;
    if (current.status === 429) return true;

    const text = [current.details, current.shortMessage, current.message]
      .filter((part): part is string => typeof part === 'string')
      .join(' ');
    if (RATE_LIMIT_TEXT.test(text)) return true;

    current = current.cause as Record<string, unknown> | undefined;
  }

  return false;
};

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const DEFAULT_ATTEMPTS = 3;
const BASE_DELAY_MS = 400;
// Pools are read in parallel, so without jitter every retry from one run would
// land on the provider in the same millisecond and trip the limit again.
const JITTER_MS = 250;

/**
 * Retries `fn` only on rate limits — any other failure (revert, bad address, wrong
 * ABI) is deterministic and is rethrown immediately, so a genuine bug still fails fast.
 */
export const retryOnRateLimit = async <T>(
  fn: () => Promise<T>,
  label: string,
  attempts = DEFAULT_ATTEMPTS
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
      await sleep(delay);
    }
  }
};
