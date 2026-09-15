#!/usr/bin/env node
/**
 * Unit tests for the llms.txt link check. Run with `yarn llms:check:test`.
 *
 * `resolve` is injected, so each case is a small fake site: the check must fail on a link
 * to a page that is not there and on a fragment the page does not carry, and must not
 * fail on links it has no way to verify (other hosts, dynamic routes).
 */

/* eslint-disable no-undef -- standalone test module: uses JS built-in globals */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { checkLlms, extractUrls, readLastUpdated } from './check-llms.mjs';

const site = (pages) => async (pathname) => {
  const clean = pathname.replace(/\/$/, '') || '/';
  if (clean in pages) return { kind: 'page', html: pages[clean] };
  if (clean.startsWith('/blog/')) return { kind: 'dynamic' };
  return null;
};

const PAGES = {
  '/': '<div id="pearl"></div>',
  '/timeline': '<main></main>',
};

const HEADER = 'last-updated: 2026-09-15\n';

test('extractUrls drops the punctuation prose leaves on a link', () => {
  assert.deepEqual(
    extractUrls('see https://olas.network/faq, and (https://olas.network/timeline).'),
    ['https://olas.network/faq', 'https://olas.network/timeline']
  );
});

test('a file whose own-site links all resolve is clean', async () => {
  const text = `${HEADER}https://olas.network/#pearl https://olas.network/timeline https://olas.network/blog/lbp-stats`;
  const { errors, checked } = await checkLlms(text, site(PAGES));
  assert.deepEqual(errors, []);
  assert.equal(checked, 3);
});

test('a link to a page that no longer exists is reported', async () => {
  const { errors } = await checkLlms(`${HEADER}https://olas.network/timelinez`, site(PAGES));
  assert.match(errors.join('\n'), /no page, file or redirect at \/timelinez/);
});

test('a fragment the page does not carry is reported', async () => {
  // This is the drift that matters most: a section is renamed and every `#anchor` in the
  // prose silently starts landing at the top of the page.
  const { errors } = await checkLlms(`${HEADER}https://olas.network/#pearlz`, site(PAGES));
  assert.match(errors.join('\n'), /no element with id="pearlz"/);
});

test('links to other hosts are not this file’s problem', async () => {
  const { errors, checked } = await checkLlms(`${HEADER}https://pearl.you/nope`, site(PAGES));
  assert.deepEqual(errors, []);
  assert.equal(checked, 0);
});

test('a missing last-updated line is reported', async () => {
  const { errors } = await checkLlms('https://olas.network/timeline', site(PAGES));
  assert.match(errors.join('\n'), /last-updated/);
  assert.equal(readLastUpdated('last-updated: not-a-date'), null);
  assert.equal(readLastUpdated('last-updated: 2026-09-15'), '2026-09-15');
});
