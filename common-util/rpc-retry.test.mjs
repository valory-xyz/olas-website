#!/usr/bin/env node
/**
 * Unit tests for the RPC rate-limit retry. Uses Node's built-in test runner with
 * type-stripping to load the .ts module directly — no new devDependencies, no build step.
 * Run with `yarn rpc-retry:test`.
 *
 * Two behaviours decide whether a throttled endpoint costs us a metric or a few hundred
 * milliseconds, and both are easy to regress:
 *   - retry ONLY the rate limits viem's transport does not already retry, or one
 *     throttled request turns into ~12 requests at an endpoint asking us to slow down;
 *   - rethrow everything else on the first attempt, so a revert or a bad ABI still
 *     fails fast instead of sleeping through three attempts.
 */

/* eslint-disable no-undef, no-console -- standalone test module: uses JS built-in globals */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { isRateLimitError, retryOnRateLimit } from './rpc-retry.ts';

// viem wraps the transport error: ContractFunctionExecutionError → CallExecutionError →
// RpcRequestError, and only the innermost level carries the numeric code.
const nest = (depth, innermost) => {
  let error = innermost;
  for (let i = 0; i < depth; i += 1) {
    error = { name: 'ContractFunctionExecutionError', message: 'read failed', cause: error };
  }
  return error;
};

const rateLimited = (extra) => Object.assign(new Error('over rate limit'), extra);

const noSleep = async () => {};

// The retry logs one warning per attempt and these tests exercise a dozen of them;
// the assertions cover the behaviour, so keep the runner's output readable.
console.warn = () => {};

test('isRateLimitError: finds a code viem misses nested in the cause chain', () => {
  const error = nest(3, { code: -32016, message: 'over rate limit' });
  assert.equal(isRateLimitError(error), true);
});

test('isRateLimitError: finds Arbitrum Nitro’s rate-limit code', () => {
  assert.equal(isRateLimitError({ code: -32029, message: 'too many requests' }), true);
});

test('isRateLimitError: matches on wording when the code is absent', () => {
  const error = nest(2, { message: 'your app has exceeded its compute units rate limit' });
  assert.equal(isRateLimitError(error), true);
});

test('isRateLimitError: stops walking past the depth cutoff', () => {
  // 6 levels are inspected; a marker sitting below that is not found.
  const withinCutoff = nest(5, { code: -32016, message: 'over rate limit' });
  const beyondCutoff = nest(6, { code: -32016, message: 'over rate limit' });
  assert.equal(isRateLimitError(withinCutoff), true);
  assert.equal(isRateLimitError(beyondCutoff), false);
});

test('isRateLimitError: a plain revert is not a rate limit', () => {
  const error = nest(2, { code: 3, message: 'execution reverted' });
  assert.equal(isRateLimitError(error), false);
});

test('isRateLimitError: false for a non-error value', () => {
  assert.equal(isRateLimitError(undefined), false);
  assert.equal(isRateLimitError(null), false);
});

test('isRateLimitError: declines the codes viem already retried', () => {
  // -32005 (LimitExceededRpcError) and 429-in-body are both in viem's `shouldRetry`,
  // so by the time they reach us the endpoint has already had 4 requests.
  assert.equal(isRateLimitError({ code: -32005, message: 'limit exceeded' }), false);
  assert.equal(isRateLimitError({ code: 429, message: 'too many requests' }), false);
  assert.equal(isRateLimitError({ code: -32603, message: 'internal error' }), false);
});

test('isRateLimitError: declines an HTTP 429 even though its body says "Too Many Requests"', () => {
  // The body is copied into the outer error's `details`, so matching text before
  // checking the status would retry what viem has already retried.
  const error = nest(2, {
    name: 'HttpRequestError',
    status: 429,
    details: 'Too Many Requests',
    message: 'HTTP request failed.',
  });
  assert.equal(isRateLimitError(error), false);
});

test('retryOnRateLimit: returns the value without sleeping when the call succeeds', async () => {
  let calls = 0;
  const slept = [];

  const result = await retryOnRateLimit(
    async () => {
      calls += 1;
      return 'ok';
    },
    'test:success',
    { sleepFn: async (ms) => slept.push(ms) }
  );

  assert.equal(result, 'ok');
  assert.equal(calls, 1);
  assert.deepEqual(slept, []);
});

test('retryOnRateLimit: rethrows a non-rate-limit error after a single call', async () => {
  let calls = 0;

  await assert.rejects(
    retryOnRateLimit(
      async () => {
        calls += 1;
        throw new Error('execution reverted');
      },
      'test:revert',
      { sleepFn: noSleep }
    ),
    /execution reverted/
  );

  assert.equal(calls, 1);
});

test('retryOnRateLimit: succeeds after two rate limits, backing off between attempts', async () => {
  let calls = 0;
  const slept = [];

  const result = await retryOnRateLimit(
    async () => {
      calls += 1;
      if (calls < 3) throw nest(2, rateLimited({ code: -32016 }));
      return 'ok';
    },
    'test:recovers',
    { sleepFn: async (ms) => slept.push(ms) }
  );

  assert.equal(result, 'ok');
  assert.equal(calls, 3);
  assert.equal(slept.length, 2);
  // 400ms then 800ms, each plus up to 250ms of jitter.
  assert.ok(slept[0] >= 400 && slept[0] < 650, `first delay ${slept[0]}`);
  assert.ok(slept[1] >= 800 && slept[1] < 1050, `second delay ${slept[1]}`);
});

test('retryOnRateLimit: gives up at the attempt cap and rethrows the last error', async () => {
  let calls = 0;
  const slept = [];

  await assert.rejects(
    retryOnRateLimit(
      async () => {
        calls += 1;
        throw rateLimited({ code: -32016 });
      },
      'test:cap',
      { sleepFn: async (ms) => slept.push(ms) }
    ),
    /over rate limit/
  );

  // Three attempts, so two sleeps — never a fourth request at a throttled endpoint.
  assert.equal(calls, 3);
  assert.equal(slept.length, 2);
});

test('retryOnRateLimit: honours a custom attempt count', async () => {
  let calls = 0;

  await assert.rejects(
    retryOnRateLimit(
      async () => {
        calls += 1;
        throw rateLimited({ code: -32016 });
      },
      'test:attempts',
      { attempts: 1, sleepFn: noSleep }
    )
  );

  assert.equal(calls, 1);
});
