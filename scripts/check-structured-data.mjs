#!/usr/bin/env node
/**
 * Post-build check: every JSON-LD block the site serves is well-formed and anchored to
 * what the page actually shows.
 *
 * Structured data fails silently — a malformed block is simply ignored by every consumer,
 * and a Dataset pointing at an anchor that no longer exists is a citation to nothing. Both
 * look identical to a clean build. So this reads the built HTML back, the way a crawler
 * would, and fails on:
 *
 *   - a block that does not parse, has no `@context`, or has a type this site never emits,
 *   - the homepage not carrying exactly one Organization and one WebSite, or any other
 *     page carrying one at all — `Meta` declares them on the homepage only, which is where
 *     search engines read the site name and logo from,
 *   - a FAQ with no questions, or a question with no answer text,
 *   - on /data: a Dataset whose anchor is not on the page, whose name is not one of the
 *     page's own `<h2>` headings, or a heading the catalog does not list.
 *
 * Runs in `postbuild`, so every Vercel build checks it. Blog posts are server-rendered and
 * so are not in the static output; their Article block is pinned by the unit tests instead.
 */

/* eslint-disable no-console, no-undef -- standalone build script */

import { realpathSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const PAGES_DIR = path.join(process.cwd(), '.next', 'server', 'pages');

const KNOWN_TYPES = new Set(['Organization', 'WebSite', 'FAQPage', 'DataCatalog', 'Article']);

const collectHtmlFiles = async (dir) => {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return collectHtmlFiles(full);
      return entry.name.endsWith('.html') ? [full] : [];
    })
  );
  return files.flat();
};

const decodeEntities = (text) =>
  text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');

const normalise = (text) => decodeEntities(text).replace(/\s+/g, ' ').trim();

/**
 * The raw text of every `application/ld+json` block on a page. Next.js stamps its own
 * attributes onto head tags (`data-next-head`), so the tag is matched on its type only.
 */
export const extractBlocks = (html) =>
  [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(
    (m) => m[1]
  );

/** Visible `<h2>` headings, as text. */
const headingsOf = (html) =>
  [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m) =>
    normalise(m[1].replace(/<[^>]+>/g, ''))
  );

/** Every element id on the page — the set of anchors a `#fragment` can resolve to. */
const anchorsOf = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

const checkOrganization = (data, errors) => {
  for (const field of ['name', 'url', 'logo']) {
    if (typeof data[field] !== 'string' || !data[field]) {
      errors.push(`Organization: missing ${field}`);
    }
  }
  if (!Array.isArray(data.sameAs) || data.sameAs.length === 0) {
    errors.push('Organization: sameAs is empty');
  }
};

const checkWebSite = (data, errors) => {
  if (!data.name || !data.url) errors.push('WebSite: missing name or url');
  if (!data.publisher?.['@id'])
    errors.push('WebSite: no publisher @id — it should point at the Organization');
};

const checkFaqPage = (data, errors) => {
  if (!Array.isArray(data.mainEntity) || data.mainEntity.length === 0) {
    errors.push('FAQPage: no questions');
    return;
  }
  data.mainEntity.forEach((q, i) => {
    if (q?.['@type'] !== 'Question' || !q.name) errors.push(`FAQPage: question ${i} has no name`);
    if (!q?.acceptedAnswer?.text) errors.push(`FAQPage: "${q?.name ?? i}" has no answer text`);
  });
};

const checkDataCatalog = (data, html, errors) => {
  if (!Array.isArray(data.dataset) || data.dataset.length === 0) {
    errors.push('DataCatalog: no datasets');
    return;
  }
  const anchors = anchorsOf(html);
  const headings = headingsOf(html);
  const names = new Set();

  for (const dataset of data.dataset) {
    const fragment = String(dataset?.['@id'] ?? '').split('#')[1];
    if (!fragment) {
      errors.push(`Dataset "${dataset?.name}": @id has no #anchor`);
    } else if (!anchors.has(fragment)) {
      errors.push(`Dataset "${dataset?.name}": anchor #${fragment} is not on the page`);
    }
    if (!dataset?.name || !dataset?.description || !dataset?.url) {
      errors.push(`Dataset #${fragment}: missing name, description or url`);
    }
    // The name must be the section's own heading, verbatim — that is what ties the
    // record to the methodology a reader will find at the anchor.
    if (dataset?.name && !headings.includes(dataset.name)) {
      errors.push(`Dataset "${dataset.name}": no <h2> with that text on the page`);
    }
    names.add(dataset?.name);
  }
  // And the other direction: a section added to the page without a record is a metric
  // with no citation target.
  for (const heading of headings) {
    if (!names.has(heading)) errors.push(`Section "${heading}" has no Dataset record`);
  }
};

