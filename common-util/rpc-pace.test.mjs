#!/usr/bin/env node
/**
 * Unit tests for per-chain RPC pacing. Uses Node's built-in test runner with
 * type-stripping to load the .ts module directly — no new devDependencies, no build step.
 * Run with `yarn rpc-pace:test`.
 *
 * The behaviour that decides whether a cron run trips a burst limit:
 *   - one request in flight per chain, spaced by the chain's minimum gap, no matter how
 *     many reads the caller fans out at once;
 *   - chains do not wait on each other — the budget being protected is per endpoint;
 *   - a failed read neither stalls the queue behind it nor rejects its neighbours.
 *
 * A virtual clock stands in for real time: the tests assert the *schedule*, so they must
 * not spend it.
 */

/* eslint-disable no-undef -- standalone test module: uses JS built-in globals */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { minIntervalMs, paceRpc, resetRpcPacing } from './rpc-pace.ts';

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

test('paceRpc: only one request per chain is in flight at a time', async () => {
  resetRpcPacing();
  const { now, sleepFn, advance } = clock();
  let inFlight = 0;
  let peak = 0;

  await Promise.all(
    Array.from({ length: 5 }, () =>
      paceRpc(
        'base',
        async () => {
          inFlight += 1;
          peak = Math.max(peak, inFlight);
          // The read itself takes time; the next one must not overlap it.
          await new Promise((resolve) => setImmediate(resolve));
          advance(120);
          inFlight -= 1;
        },
        { now, sleepFn }
      )
    )
  );

  assert.equal(peak, 1);
});

test('paceRpc: a slow read pushes the gap out rather than shrinking it', async () => {
  resetRpcPacing();
  const { now, sleepFn, advance } = clock();
  const starts = [];

  // First read takes longer than the gap: the second cannot start until it returns,
  // so the spacing that reaches the endpoint is the read duration, not 500ms.
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

  assert.equal(starts[1] - starts[0], 900);
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
