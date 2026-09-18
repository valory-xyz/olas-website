#!/usr/bin/env node
/**
 * Unit tests for per-chain RPC pacing. Uses Node's built-in test runner with
 * type-stripping to load the .ts module directly — no new devDependencies, no build step.
 * Run with `yarn rpc-pace:test`.
 *
 * The behaviour that decides whether a cron run trips a burst limit:
 *   - requests leave one gap apart, no matter how many reads the caller fans out at once;
 *   - chains do not wait on each other — the budget being protected is per endpoint;
 *   - the gap is the *only* thing a read waits on: a slow, hung or failed read must not
 *     hold up the queue behind it, or one dead endpoint serialises into an overrun of
 *     the cron's `maxDuration` and no snapshot is written at all;
 *   - `pacedRead` composes pacing and the rate-limit retry in the order that keeps
 *     retried attempts inside the queue.
 *
 * A virtual clock stands in for real time: the tests assert the *schedule*, so they must
 * not spend it.
 */

/* eslint-disable no-undef -- standalone test module: uses JS built-in globals */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { minIntervalMs, paceRpc, pacedRead, resetRpcPacing } from './rpc-pace.ts';

// Virtual clock: `sleepFn` advances it instead of waiting, so a 500ms gap costs nothing.
const clock = () => {
  const state = { now: 1_000_000 };
  return {
    now: () => state.now,
    sleepFn: async (ms) => {
      state.now += ms;
    },
    advance: (ms) => {
      state.now += ms;
    },
  };
};

test('minIntervalMs: Base is paced slower than the default', () => {
  assert.equal(minIntervalMs('base'), 500);
  assert.equal(minIntervalMs('gnosis'), 200);
  // An unlisted chain still gets the default rather than running unpaced.
  assert.equal(minIntervalMs('robinhood'), 200);
});

test('paceRpc: reads fanned out at once start one gap apart', async () => {
  resetRpcPacing();
  const { now, sleepFn } = clock();
  const starts = [];

  // The failing shape from 2026-09-18: several Base reads issued in the same tick.
  await Promise.all(
    ['getPoolId', 'totalSupply', 'getPoolTokens', 'getBlockNumber'].map((fn) =>
      paceRpc(
        'base',
        async () => {
          starts.push(now());
          return fn;
        },
        { now, sleepFn }
      )
    )
  );

  assert.equal(starts.length, 4);
  const gaps = starts.slice(1).map((t, i) => t - starts[i]);
  assert.deepEqual(gaps, [500, 500, 500], `starts ${starts.join(',')}`);
});

test('paceRpc: a hung read does not stall the queue behind it', async () => {
  resetRpcPacing();
  const { now, sleepFn } = clock();
  const starts = [];

  // The failure this guards: holding the slot until a read *answers* would queue 21
  // Ethereum reads behind one 41s timeout and overrun the cron's 300s budget, so no
  // snapshot is written for any chain. This read never answers at all.
  const hung = paceRpc(
    'ethereum',
    () => {
      starts.push(now());
      return new Promise(() => {});
    },
    { now, sleepFn }
  );

  const after = await paceRpc(
    'ethereum',
    async () => {
      starts.push(now());
      return 'ok';
    },
    { now, sleepFn }
  );

  assert.equal(after, 'ok');
  assert.equal(starts[1] - starts[0], 200);
  // The hung read is still hung — it was never what the queue was waiting on.
  assert.equal(await Promise.race([hung, Promise.resolve('still-pending')]), 'still-pending');
});

test('paceRpc: a read that throws synchronously still frees the queue', async () => {
  resetRpcPacing();
  const { now, sleepFn } = clock();

  const thrown = paceRpc(
    'base',
    () => {
      throw new Error('bad ABI');
    },
    { now, sleepFn }
  );

  await assert.rejects(thrown, /bad ABI/);
  assert.equal(await paceRpc('base', async () => 'ok', { now, sleepFn }), 'ok');
});

