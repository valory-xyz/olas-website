import fs from 'fs';
import path from 'path';

import { OG_BACKGROUND_IMAGE_PATH } from './constants';

/**
 * Satori (used by @vercel/og) only supports PNG, JPEG, GIF, and SVG.
 * WebP is intentionally excluded — Satori cannot decode it and will throw.
 */
const MIME: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
};

/**
 * Read a file from `public/` and return a data URL for @vercel/og.
 * On the server, `<img src="/images/foo.png">` is invalid — Satori requires `http(s):` or `data:`.
 * Loading from disk avoids wrong Host/port when self-fetching (e.g. dev on :3001).
 */
export function getDataUrlForPublicPath(publicPath: string): string | null {
  const clean = publicPath.replace(/^\//, '');
  const abs = path.join(process.cwd(), 'public', clean);
  if (!fs.existsSync(abs)) return null;
  const ext = path.extname(abs).toLowerCase();
  const mime = MIME[ext];
  if (!mime) return null;
  const buf = fs.readFileSync(abs);
  return `data:${mime};base64,${buf.toString('base64')}`;
}

export function pickBackgroundDataUrl(): string {
  return (
    getDataUrlForPublicPath(OG_BACKGROUND_IMAGE_PATH) ||
    // Minimal valid PNG (1×1) if no files exist under `public/` yet
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
  );
}
