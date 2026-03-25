/** Canonical site origin for absolute OG asset URLs (must match Meta / production domain). */
export const OG_SITE_URL = 'https://olas.network';

/**
 * Full-bleed background for all OG cards. Point this at your shared OG background
 * (`public/images/og/background.png` or similar). Defaults to an existing site image so
 * generation works before custom assets exist.
 */
export const OG_BACKGROUND_IMAGE_PATH = '/images/og/background.png';

export const OG_CACHE_CONTROL = 'public, s-maxage=86400, stale-while-revalidate';

export const absUrl = (path: string) =>
  path.startsWith('http') ? path : `${OG_SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
