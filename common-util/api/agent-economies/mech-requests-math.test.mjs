#!/usr/bin/env node
/**
 * Unit tests for the Mech request split. Uses Node's built-in test runner with
 * type-stripping to load the .ts module directly. Run with `yarn mech-requests-math:test`.
 *
 * These decide the published request and delivery totals and the off-chain share: how a
 * chain's globals split into on-chain and settled off-chain counts, how the off-chain
 * page walks sum, and when a reading is refused instead of published.
 */

/* eslint-disable no-undef -- standalone test module: uses JS built-in globals */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  isTransientPageError,
  offChainSharePercent,
  parseCount,
  splitChainRequests,
  sumChainSplits,
  sumPages,
} from './mech-requests-math.ts';

// Counters carry the off-chain part twice, as on the Optimism marketplace subgraph.
const DOUBLED_CHAIN = {
  totalRequests: 9531,
  totalDeliveries: 9529,
  senderOffChain: 9154,
  offChain: 4577,
};

// One data source: the sender sum equals the event-row sum.
const SINGLE_CHAIN = {
  totalRequests: 11932946,
  totalDeliveries: 10097014,
  senderOffChain: 24466,
  offChain: 24466,
};

const ROWS_KEY = 'senders';
const FIELD = 'totalOffChainRequests';
const PIN_BLOCK = 158200000;

const row = (id, count) => ({ id, [FIELD]: String(count) });

/**
 * A page fetcher that serves `responses` in order and records the variables of each call.
 * An `Error` in the list is thrown instead of returned. Asking past the last response
 * fails the test, so a walk that does not stop is caught.
 */
const pagedFetcher = (responses) => {
  const queue = [...responses];
  const calls = [];
  const fetchPage = async (variables) => {
    calls.push(variables);
    assert.ok(queue.length > 0, 'walk asked for a page past the last one');
    const next = queue.shift();
    if (next instanceof Error) throw next;
    return next;
  };
  return { fetchPage, calls };
};

// Records each wait instead of waiting.
const recordingRetry = (attempts) => {
  const waits = [];
  return {
    waits,
    retry: { attempts, delayMs: RETRY_DELAY_MS, sleep: async (ms) => waits.push(ms) },
  };
};

const RETRY_DELAY_MS = 1000;
const NO_RETRY = recordingRetry(1).retry;

// graphql-request's ClientError carries the HTTP response; a network failure has none.
const httpError = (status) => Object.assign(new Error(`HTTP ${status}`), { response: { status } });
const graphqlError = () =>
  Object.assign(new Error('GraphQL error'), {
    response: { status: 200, errors: [{ message: 'bad field' }] },
  });
const networkError = () => new TypeError('fetch failed');

const walk = (fetchPage, overrides = {}) =>
  sumPages({
    fetchPage,
    rowsKey: ROWS_KEY,
    field: FIELD,
    isSubgraph: true,
    block: PIN_BLOCK,
    maxPages: 10,
    retry: NO_RETRY,
    ...overrides,
  });

test('splitChainRequests removes the whole off-chain part when the handler double-counts', () => {
  assert.deepEqual(splitChainRequests(DOUBLED_CHAIN), {
    onChainRequests: 377,
    onChainDeliveries: 375,
    offChain: 4577,
  });
});

test('splitChainRequests leaves totals unchanged when counters match the event rows', () => {
  const split = splitChainRequests(SINGLE_CHAIN);
  assert.deepEqual(split, {
    onChainRequests: 11908480,
    onChainDeliveries: 10072548,
    offChain: 24466,
  });
  assert.equal(split.onChainRequests + split.offChain, SINGLE_CHAIN.totalRequests);
});

test('splitChainRequests reads a chain with no activity as zeros', () => {
  assert.deepEqual(
    splitChainRequests({ totalRequests: 0, totalDeliveries: 0, senderOffChain: 0, offChain: 0 }),
    { onChainRequests: 0, onChainDeliveries: 0, offChain: 0 }
  );
});

