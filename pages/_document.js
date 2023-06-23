import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (

    <Html lang="en">
      <body>
        <Head>
          <meta name="title" content="Olas" />
          <meta name="description" content="The unified network for off-chain services, e.g. automation, relayers and co-owned AI. Coordinated by OLAS, powered by autonomous agents." />

          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://olas.network" />
          <meta property="og:title" content="Olas" />
          <meta property="og:description" content="The unified network for off-chain services, e.g. automation, relayers and co-owned AI. Coordinated by OLAS, powered by autonomous agents." />
          <meta property="og:image" content="/images/meta-tag.png" />

          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://metatags.io" />
          <meta property="twitter:title" content="Olas" />
          <meta property="twitter:description" content="The unified network for off-chain services, e.g. automation, relayers and co-owned AI. Coordinated by OLAS, powered by autonomous agents." />
          <meta property="twitter:image" content="/images/meta-tag.png" />
        </Head>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
