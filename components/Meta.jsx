import Head from "next/head";

const SITE_TITLE = "Olas";
const SITE_DESCRIPTION = "The unified network for off-chain services, e.g. automation, relayers and co-owned AI. Coordinated by OLAS, powered by autonomous agents.";
const SITE_URL = "https://olas.network";
const SITE_IMAGE_PATH = `${SITE_URL}/images/meta-tag.png`;


const Meta = ({pageTitle}) => {
  const title = pageTitle ? `${pageTitle} | ${SITE_TITLE}` : SITE_TITLE;
  
  return (
    <Head>
      <meta name="title" content={title} />
      <meta
        name="description"
        content={SITE_DESCRIPTION}
      />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={SITE_URL} />
      <meta property="og:title" content={title} />
      <meta
        property="og:description"
        content={SITE_DESCRIPTION}
      />
      <meta property="og:image" content={SITE_IMAGE_PATH} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={SITE_URL} />
      <meta property="twitter:title" content={title} />
      <meta
        property="twitter:description"
        content={SITE_DESCRIPTION}
      />
      <meta property="twitter:image" content={SITE_IMAGE_PATH} />
    </Head>
  );
};
export default Meta;