test('splitChainRequests refuses a chain whose sender off-chain sum exceeds its globals', () => {
  assert.throws(
    () => splitChainRequests({ ...SINGLE_CHAIN, totalDeliveries: SINGLE_CHAIN.senderOffChain - 1 }),
    /exceeds the globals/
  );
  assert.throws(
    () => splitChainRequests({ ...SINGLE_CHAIN, totalRequests: SINGLE_CHAIN.senderOffChain - 1 }),
    /exceeds the globals/
  );
});

test('sumChainSplits rebuilds requests and deliveries as on-chain plus off-chain', () => {
  const totals = sumChainSplits([
    splitChainRequests(DOUBLED_CHAIN),
    splitChainRequests(SINGLE_CHAIN),
  ]);
  assert.deepEqual(totals, {
    requests: 377 + 4577 + 11908480 + 24466,
    deliveries: 375 + 4577 + 10072548 + 24466,
    offChainRequests: 4577 + 24466,
  });
});

test('sumChainSplits of no chains is zero', () => {
  assert.deepEqual(sumChainSplits([]), { requests: 0, deliveries: 0, offChainRequests: 0 });
});

test('sumPages sums every page and stops at the first empty one', async () => {
  const { fetchPage, calls } = pagedFetcher([
    { [ROWS_KEY]: [row('0x01', 3), row('0x02', 4)] },
    { [ROWS_KEY]: [row('0x03', 5)] },
    { [ROWS_KEY]: [] },
  ]);
  assert.equal(await walk(fetchPage), 12);
  assert.equal(calls.length, 3);
});

test('sumPages carries the last id of each page into the next request', async () => {
  const { fetchPage, calls } = pagedFetcher([
    { [ROWS_KEY]: [row('0x01', 1), row('0x0a', 1)] },
    { [ROWS_KEY]: [row('0x0b', 1)] },
    { [ROWS_KEY]: [] },
  ]);
  await walk(fetchPage);
  assert.deepEqual(
    calls.map((c) => c.lastId),
    ['0x', '0x0a', '0x0b']
  );
});

test('sumPages pins every subgraph page to the block and pages by a Bytes id', async () => {
  const { fetchPage, calls } = pagedFetcher([{ [ROWS_KEY]: [row('0x01', 1)] }, { [ROWS_KEY]: [] }]);
  await walk(fetchPage);
  assert.deepEqual(calls, [
    { block: PIN_BLOCK, lastId: '0x' },
    { block: PIN_BLOCK, lastId: '0x01' },
  ]);
});

test('sumPages sends squids no block and pages by a String id', async () => {
  const { fetchPage, calls } = pagedFetcher([{ [ROWS_KEY]: [row('a', 2)] }, { [ROWS_KEY]: [] }]);
  assert.equal(await walk(fetchPage, { isSubgraph: false, block: undefined }), 2);
  assert.deepEqual(calls, [{ lastId: '' }, { lastId: 'a' }]);
});

test('sumPages refuses a subgraph walk with no block to pin to', async () => {
  const { fetchPage, calls } = pagedFetcher([]);
  await assert.rejects(walk(fetchPage, { block: undefined }), /no block/);
  assert.equal(calls.length, 0);
});

test('sumPages throws once a walk needs more than maxPages pages', async () => {
  const full = (id) => ({ [ROWS_KEY]: [row(id, 1)] });
  const { fetchPage } = pagedFetcher([full('0x01'), full('0x02'), full('0x03')]);
  await assert.rejects(walk(fetchPage, { maxPages: 2 }), /exceeds 2 pages/);
});

test('sumPages accepts exactly maxPages pages', async () => {
  const full = (id) => ({ [ROWS_KEY]: [row(id, 1)] });
  const { fetchPage } = pagedFetcher([full('0x01'), full('0x02'), { [ROWS_KEY]: [] }]);
  assert.equal(await walk(fetchPage, { maxPages: 2 }), 2);
});

