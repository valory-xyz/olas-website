#!/usr/bin/env node
/**
 * Post-build check: `public/llms.txt` still points at pages that exist.
 *
 * llms.txt is prose about the site, written by hand and read by nobody on the team once
 * it ships — which is how operate's went on naming agents for months after they were
 * renamed, and pearl's missed two product launches. Prose cannot be checked, but links
 * can: every URL in the file that points at this site must resolve to a built page, a
 * static file, or a redirect, and every `#fragment` must be an id on that page.
 *
 * It also requires a `last-updated:` line, so a reader (human or model) can tell how
 * stale the prose might be, and so a future check can compare it against the routes.
 *
 * Runs in `postbuild`, so every Vercel build checks it.
 */

/* eslint-disable no-console, no-undef -- standalone build script */

import { existsSync, realpathSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const PAGES_DIR = path.join(ROOT, '.next', 'server', 'pages');
const PUBLIC_DIR = path.join(ROOT, 'public');
const LLMS_PATH = path.join(PUBLIC_DIR, 'llms.txt');

/** Hosts this file speaks for. Links elsewhere are somebody else's to check. */
const OWN_HOSTS = new Set(['olas.network', 'www.olas.network']);

/** Every `https://…` URL in the text, without trailing punctuation from the prose. */
export const extractUrls = (text) =>
  [...text.matchAll(/https?:\/\/[^\s)\]>"']+/g)].map((m) => m[0].replace(/[.,;:]+$/, ''));

export const readLastUpdated = (text) => {
  const match = text.match(/^last-updated:\s*(\d{4}-\d{2}-\d{2})\s*$/m);
  if (!match) return null;
  const date = new Date(`${match[1]}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : match[1];
};

/**
 * Redirect sources from `next.config.js`, so a link to a legacy path that the site still
 * honours (`/protocol` → `/stack`) is not reported as dead.
 */
const loadRedirectSources = async () => {
  try {
    const config = (await import(pathToFileURL(path.join(ROOT, 'next.config.js')).href)).default;
    const redirects = typeof config.redirects === 'function' ? await config.redirects() : [];
    return new Set(redirects.map((r) => r.source));
  } catch (error) {
    console.warn(`[check-llms] could not read redirects from next.config.js: ${error.message}`);
    return new Set();
  }
};

/**
 * Where a site path resolves: a prerendered page, a static file, a redirect — or nowhere.
 * Returns the built HTML for a page so its anchors can be checked too.
 */
export const resolvePath = async (pathname, { pagesDir, publicDir, redirectSources }) => {
  const clean = decodeURIComponent(pathname.replace(/\/$/, '') || '/');
  const candidates =
    clean === '/'
      ? [path.join(pagesDir, 'index.html')]
      : [path.join(pagesDir, `${clean}.html`), path.join(pagesDir, clean, 'index.html')];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return { kind: 'page', html: await readFile(candidate, 'utf8') };
  }
  if (clean !== '/' && existsSync(path.join(publicDir, clean))) return { kind: 'file' };
  if (redirectSources.has(clean)) return { kind: 'redirect' };
  // A server-rendered dynamic route (`/blog/[id]`) has no HTML in the static output, so
  // the slug cannot be verified here — only that the route exists to serve it.
  const parent = path.dirname(clean);
  const dynamicDir = path.join(pagesDir, parent);
  if (existsSync(dynamicDir)) {
    const { readdirSync } = await import('node:fs');
    if (readdirSync(dynamicDir).some((name) => /^\[.+\]\.js$/.test(name))) {
      return { kind: 'dynamic' };
    }
  }
  return null;
};

const hasAnchor = (html, id) =>
  new RegExp(`\\sid="${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`).test(html);

/**
 * Checks one llms.txt. `resolve` is injected so the fixtures can stand in for a build.
 */
export const checkLlms = async (text, resolve) => {
  const errors = [];

  if (!readLastUpdated(text)) {
    errors.push('no `last-updated: YYYY-MM-DD` line');
  }

  const seen = new Set();
  for (const url of extractUrls(text)) {
    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      errors.push(`unparseable URL ${url}`);
      continue;
    }
    if (!OWN_HOSTS.has(parsed.hostname)) continue;
    const key = `${parsed.pathname}#${parsed.hash}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const target = await resolve(parsed.pathname);
    if (!target) {
      errors.push(`${url} — no page, file or redirect at ${parsed.pathname}`);
      continue;
    }
    const fragment = parsed.hash.slice(1);
    if (fragment && target.kind === 'page' && !hasAnchor(target.html, fragment)) {
      errors.push(`${url} — page exists but has no element with id="${fragment}"`);
    }
  }

  return { errors, checked: seen.size };
};

const main = async () => {
  if (!existsSync(PAGES_DIR)) {
    console.error(`No built pages under ${PAGES_DIR}. Run \`next build\` first.`);
    process.exit(1);
  }
  const text = await readFile(LLMS_PATH, 'utf8');
  const redirectSources = await loadRedirectSources();
  const { errors, checked } = await checkLlms(text, (pathname) =>
    resolvePath(pathname, { pagesDir: PAGES_DIR, publicDir: PUBLIC_DIR, redirectSources })
  );

  console.log(
    `Checked ${checked} own-site link(s) in llms.txt (last-updated: ${readLastUpdated(text) ?? 'missing'}).`
  );
  if (errors.length) {
    console.error('\nllms.txt problems:\n');
    for (const error of errors) console.error(`  ${error}`);
    process.exit(1);
  }
  console.log('llms.txt links all resolve.');
};

if (process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