const checkArticle = (data, errors) => {
  for (const field of ['headline', 'mainEntityOfPage']) {
    if (!data[field]) errors.push(`Article: missing ${field}`);
  }
  if (!data.publisher) errors.push('Article: missing publisher');
};

/**
 * Checks one built page. Returns the errors found and how many blocks of each type it
 * saw, so the caller can report coverage rather than only failures.
 */
export const checkPage = (html, { isHomepage = false } = {}) => {
  const errors = [];
  const counts = {};

  for (const raw of extractBlocks(html)) {
    let data;
    try {
      data = JSON.parse(raw);
    } catch (error) {
      errors.push(`block does not parse: ${error.message}`);
      continue;
    }
    if (data['@context'] !== 'https://schema.org') {
      errors.push(`block has @context ${JSON.stringify(data['@context'])}`);
    }
    // `Meta` publishes the Organization and WebSite as one `@graph`; everything else is a
    // single typed block. Check each entity the same way either way.
    const entities = Array.isArray(data['@graph']) ? data['@graph'] : [data];
    for (const entity of entities) {
      const type = entity?.['@type'];
      if (!KNOWN_TYPES.has(type)) {
        errors.push(`block has unexpected @type ${JSON.stringify(type)}`);
        continue;
      }
      counts[type] = (counts[type] ?? 0) + 1;

      if (type === 'Organization') checkOrganization(entity, errors);
      if (type === 'WebSite') checkWebSite(entity, errors);
      if (type === 'FAQPage') checkFaqPage(entity, errors);
      if (type === 'DataCatalog') checkDataCatalog(entity, html, errors);
      if (type === 'Article') checkArticle(entity, errors);
    }
  }

  // `Meta` declares the Organization and WebSite on the homepage only — that is the page
  // search engines read the site name and logo from. Exactly one of each there; none
  // anywhere else, or `Meta`'s route gate has broken.
  for (const type of ['Organization', 'WebSite']) {
    const expected = isHomepage ? 1 : 0;
    if ((counts[type] ?? 0) !== expected) {
      const where = isHomepage ? 'homepage' : 'page';
      errors.push(`${where} has ${counts[type] ?? 0} ${type} block(s), expected ${expected}`);
    }
  }

  return { errors, counts };
};

const main = async () => {
  const files = await collectHtmlFiles(PAGES_DIR);
  if (files.length === 0) {
    console.error(`No built pages under ${PAGES_DIR}. Run \`next build\` first.`);
    process.exit(1);
  }

  const verbose = process.argv.includes('--verbose');
  const totals = {};
  const failures = [];

  for (const file of files) {
    const html = await readFile(file, 'utf8');
    const page = path.relative(PAGES_DIR, file).replace(/\\/g, '/');
    const { errors, counts } = checkPage(html, { isHomepage: page === 'index.html' });
    for (const [type, n] of Object.entries(counts)) totals[type] = (totals[type] ?? 0) + n;
    if (verbose && Object.keys(counts).length) {
      console.log(`  ${page}: ${JSON.stringify(counts)}`);
    }
    for (const error of errors) failures.push({ page, error });
  }

  const summary = Object.entries(totals)
    .map(([type, n]) => `${n} ${type}`)
    .join(', ');
  console.log(`Checked ${files.length} built page(s): ${summary || 'no JSON-LD found'}.`);

  if (failures.length > 0) {
    console.error('\nStructured data problems:\n');
    for (const { page, error } of failures) console.error(`  ${page}: ${error}`);
    process.exit(1);
  }

  // A build with no Organization at all is a broken `Meta`, not a clean run.
  if (!totals.Organization) {
    console.error('No Organization block on the homepage. Is <Meta> still rendering its JSON-LD?');
    process.exit(1);
  }

  console.log('All structured data is well-formed and anchored.');
};

// Only when invoked directly, so the test module can import `checkPage`. `process.argv[1]`
// is not realpath'd while `import.meta.url` is, so resolve it — otherwise a symlinked
// invocation would print nothing and exit 0.
if (process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
