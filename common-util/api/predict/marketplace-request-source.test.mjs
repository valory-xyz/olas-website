import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  scanAnalyticsRequestRows,
  usesMechAnalyticsForRequests,
} from './marketplace-request-source.ts';

const row = (id, ts, requester = '0xAbC', title = 'question') => ({
  request_id: id,
  requested_at: new Date(ts * 1000).toISOString(),
  requester,
  question_title: title,
});
async function* pages(...values) {
  for (const page of values) yield page;
}

test('Polygon parsed requests cannot use the removed Graph fallback; Gnosis retains its rollback', () => {
  assert.equal(usesMechAnalyticsForRequests('polygon', false), true);
  assert.equal(usesMechAnalyticsForRequests('gnosis', false), false);
  assert.equal(usesMechAnalyticsForRequests('gnosis', true), true);
});

test('historical replay keeps [from,to) bounds, deduplicates across pages and preserves timestamps', async () => {
  const emitted = [];
  await scanAnalyticsRequestRows(
    pages(
      [row('before', 99), row('a', 100), row('b', 101, '0xDEF', null)],
      [row('a', 100), row('end', 102), row('missing', 101, null)]
    ),
    100,
    102,
    (...args) => emitted.push(args)
  );
  // No delivered_at / charge_usd on these rows → undelivered rule (0.01).
  assert.deepEqual(emitted, [
    ['0xabc', 'question', 100, 10n ** 16n],
    ['0xdef', null, 101, 10n ** 16n],
  ]);
});

test('an incomplete analytics history rejects so the caller cannot save a successful chunk', async () => {
  async function* broken() {
    yield [row('a', 100)];
    throw new Error('page unavailable');
  }
  await assert.rejects(
    scanAnalyticsRequestRows(broken(), 100, 102, () => {}),
    /page unavailable/
  );
});

test("historical replay passes each row's real charge, 0.01 before pricing", async () => {
  const fees = [];
  const at = (id, ts, charge_usd) => ({
    ...row(id, ts),
    delivered_at: new Date(ts * 1000).toISOString(),
    charge_usd,
  });
  await scanAnalyticsRequestRows(
    pages([at('a', 100, null), at('b', 100, '0.0118')]),
    100,
    102,
    (...args) => fees.push(args[3])
  );
  assert.deepEqual(fees, [10n ** 16n, 11_800_000_000_000_000n]);
});
