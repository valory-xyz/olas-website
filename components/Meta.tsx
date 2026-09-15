import { getLimitedText } from 'common-util/getLimitedText';
import { getSiteUrl } from 'common-util/getSiteUrl';
import Head from 'next/head';
import { useRouter } from 'next/router';

const TITLE_CHAR_MAX = 55;

const SITE_NAME = 'Olas';
const SITE_TITLE = 'Olas | Co-own AI';
const SITE_DESCRIPTION = 'Olas enables everyone to own and monetize their AI agents.';
const SITE_URL = getSiteUrl();
const SITE_DEFAULT_IMAGE_URL = `${SITE_URL}/images/meta-tag.webp`;

type MetaProps = {
  pageTitle?: string;
  description?: string;
  siteImageUrl?: string;
  /**
   * When set, `og:image` (and Twitter image) use Vercel OG at `/api/og/...`.
   * Use `''` for the home card (`/api/og`). Ignored when `siteImageUrl` is a non-empty URL.
   */
  ogPath?: string;
  /**
   * Overrides the canonical URL, which otherwise self-references the current
   * path. Set this on a page that is a variant of another to point at the one
   * that should rank.
   */
  canonicalPath?: string;
  /** Keeps the page out of search indexes. For interstitials and error states. */
  noindex?: boolean;
};

/** Strips the query string and trailing slash so canonicals stay stable. */
const toCanonicalUrl = (siteUrl: string, path: string): string => {
  const cleanPath = (path || '/').split('?')[0].split('#')[0].replace(/\/$/, '');
  return cleanPath === '' ? siteUrl : `${siteUrl}${cleanPath}`;
};

/**
 * Tells Google what to call the site in search results. Without an explicit
 * name it infers one from headings and third-party mentions, which is how the
 * homepage started showing as "OLAS Network" instead of "Olas". The
 * `WebSite` block is only read from the homepage, so it is emitted there alone.
 * The Organization is pinned to the production origin so it stays the one
 * entity every app-suite property points at, even when rendered on a preview.
 */
const ORGANIZATION_ID = 'https://olas.network/#organization';

const SITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: SITE_NAME,
      url: 'https://olas.network',
      logo: 'https://olas.network/images/olas-logo.svg',
      description: SITE_DESCRIPTION,
      sameAs: [
        'https://x.com/autonolas',
        'https://github.com/valory-xyz',
        'https://www.youtube.com/@autonolas',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { '@id': ORGANIZATION_ID },
    },
  ],
};

// `<` escaped so CMS-sourced text can never close the script tag.
const serializeJsonLd = (data: unknown): string => JSON.stringify(data).replace(/</g, '\\u003c');

const resolveShareImage = (
  siteImageUrl: string | undefined,
  ogPath: string | undefined
): string => {
  if (siteImageUrl) return siteImageUrl;
  if (typeof ogPath === 'string') {
    return `${SITE_URL}/api/og${ogPath === '' ? '' : `/${ogPath}`}`;
  }
  return SITE_DEFAULT_IMAGE_URL;
};

const Meta = ({
  pageTitle,
  description,
  siteImageUrl,
  ogPath,
  canonicalPath,
  noindex,
}: MetaProps) => {
  const router = useRouter();
  // `asPath` is the real URL the visitor is on; `pathname` would keep the
  // `[id]` placeholder and produce one shared canonical for every post.
  const canonicalUrl = toCanonicalUrl(SITE_URL, canonicalPath ?? router?.asPath ?? '/');

  let title = pageTitle ? `${pageTitle} | ${SITE_TITLE}` : SITE_TITLE;

  if (title.length > TITLE_CHAR_MAX) {
    description = `Discover ${pageTitle}`;

    title = `${getLimitedText(pageTitle, TITLE_CHAR_MAX)} | Olas`;
  }

  const shareImage = resolveShareImage(siteImageUrl, ogPath);
  const isHomepage = canonicalUrl === SITE_URL;

  return (
    <Head>
      <title>{title}</title>

      <meta name="title" content={title} />
      <meta name="description" content={description || SITE_DESCRIPTION} />

      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, follow" />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description || SITE_DESCRIPTION} />
      <meta property="og:image" content={shareImage} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description || SITE_DESCRIPTION} />
      <meta property="twitter:image" content={shareImage} />

      {isHomepage && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(SITE_JSON_LD) }}
        />
      )}
    </Head>
  );
};

export default Meta;
