import { getLimitedText } from 'common-util/getLimitedText';
import { getSiteUrl } from 'common-util/getSiteUrl';
import Head from 'next/head';

const TITLE_CHAR_MAX = 55;

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
};

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

const Meta = ({ pageTitle, description, siteImageUrl, ogPath }: MetaProps) => {
  let title = pageTitle ? `${pageTitle} | ${SITE_TITLE}` : SITE_TITLE;

  if (title.length > TITLE_CHAR_MAX) {
    description = `Discover ${pageTitle}`;

    title = `${getLimitedText(pageTitle, TITLE_CHAR_MAX)} | Olas`;
  }

  const shareImage = resolveShareImage(siteImageUrl, ogPath);

  return (
    <Head>
      <title>{title}</title>

      <meta name="title" content={title} />
      <meta name="description" content={description || SITE_DESCRIPTION} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={SITE_URL} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description || SITE_DESCRIPTION} />
      <meta property="og:image" content={shareImage} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={SITE_URL} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description || SITE_DESCRIPTION} />
      <meta property="twitter:image" content={shareImage} />
    </Head>
  );
};

export default Meta;
