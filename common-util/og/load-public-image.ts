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

export type OgImage = { src: string; width: number; height: number };

/** Read PNG dimensions from the IHDR chunk (bytes 16-23). */
function pngSize(buf: Buffer): { w: number; h: number } | null {
  if (buf.length < 24) return null;
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

/** Read JPEG dimensions by scanning for SOF0/SOF2 markers. */
function jpegSize(buf: Buffer): { w: number; h: number } | null {
  let i = 2;
  while (i < buf.length - 1) {
    if (buf[i] !== 0xff) break;
    const marker = buf[i + 1];
    if (marker === 0xc0 || marker === 0xc2) {
      if (i + 9 > buf.length) return null;
      return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5) };
    }
    const len = buf.readUInt16BE(i + 2);
    i += 2 + len;
  }
  return null;
}

/**
 * Load an image from `public/`, returning a data URL plus dimensions
 * scaled to a fixed `targetWidth` (height calculated proportionally).
 */
export function loadIllustration(publicPath: string, targetWidth: number): OgImage | null {
  const clean = publicPath.replace(/^\//, '');
  const abs = path.join(process.cwd(), 'public', clean);
  if (!fs.existsSync(abs)) return null;
  const ext = path.extname(abs).toLowerCase();
  const mime = MIME[ext];
  if (!mime) return null;

  const buf = fs.readFileSync(abs);
  const size = ext === '.png' ? pngSize(buf) : jpegSize(buf);
  if (!size || size.w === 0) return null;

  const scale = targetWidth / size.w;
  return {
    src: `data:${mime};base64,${buf.toString('base64')}`,
    width: targetWidth,
    height: Math.round(size.h * scale),
  };
}

export function pickBackgroundDataUrl(): string {
  return (
    getDataUrlForPublicPath(OG_BACKGROUND_IMAGE_PATH) ||
    // Minimal valid PNG (1×1) if no files exist under `public/` yet
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
  );
}
