#!/usr/bin/env node
/**
 * Unit tests for the pure staking-emissions helpers. Uses Node's built-in test runner
 * with type-stripping to load the .ts module directly — no new devDependencies, no
 * build step. Run with `yarn staking-emissions-math:test`.
 *
 * Two truncation bugs have shipped from this path. The first summed reward rows with a
 * fixed `first: 1000` per epoch and published a third of the real figure; the second
 * left the epoch query with no limit at all, which The Graph caps at 100. Both were
 * silent — a smaller number, no error — so the paging termination is pinned here rather
 * than checked against live subgraphs, which CI cannot do.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  PAGE_SIZE,
  bucketByEpoch,
  cumulativeToEpochDeltas,
  epochIndexFor,
  pageSets,
  sumSeries,
} from './staking-emissions-math.ts';

const epochs = [
  { counter: 1, blockTimestamp: '100' },
  { counter: 2, blockTimestamp: '200' },
  { counter: 3, blockTimestamp: '300' },
];

test('an event exactly on a boundary belongs to the epoch that closes there', () => {
  // The windows are half-open, (prev, cur]. Off by one here moves a whole epoch's
  // worth of rewards into its neighbour.
  assert.equal(epochIndexFor(100, epochs), 0);
  assert.equal(epochIndexFor(101, epochs), 1);
  assert.equal(epochIndexFor(200, epochs), 1);
  assert.equal(epochIndexFor(201, epochs), 2);
});

test('the last epoch is open-ended and anything before the first still lands in it', () => {
  assert.equal(epochIndexFor(300, epochs), 2);
  assert.equal(epochIndexFor(99999, epochs), 2, 'the open epoch has no upper bound');
  assert.equal(epochIndexFor(1, epochs), 0, 'nothing is dropped off the front');
});

test('bucketByEpoch puts every event in exactly one epoch', () => {
  const events = [
    { blockTimestamp: '50', amount: 1n },
    { blockTimestamp: '100', amount: 2n },
    { blockTimestamp: '150', amount: 4n },
    { blockTimestamp: '900', amount: 8n },
  ];
  assert.deepEqual(bucketByEpoch(events, epochs), [3n, 4n, 8n]);
  const total = bucketByEpoch(events, epochs).reduce((a, b) => a + b, 0n);
  assert.equal(total, 15n, 'nothing double counted, nothing lost');
});

test('a chain whose series starts late yields leading zeros, never negatives', () => {
  // Its first snapshot lands in epoch 3; epochs 1 and 2 must read 0, not a negative
  // delta from differencing against an absent earlier total.
  const deltas = cumulativeToEpochDeltas([{ timestamp: 250, value: 500n }], epochs);
  assert.deepEqual(deltas, [0n, 0n, 500n]);
  assert.ok(
    deltas.every((d) => d >= 0n),
    'a late-starting chain must not produce a negative delta'
  );
});

test('the latest snapshot at or before an epoch end is the one used', () => {
  const deltas = cumulativeToEpochDeltas(
    [
      { timestamp: 50, value: 10n },
      { timestamp: 90, value: 30n },
      { timestamp: 150, value: 70n },
    ],
    epochs
  );
  // epoch 1 closes at 100 and must take the value from 90, not from 50
  assert.deepEqual(deltas, [30n, 40n, 0n]);
});

test('sumSeries adds chains elementwise and tolerates a short series', () => {
  assert.deepEqual(sumSeries([[1n, 2n, 3n], [10n, 20n, 30n]], 3), [11n, 22n, 33n]);
  assert.deepEqual(sumSeries([[1n]], 3), [1n, 0n, 0n]);
  assert.deepEqual(sumSeries([], 2), [0n, 0n]);
});

const fakeClient = (pages) => {
  const calls = [];
  return {
    calls,
    request: async (query) => {
      calls.push(query);
      return pages[calls.length - 1];
    },
  };
};

const rowsOf = (n, prefix = 'r') =>
  Array.from({ length: n }, (_, i) => ({ id: `${prefix}${String(i).padStart(4, '0')}` }));

test('a set of exactly PAGE_SIZE rows triggers a second request', async () => {
  // The direct regression test for the truncation this module exists to prevent: a
  // full page is indistinguishable from a complete set unless it is followed up.
  const client = fakeClient([
    { _meta: { block: { number: 1 } }, deposits: rowsOf(PAGE_SIZE) },
    { _meta: { block: { number: 1 } }, deposits: rowsOf(3, 'z') },
  ]);
  const { rows } = await pageSets(client, () => ['deposits(...)'], ['deposits'], '_meta');

  assert.equal(client.calls.length, 2, 'a full page must be followed by another request');
  assert.equal(rows.deposits.length, PAGE_SIZE + 3, 'both pages are kept');
});

test('a short first page stops after one request', async () => {
  const client = fakeClient([{ _meta: {}, deposits: rowsOf(7) }]);
  const { rows } = await pageSets(client, () => ['deposits(...)'], ['deposits'], '_meta');
  assert.equal(client.calls.length, 1);
  assert.equal(rows.deposits.length, 7);
});

test('an exhausted set is not re-requested while another is still paging', async () => {
  const client = fakeClient([
    { _meta: {}, deposits: rowsOf(2), rewardUpdates: rowsOf(PAGE_SIZE, 'u') },
    { _meta: {}, rewardUpdates: rowsOf(1, 'v') },
  ]);
  const built = [];
  const { rows } = await pageSets(
    client,
    (cursors) => {
      built.push(Object.keys(cursors));
      return ['deposits(...)', 'rewardUpdates(...)'];
    },
    ['deposits', 'rewardUpdates'],
    '_meta'
  );

  assert.equal(client.calls.length, 2);
  assert.ok(!client.calls[1].includes('deposits'), 'the finished set is dropped from the retry');
  assert.equal(rows.deposits.length, 2);
  assert.equal(rows.rewardUpdates.length, PAGE_SIZE + 1);
});

test('the cursor advances to the last id of the page', async () => {
  const seen = [];
  const client = fakeClient([
    { _meta: {}, deposits: rowsOf(PAGE_SIZE) },
    { _meta: {}, deposits: [] },
  ]);
  await pageSets(
    client,
    (cursors) => {
      seen.push(cursors.deposits);
      return ['deposits(...)'];
    },
    ['deposits'],
    '_meta'
  );
  assert.deepEqual(seen, ['', `r${String(PAGE_SIZE - 1).padStart(4, '0')}`]);
});

test('an empty page ends the loop without inventing rows', async () => {
  const client = fakeClient([{ _meta: {}, deposits: [] }]);
  const { rows } = await pageSets(client, () => ['deposits(...)'], ['deposits'], '_meta');
  assert.equal(client.calls.length, 1);
  assert.deepEqual(rows.deposits, []);
});
