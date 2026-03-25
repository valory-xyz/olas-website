import { ImageResponse } from '@vercel/og';
import { OG_CACHE_CONTROL } from 'common-util/og/constants';
import { loadIllustration, pickBackgroundDataUrl } from 'common-util/og/load-public-image';
import { loadOgSnapshotBundle } from 'common-util/og/load-snapshots';
import { OgImageTemplate } from 'common-util/og/OgImageTemplate';
import { getOgDefinition, getOgRouteKey } from 'common-util/og/registry';
import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

const interMedium = fs.readFileSync(
  path.join(process.cwd(), 'node_modules/@fontsource/inter/files/inter-latin-500-normal.woff')
);
const interSemiBold = fs.readFileSync(
  path.join(process.cwd(), 'node_modules/@fontsource/inter/files/inter-latin-600-normal.woff')
);

/**
 * Node runtime (not Edge): OG data loads Vercel Blob snapshots via `getSnapshot`, which pulls in
 * lodash — incompatible with Edge dynamic code limits.
 */

function parseSlugFromQuery(req: NextApiRequest): string[] {
  const slug = req.query.slug;
  if (slug === undefined) return [];
  return Array.isArray(slug) ? slug : [slug];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const routeKey = getOgRouteKey(parseSlugFromQuery(req));
    const definition = getOgDefinition(routeKey);

    if (!definition) {
      return res.status(404).end('Not found');
    }

    const bundle = await loadOgSnapshotBundle(definition.snapshots);
    const metrics = definition.buildMetrics?.(bundle) ?? [];

    const backgroundSrc = pickBackgroundDataUrl();
    if (!backgroundSrc.startsWith('data:') && !backgroundSrc.startsWith('http')) {
      throw new Error(`Invalid backgroundSrc for OG (expected data: or http URL)`);
    }

    const illustrationWidth = definition.illustrationWidth ?? 380;
    const illustration = routeKey
      ? loadIllustration(`/images/og/${routeKey}.png`, illustrationWidth) ??
        loadIllustration(`/images/og/${routeKey}/${routeKey.split('/').pop()}.png`, illustrationWidth)
      : null;

    const imageResponse = new ImageResponse(
      (
        <OgImageTemplate
          title={definition.title}
          description={definition.description}
          template={definition.template}
          metrics={metrics}
          backgroundSrc={backgroundSrc}
          illustration={illustration}
          illustrationPosition={definition.illustrationWidth ? 'inline' : 'side'}
        />
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          { name: 'Inter', data: interMedium, weight: 500, style: 'normal' },
          { name: 'Inter', data: interSemiBold, weight: 600, style: 'normal' },
        ],
      }
    );

    const contentType = imageResponse.headers.get('content-type') || 'image/png';
    const buffer = Buffer.from(await imageResponse.arrayBuffer());

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', OG_CACHE_CONTROL);
    res.status(200).send(buffer);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    console.error('[api/og]', message, stack);

    if (process.env.NODE_ENV === 'development') {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      return res.status(500).send(
        JSON.stringify(
          {
            error: 'OG image generation failed',
            message,
            stack,
            hint: 'Ensure BLOB_READ_WRITE_TOKEN is set for live metrics. Images use data: URLs from public/.',
          },
          null,
          2
        )
      );
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(500).send('OG image generation failed');
  }
}
