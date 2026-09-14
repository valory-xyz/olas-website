#!/usr/bin/env node
/**
 * Unit tests for the JSON-LD builders. Node's built-in runner with type-stripping loads the
 * .ts module directly. Run with `yarn structured-data:test`.
 *
 * Structured data fails silently — a malformed block is simply ignored by every consumer —
 * so the cases pinned here are the ones a validator would not flag but a reader would be
 * misled by: an answer that lost its text, a date that is not a date, a `</script>` that
 * would truncate the page.
 */

/* eslint-disable no-undef -- standalone test module: uses JS built-in globals */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  buildArticle,
  buildDataCatalog,
  buildFaqPage,
  reactNodeToText,
  serializeJsonLd,
} from './structured-data.ts';

const SITE = 'https://olas.network';

/** A React element, structurally: the builders only ever read `type` and `props.children`. */
const el = (children, type = 'span') => ({
  $$typeof: Symbol.for('react.element'),
  type,
  props: { children },
});

test('reactNodeToText keeps text and drops everything else', () => {
  const tree = el([
    'Olas enables ',
    el('everyone'),
    ' to own agents. ',
    el({ props: { children: null } }),
    ['Nested ', el(['deeply', el('.')])],
    true,
    null,
    42,
  ]);
  assert.equal(reactNodeToText(tree), 'Olas enables everyone to own agents. Nested deeply.42');
});

test('paragraphs do not run together, inline elements do not split', () => {
  // The main FAQ answers are several <p>s; joined bare they read "…of AI.With Pearl…".
  const answer = el(
    [el('Olas is a platform.', 'p'), el(['With ', el('Pearl', 'strong'), ', anyone can.'], 'p')],
    'div'
  );
  assert.equal(
    reactNodeToText(answer).replace(/\s+/g, ' ').trim(),
    'Olas is a platform. With Pearl, anyone can.'
  );
});

test('FAQPage carries one Question per item, whitespace collapsed', () => {
  const faq = buildFaqPage([
    { question: '  What is Olas? ', answer: reactNodeToText(el(['Olas is\n   a platform.'])) },
  ]);
  assert.equal(faq['@type'], 'FAQPage');
  assert.deepEqual(faq.mainEntity, [
    {
      '@type': 'Question',
      name: 'What is Olas?',
      acceptedAnswer: { '@type': 'Answer', text: 'Olas is a platform.' },
    },
  ]);
});

test('FAQPage drops an item whose answer has no text', () => {
  // An image-only answer is a malformed entry, not something to publish as an empty string.
  const faq = buildFaqPage([
    { question: 'How do the pieces fit?', answer: reactNodeToText(el(null)) },
    { question: 'Real one', answer: 'Real answer' },
  ]);
  assert.equal(faq.mainEntity.length, 1);
  assert.equal(faq.mainEntity[0].name, 'Real one');
});

test('the catalog and its datasets point at the production Organization', () => {
  // The same @id `Meta` declares on the homepage and the app suite points at — never a
  // preview host's own.
  const catalog = buildDataCatalog({
    siteUrl: 'https://olas-website-preview.vercel.app',
    datasets: [{ id: 'daily-active-agents', name: 'Daily Active Agents', description: 'x' }],
  });
  assert.equal(catalog.creator['@id'], 'https://olas.network/#organization');
  assert.equal(catalog.dataset[0].creator['@id'], 'https://olas.network/#organization');
});

test('each Dataset id is the section anchor on /data', () => {
  // A tile's `/data#daily-active-agents` link and the Dataset record must resolve to one thing.
  const catalog = buildDataCatalog({
    siteUrl: SITE,
    datasets: [{ id: 'daily-active-agents', name: 'Daily Active Agents', description: 'x' }],
  });
  assert.equal(catalog.dataset[0]['@id'], `${SITE}/data#daily-active-agents`);
  assert.equal(catalog.dataset[0].url, `${SITE}/data#daily-active-agents`);
  assert.equal(catalog.dataset[0].includedInDataCatalog['@id'], `${SITE}/data`);
});

test('Article normalises dates to ISO 8601 and omits the ones it cannot parse', () => {
  const article = buildArticle({
    siteUrl: SITE,
    path: '/blog/hello',
    title: 'Hello',
    datePublished: '2026-09-01',
    dateModified: 'not a date',
  });
  assert.equal(article.datePublished, '2026-09-01T00:00:00.000Z');
  assert.equal('dateModified' in article, false);
  assert.equal(article.mainEntityOfPage, `${SITE}/blog/hello`);
});

test('Article credits a named author when the CMS has one, else the organisation', () => {
  const named = buildArticle({ siteUrl: SITE, path: '/blog/a', title: 'A', author: ' Jane Doe ' });
  const anon = buildArticle({ siteUrl: SITE, path: '/blog/b', title: 'B' });
  assert.deepEqual(named.author, { '@type': 'Person', name: 'Jane Doe' });
  assert.deepEqual(anon.author, { '@id': 'https://olas.network/#organization' });
  assert.deepEqual(anon.publisher, { '@id': 'https://olas.network/#organization' });
});

test('serialised JSON-LD cannot close its own script tag', () => {
  const out = serializeJsonLd({ text: 'x</script><script>alert(1)</script>' });
  assert.ok(!out.includes('</script>'), out);
  // …and still round-trips to the original value.
  assert.equal(JSON.parse(out).text, 'x</script><script>alert(1)</script>');
});