test('sumPages refuses a response without the rows array', async () => {
  for (const page of [{}, { other: [] }, { [ROWS_KEY]: null }, null]) {
    const { fetchPage } = pagedFetcher([page]);
    await assert.rejects(walk(fetchPage), /no senders array/);
  }
});

test('sumPages refuses a row whose count is not a count', async () => {
  const { fetchPage } = pagedFetcher([{ [ROWS_KEY]: [{ id: '0x01', [FIELD]: '1.5' }] }]);
  await assert.rejects(walk(fetchPage), /not a count/);
});

test('sumPages retries a page that fails transiently and keeps its variables', async () => {
  const { retry, waits } = recordingRetry(3);
  const { fetchPage, calls } = pagedFetcher([
    { [ROWS_KEY]: [row('0x01', 2)] },
    httpError(503),
    networkError(),
    { [ROWS_KEY]: [row('0x02', 3)] },
    { [ROWS_KEY]: [] },
  ]);
  assert.equal(await walk(fetchPage, { retry }), 5);
  assert.deepEqual(
    calls.map((c) => c.lastId),
    ['0x', '0x01', '0x01', '0x01', '0x02']
  );
  assert.deepEqual(waits, [RETRY_DELAY_MS, 2 * RETRY_DELAY_MS]);
});

test('sumPages gives up after the last attempt and rethrows the failure', async () => {
  const { retry, waits } = recordingRetry(3);
  const lastFailure = httpError(429);
  const { fetchPage, calls } = pagedFetcher([httpError(429), httpError(429), lastFailure]);
  await assert.rejects(walk(fetchPage, { retry }), (error) => error === lastFailure);
  assert.equal(calls.length, 3);
  assert.equal(waits.length, 2);
});

test('sumPages does not retry a GraphQL error or a client error', async () => {
  for (const failure of [graphqlError(), httpError(400)]) {
    const { retry, waits } = recordingRetry(3);
    const { fetchPage, calls } = pagedFetcher([failure]);
    await assert.rejects(walk(fetchPage, { retry }), (error) => error === failure);
    assert.equal(calls.length, 1);
    assert.equal(waits.length, 0);
  }
});

test('sumPages does not retry a malformed response', async () => {
  const { retry } = recordingRetry(3);
  const { fetchPage, calls } = pagedFetcher([{ other: [] }]);
  await assert.rejects(walk(fetchPage, { retry }), /no senders array/);
  assert.equal(calls.length, 1);
});

test('isTransientPageError retries network, throttling and server failures only', () => {
  for (const status of [408, 429, 500, 502, 503, 504]) {
    assert.equal(isTransientPageError(httpError(status)), true, `status ${status}`);
  }
  assert.equal(isTransientPageError(networkError()), true);
  for (const status of [200, 400, 401, 404]) {
    assert.equal(isTransientPageError(httpError(status)), false, `status ${status}`);
  }
  assert.equal(isTransientPageError(graphqlError()), false);
});

test('parseCount accepts subgraph BigInt strings and integers', () => {
  assert.equal(parseCount('4577'), 4577);
  assert.equal(parseCount('0'), 0);
  assert.equal(parseCount(12), 12);
});

test('parseCount rejects anything that is not a non-negative safe integer', () => {
  for (const raw of ['', ' ', '1.5', '-3', 'abc', '9007199254740993', -1, 2.5, NaN]) {
    assert.throws(() => parseCount(raw), /not a count/, `accepted ${String(raw)}`);
  }
});

test('offChainSharePercent divides off-chain requests by the total', () => {
  assert.equal(offChainSharePercent(4577, 4954), (4577 / 4954) * 100);
  assert.equal(offChainSharePercent(0, 10), 0);
  assert.equal(offChainSharePercent(10, 10), 100);
});

test('offChainSharePercent is null when an input is missing or the total is zero', () => {
  assert.equal(offChainSharePercent(null, 10), null);
  assert.equal(offChainSharePercent(10, undefined), null);
  assert.equal(offChainSharePercent(0, 0), null);
});
