// pages/server-sitemap.xml/index.js
import { getServerSideSitemapLegacy } from 'next-sitemap';

export const getServerSideProps = async (ctx) => {
  // Fetch URLs from your API
  const response = await fetch('https://olas.network/api/urls');
  const urlsJson = await response.json();

  // Format the URLs into the structure required by the sitemap
  const fields = urlsJson.map((url) => ({
    loc: `https://olas.network${url}`,
    lastmod: new Date().toISOString(),
  }));

  // Add the homepage URL to the sitemap
  fields.push({
    loc: 'https://olas.network',
    lastmod: new Date().toISOString(),
  });

  // Generate and return the sitemap
  return getServerSideSitemapLegacy(ctx, fields);
};

// Default export to prevent Next.js errors
export default function Sitemap() {
  return null; // This page doesn't render anything, it only returns a sitemap
}