test('paceRpc: a slow read does not widen the gap for the reads behind it', async () => {
  resetRpcPacing();
  const { now, sleepFn, advance } = clock();
  const starts = [];

  // Spacing is a property of when requests are *sent*, so it stays at the configured
  // gap whatever the endpoint's latency is doing.
  await Promise.all([
    paceRpc(
      'base',
      async () => {
        starts.push(now());
        await new Promise((resolve) => setImmediate(resolve));
        advance(900);
      },
      { now, sleepFn }
    ),
    paceRpc(
      'base',
      async () => {
        starts.push(now());
      },
      { now, sleepFn }
    ),
  ]);

  assert.equal(starts[1] - starts[0], 500);
});

test('paceRpc: different chains do not wait on each other', async () => {
  resetRpcPacing();
  const { now, sleepFn } = clock();
  const chains = ['base', 'gnosis', 'optimism'];
  const queuedAt = now();
  const startedAt = {};

  await Promise.all(
    chains.map((chain) =>
      paceRpc(
        chain,
        async () => {
          startedAt[chain] = now();
        },
        { now, sleepFn }
      )
    )
  );

  // Each chain's queue is empty, so all three go out at once — pacing Base must not
  // slow down the chains that were not being throttled.
  assert.deepEqual(
    chains.map((chain) => startedAt[chain]),
    [queuedAt, queuedAt, queuedAt]
  );
});

test('paceRpc: a failed read rejects only its own caller and keeps the queue moving', async () => {
  resetRpcPacing();
  const { now, sleepFn } = clock();

  const failed = paceRpc(
    'base',
    async () => {
      throw new Error('over rate limit');
    },
    { now, sleepFn }
  );
  const after = paceRpc('base', async () => 'ok', { now, sleepFn });

  await assert.rejects(failed, /over rate limit/);
  assert.equal(await after, 'ok');
});

test('paceRpc: a read arriving after a quiet period does not wait', async () => {
  resetRpcPacing();
  const { now, sleepFn, advance } = clock();

  await paceRpc('base', async () => 'first', { now, sleepFn });
  const idleStart = now();
  advance(5_000);

  const startedAt = await paceRpc('base', async () => now(), { now, sleepFn });

  // The gap is measured from the last request, not from when this one was queued —
  // an idle endpoint owes us nothing.
  assert.equal(startedAt, idleStart + 5_000);
});

test('pacedRead: a retried attempt goes back through the queue', async () => {
  resetRpcPacing();
  const { now, sleepFn } = clock();
  const sends = [];
  let attempts = 0;

  // The backoff is given a sleep that costs no virtual time, so the only thing that can
  // separate the two attempts on the clock is the pacing gap. Invert the composition —
  // `paceRpc(chain, () => retryOnRateLimit(fn))` — and the slot is already released by
  // the time the retry fires, so attempt 2 leaves in the same instant as attempt 1 and
  // this reads 0.
  const result = await pacedRead(
    'base',
    async () => {
      sends.push(now());
      attempts += 1;
      if (attempts === 1) throw Object.assign(new Error('over rate limit'), { code: -32016 });
      return 'ok';
    },
    'base:flaky',
    { now, sleepFn, retry: { sleepFn: async () => {} } }
  );

  assert.equal(result, 'ok');
  assert.equal(attempts, 2);
  assert.equal(sends[1] - sends[0], minIntervalMs('base'));
});

test('pacedRead: a read that is not rate limited is sent once', async () => {
  resetRpcPacing();
  const { now, sleepFn } = clock();
  let attempts = 0;

  await assert.rejects(
    pacedRead(
      'base',
      async () => {
        attempts += 1;
        throw new Error('execution reverted');
      },
      'base:revert',
      { now, sleepFn, retry: { sleepFn: async () => {} } }
    ),
    /execution reverted/
  );

  assert.equal(attempts, 1);
});
