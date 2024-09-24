import PropTypes from 'prop-types';
import Head from 'next/head';

const SITE_TITLE = 'Olas | Co-own AI';
const SITE_DESCRIPTION =
  'Olas enables everyone to own a share of AI, specifically autonomous agent economies.';
const SITE_URL = 'https://olas.network';
const SITE_DEFAULT_IMAGE_URL = `${SITE_URL}/images/meta-tag.png`;

const Meta = ({ pageTitle, description, siteImageUrl }) => {
  const title = pageTitle ? `${pageTitle} | ${SITE_TITLE}` : SITE_TITLE;

  return (
    <Head>
      <title>{title}</title>

      <meta name="title" content={title} />
      <meta name="description" content={description || SITE_DESCRIPTION} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={SITE_URL} />
      <meta property="og:title" content={title} />
      <meta
        property="og:description"
        content={description || SITE_DESCRIPTION}
      />
      <meta property="og:image" content={siteImageUrl} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={SITE_URL} />
      <meta property="twitter:title" content={title} />
      <meta
        property="twitter:description"
        content={description || SITE_DESCRIPTION}
      />
      <meta property="twitter:image" content={siteImageUrl} />
    </Head>
  );
};

Meta.propTypes = {
  pageTitle: PropTypes.string,
  description: PropTypes.string,
  siteImageUrl: PropTypes.string,
};
Meta.defaultProps = {
  pageTitle: null,
  description: SITE_DESCRIPTION,
  siteImageUrl: SITE_DEFAULT_IMAGE_URL,
};
export default Meta;
