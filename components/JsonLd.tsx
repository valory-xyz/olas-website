import { serializeJsonLd } from 'common-util/structured-data';
import Head from 'next/head';

/**
 * Publishes one JSON-LD block into the document head.
 *
 * Build the `data` with the helpers in `common-util/structured-data.ts` from the same
 * arrays and records the visible page renders — never a hand-typed copy — so the block
 * cannot say something the page does not. `yarn structured-data:check` reads every block
 * back out of the built HTML and fails on malformed or unanchored ones.
 */
export const JsonLd = ({ data }: { data: object }) => (
  <Head>
    <script
      type="application/ld+json"
      // The serialiser escapes `<`, so the payload cannot close this tag early.
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  </Head>
);
