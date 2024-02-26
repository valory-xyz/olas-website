import Head from "next/head";

const SITE_TITLE = "Olas | Crypto's Ocean of Services";
const SITE_DESCRIPTION = "The unified network for off-chain services, e.g. automation, relayers and co-owned AI. Coordinated by OLAS, powered by autonomous agents.";
const SITE_URL = "https://olas.network";
const SITE_DEFAULT_IMAGE_URL = `${SITE_URL}/images/meta-tag.png`;


const Meta = ({pageTitle, siteImageUrl = SITE_DEFAULT_IMAGE_URL }) => {
  const title = pageTitle ? `${pageTitle} | ${SITE_TITLE}` : SITE_TITLE;
  
  return (
    <Head>
      <title key={"title"}>{title}</title>
      
      <meta name="title" content={title} key={"meta-title"}/>
      <meta
        key={"meta-description"}
        name="description"
        content={SITE_DESCRIPTION}
      />

      <meta property="og:type" content="website" key={"og-type"}/>
      <meta property="og:url" content={SITE_URL} key={"og-url"}/>
      <meta property="og:title" content={title} key={"og-title"}/>
      <meta
        key={"og-description"}
        property="og:description"
        content={SITE_DESCRIPTION}
      />
      <meta property="og:image" content={siteImageUrl} key={"og-image"} />

      <meta property="twitter:card" content="summary_large_image" key={"twitter-card"} />
      <meta property="twitter:url" content={SITE_URL} key={"twitter-url"}/>
      <meta property="twitter:title" content={title} key={"twitter-title"} />
      <meta
        key={"twitter-description"}
        property="twitter:description"
        content={SITE_DESCRIPTION}
      />
      <meta key={"twitter-image-alt"} 
        property="twitter:image" content={siteImageUrl} />
    </Head>
  );
};
export default Meta;
