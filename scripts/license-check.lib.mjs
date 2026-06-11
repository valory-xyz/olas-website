/**
 * Pure helpers extracted from license-check.mjs so they can be unit-tested
 * without firing the script's top-level side effects (allowlist load,
 * checker.init scan, process.exit). Imported by both the script and
 * license-check.test.mjs.
 *
 * No I/O, no exit, no global state — same input → same output.
 */

/* eslint-disable no-undef -- standalone module: uses JS built-in globals (works across legacy + flat eslint configs) */

// Aliases for npm-ecosystem license strings that mean an SPDX identifier
// but don't match it character-for-character. Lower-cased on both sides.
export const NORMALIZE = new Map([
  ['apache2', 'Apache-2.0'],
  ['apache 2.0', 'Apache-2.0'],
  ['apache license 2.0', 'Apache-2.0'],
  ['apache license, version 2.0', 'Apache-2.0'],
  ['apache license version 2.0', 'Apache-2.0'],
  ['apache software license', 'Apache-2.0'],
  ['expat', 'MIT'],
  ['mit license', 'MIT'],
  ['new bsd', 'BSD-3-Clause'],
  ['(new) bsd', 'BSD-3-Clause'],
  ['simplified bsd', 'BSD-2-Clause'],
  ['3-clause bsd', 'BSD-3-Clause'],
  ['bsd 3-clause', 'BSD-3-Clause'],
]);

/**
 * Strip surrounding parens AND the trailing `*` that license-checker-rseidelsohn
 * appends when the SPDX was inferred from the LICENSE file rather than declared
 * in package.json. Apply alias map case-insensitively. Lookup must succeed on
 * `MIT*` and `Apache2` the same as on `MIT` / `Apache-2.0`.
 */
export function normalize(token) {
  const t = String(token)
    .replace(/^[()]+|[()]+$/g, '')
    .replace(/\*+$/, '')
    .trim();
  return NORMALIZE.get(t.toLowerCase()) || t;
}

function classifyId(tok, allowedSet, unauthorizedSet) {
  const t = normalize(tok);
  if (allowedSet.has(t)) return 'allowed';
  if (unauthorizedSet.has(t)) return 'unauthorized';
  return 'unknown';
}

// OR: any allowed → allowed; else all unauthorized → unauthorized; else unknown.
const combineOr = (parts) =>
  parts.some((p) => p === 'allowed')
    ? 'allowed'
    : parts.length && parts.every((p) => p === 'unauthorized')
      ? 'unauthorized'
      : 'unknown';

// AND: any unauthorized → unauthorized; else all allowed → allowed; else unknown.
const combineAnd = (parts) =>
  parts.some((p) => p === 'unauthorized')
    ? 'unauthorized'
    : parts.length && parts.every((p) => p === 'allowed')
      ? 'allowed'
      : 'unknown';

/**
 * Evaluate an SPDX license expression against the allow/deny lists.
 * Returns 'allowed' | 'unauthorized' | 'unknown'.
 *
 * A paren-aware recursive-descent parser with correct SPDX precedence:
 * parens override; AND binds tighter than OR (`A AND B OR C` === `(A AND B) OR C`).
 * A flat string split is NOT paren-aware and mis-evaluates e.g.
 * `GPL-3.0 AND (MIT OR Apache-2.0)` — that whole expression is unauthorized.
 *
 * - Array (npm legacy dual-license) → OR of its elements.
 * - Operators (AND/OR/WITH) are matched CASE-SENSITIVELY — SPDX requires them
 *   uppercase — so free-text like "MIT or commercial" is NOT parsed as OR.
 * - `WITH <exception>` → the exception is ignored; the base id decides.
 * - Unbalanced parens, leftover tokens, or anything unparseable → 'unknown'
 *   (fail closed, PARANOID).
 */
export function evalExpr(raw, allowedSet, unauthorizedSet) {
  if (raw == null) return 'unknown';
  if (Array.isArray(raw)) return combineOr(raw.map((x) => evalExpr(x, allowedSet, unauthorizedSet)));

  const s = String(raw).trim();
  if (!s || /^UNKNOWN$/i.test(s) || /^UNLICENSED$/i.test(s) || /^Custom:/i.test(s)) return 'unknown';

  const tokens = s.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ').trim().split(/\s+/).filter(Boolean);
  let pos = 0;

  // atom := '(' orExpr ')' | <license-id> [ 'WITH' <exception> ]
  function atom() {
    const t = tokens[pos];
    if (t === '(') {
      pos += 1;
      const r = orExpr();
      if (tokens[pos] !== ')') return null; // unbalanced
      pos += 1;
      return r;
    }
    if (t === ')' || t === undefined) return null; // misplaced
    pos += 1;
    while (tokens[pos] === 'WITH') pos += 2; // skip `WITH <exception>`
    return classifyId(t, allowedSet, unauthorizedSet);
  }
  function andExpr() {
    const acc = [atom()];
    while (tokens[pos] === 'AND') {
      pos += 1;
      acc.push(atom());
    }
    if (acc.some((x) => x === null)) return null;
    return acc.length === 1 ? acc[0] : combineAnd(acc);
  }
  function orExpr() {
    const acc = [andExpr()];
    while (tokens[pos] === 'OR') {
      pos += 1;
      acc.push(andExpr());
    }
    if (acc.some((x) => x === null)) return null;
    return acc.length === 1 ? acc[0] : combineOr(acc);
  }

  const result = orExpr();
  if (result === null || pos !== tokens.length) return 'unknown'; // leftover / unbalanced
  return result;
}
