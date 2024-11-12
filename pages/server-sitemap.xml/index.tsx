// pages/server-sitemap.xml/index.tsx
import { GetServerSideProps } from 'next';
import { getServerSideSitemapLegacy } from 'next-sitemap';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const urls = await fetch('https://olas.network/api/urls');
  const urlsJson = await urls.json();

  // Format the URLs into the structure required by the sitemap
  const fields = urlsJson.map((url: string) => ({
    loc: `https://olas.network${url}`,
    lastmod: new Date().toISOString(),
  }));

  fields.push({
    loc: 'https://olas.network',
    lastmod: new Date().toISOString(),
  });

  // Generate and return the sitemap
  return getServerSideSitemapLegacy(ctx, fields);
};

// Default export to prevent next.js errors
export default function Sitemap() {}
