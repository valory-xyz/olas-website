#!/usr/bin/env node
/**
 * Unit tests for the post-build structured-data check. Run with
 * `yarn structured-data:check:test`.
 *
 * Like the label check beside it, this script's only dangerous failure is passing when it
 * should not — so each fixture here is a page that *looks* fine and must be reported.
 */

/* eslint-disable no-undef -- standalone test module: uses JS built-in globals */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { checkPage } from './check-structured-data.mjs';

const block = (data) => `<script type="application/ld+json">${JSON.stringify(data)}</script>`;

const ORG = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://olas.network/#organization',
  name: 'Olas',
  url: 'https://olas.network',
  logo: 'https://olas.network/images/olas-logo.svg',
  sameAs: ['https://x.com/autonolas'],
};

const WEBSITE = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Olas',
  url: 'https://olas.network',
  publisher: { '@id': 'https://olas.network/#organization' },
};

const META = '<link rel="canonical" href="https://olas.network/x"/>';

/** A non-homepage page: canonical tag, no site-level blocks. */
const page = (...parts) => `<html><head>${META}${parts.join('')}</head><body></body></html>`;

/** The homepage, as `Meta` renders it: Organization and WebSite in one `@graph`. */
const SITE_GRAPH = { '@context': 'https://schema.org', '@graph': [ORG, WEBSITE] };
const homepage = (...parts) =>
  `<html><head>${META}${block(SITE_GRAPH)}${parts.join('')}</head><body></body></html>`;

test('the homepage carries one Organization and one WebSite, in one @graph', () => {
  const { errors, counts } = checkPage(homepage(), { isHomepage: true });
  assert.deepEqual(errors, []);
  assert.deepEqual(counts, { Organization: 1, WebSite: 1 });
});

test('a WebSite that does not name its publisher is reported', () => {
  const orphan = {
    '@context': 'https://schema.org',
    '@graph': [ORG, { ...WEBSITE, publisher: undefined }],
  };
  const html = `<html><head>${META}${block(orphan)}</head><body></body></html>`;
  const { errors } = checkPage(html, { isHomepage: true });
  assert.match(errors.join(String.fromCharCode(10)), /WebSite: no publisher/);
});

test('a homepage without the site blocks has lost them', () => {
  const { errors } = checkPage(page(), { isHomepage: true });
  assert.match(errors.join(String.fromCharCode(10)), /homepage has 0 Organization/);
});

test('any other page carrying the site blocks means the route gate broke', () => {
  const { errors } = checkPage(homepage());
  assert.match(
    errors.join(String.fromCharCode(10)),
    /page has 1 Organization block\(s\), expected 0/
  );
});

test('a block carrying Next.js head attributes is still found', () => {
  const stamped = `<script type="application/ld+json" data-next-head="">${JSON.stringify(SITE_GRAPH)}</script>`;
  const html = `<html><head>${META}${stamped}</head><body></body></html>`;
  const { errors, counts } = checkPage(html, { isHomepage: true });
  assert.deepEqual(errors, []);
  assert.deepEqual(counts, { Organization: 1, WebSite: 1 });
});

test('a block that does not parse is reported, not skipped', () => {
  const html = page('<script type="application/ld+json">{not json</script>');
  const { errors } = checkPage(html);
  assert.match(errors.join('\n'), /does not parse/);
});

test('a FAQ question with an empty answer is reported', () => {
  // The builder drops these, so one reaching the page means the builder was bypassed.
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Q', acceptedAnswer: { '@type': 'Answer', text: '' } },
    ],
  };
  const { errors } = checkPage(page(block(faq)));
  assert.match(errors.join('\n'), /"Q" has no answer text/);
});

const catalog = (datasets) => ({
  '@context': 'https://schema.org',
  '@type': 'DataCatalog',
  '@id': 'https://olas.network/data',
  dataset: datasets.map(({ id, name }) => ({
    '@type': 'Dataset',
    '@id': `https://olas.network/data#${id}`,
    name,
    description: 'd',
    url: `https://olas.network/data#${id}`,
  })),
});

const dataPage = (sections, ...blocks) =>
  `<html><head>${META}${blocks.join('')}</head><body>${sections
    .map(({ id, name }) => `<section id="${id}"><h2 class="x">${name}</h2></section>`)
    .join('')}</body></html>`;

test('a Dataset whose anchor and heading are on the page is clean', () => {
  const sections = [{ id: 'daily-active-agents', name: 'Daily Active Agents' }];
  const { errors } = checkPage(dataPage(sections, block(catalog(sections))));
  assert.deepEqual(errors, []);
});

test('a Dataset pointing at an anchor the page no longer has is a citation to nothing', () => {
  const onPage = [{ id: 'daily-active-agents', name: 'Daily Active Agents' }];
  const inCatalog = [{ id: 'daily-active-users', name: 'Daily Active Agents' }];
  const { errors } = checkPage(dataPage(onPage, block(catalog(inCatalog))));
  assert.match(errors.join('\n'), /anchor #daily-active-users is not on the page/);
});

test('a Dataset whose name drifted from the heading is reported', () => {
  const onPage = [{ id: 'omenstrat-predict-roi', name: 'Omenstrat: Trading ROI' }];
  const inCatalog = [{ id: 'omenstrat-predict-roi', name: 'Omenstrat: Partial ROI' }];
  const { errors } = checkPage(dataPage(onPage, block(catalog(inCatalog))));
  assert.match(errors.join('\n'), /"Omenstrat: Partial ROI": no <h2>/);
  // …and the heading on the page is flagged as unlisted, from the other direction.
  assert.match(errors.join('\n'), /Section "Omenstrat: Trading ROI" has no Dataset record/);
});

test('a section added to the page without a record is reported', () => {
  const onPage = [
    { id: 'daily-active-agents', name: 'Daily Active Agents' },
    { id: 'new-metric', name: 'New Metric' },
  ];
  const { errors } = checkPage(dataPage(onPage, block(catalog(onPage.slice(0, 1)))));
  assert.match(errors.join('\n'), /Section "New Metric" has no Dataset record/);
});

test('headings with entities and nested markup still match', () => {
  // React escapes apostrophes and the heading may carry a nested span.
  const html = `<html><head>${META}${block(
    catalog([{ id: 'x', name: "Treasury's Fees" }])
  )}</head><body><section id="x"><h2><span>Treasury&#x27;s</span>  Fees</h2></section></body></html>`;
  const { errors } = checkPage(html);
  assert.deepEqual(errors, []);
});
