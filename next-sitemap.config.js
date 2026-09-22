const agentsData = require('./data/agents.json');

/**
 * Agent slugs in `data/agents.json` that `next.config.js` redirects elsewhere.
 * They must not be listed in the sitemap: a sitemap should only contain URLs
 * that return 200, and a redirecting entry wastes crawl budget and dilutes the
 * signal for the page it redirects to.
 */
const REDIRECTED_AGENT_SLUGS = new Set([
  'prediction-agents', // -> /agents/omenstrat
  'optimus', // -> /agents/babydegen
  'optimus-agent', // -> /agents/babydegen
  'modius-agent', // -> /agents/babydegen
  'mech', // -> /agents/ai-mechs
]);

/**
 * Routes that exist as files under `pages/` — so next-sitemap finds them by
 * filesystem discovery — but must not be listed.
 *
 * The first two redirect in `next.config.js` while their page file remains, so
 * the sitemap advertises a URL that never returns 200. next-sitemap cannot see
 * the redirect table, so each has to be named here.
 *  - `/academy`  -> `/404` (retired)
 *  - `/protocol` -> `/stack` (301)
 *  - `/restricted`: the geo-block interstitial; also carries a noindex tag.
 */
const EXCLUDED_PATHS = ['/academy', '/protocol', '/restricted'];

/**
 * Blog posts live in the CMS and are rendered by `pages/blog/[id].tsx`, so
 * next-sitemap cannot discover them from the filesystem. Without this they are
 * absent from the sitemap entirely — the site's largest body of content, with
 * no crawl path to it.
 */
const getBlogPaths = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    console.warn('[sitemap] NEXT_PUBLIC_API_URL is not set — skipping blog posts.');
    return [];
  }

  try {
    // Strapi caps page size at 100 regardless of what `pagination[limit]` asks
    // for, so page through until `pageCount` is exhausted. Requesting 1000 in
    // one call silently returns only the first 100.
    const PAGE_SIZE = 100;
    const posts = [];
    let page = 1;
    let pageCount = 1;

    do {
      const url = `${apiUrl}/api/blog-posts?sort[0]=datePublished:desc&pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const json = await response.json();
      const batch = Array.isArray(json?.data) ? json.data : [];
      posts.push(...batch);

      pageCount = json?.meta?.pagination?.pageCount ?? 1;
      page += 1;
      // Guard against a malformed `pageCount` turning this into a long loop.
    } while (page <= pageCount && page <= 50);

    const paths = posts
      // Fall back to the numeric id: `getBlog` resolves either, and a post with
      // no slug is still better linked than not linked at all.
      .map((post) => ({ slug: post?.slug || post?.id, date: post?.datePublished }))
      .filter((post) => Boolean(post.slug))
      .map((post) => ({
        loc: `/blog/${post.slug}`,
        changefreq: 'monthly',
        // Posts are immutable once published, so the publication date is the
        // honest lastmod. Omit it rather than send today's date.
        ...(post.date ? { lastmod: new Date(post.date).toISOString() } : {}),
      }));

    console.log(`[sitemap] added ${paths.length} blog posts.`);
    return paths;
  } catch (error) {
    // A CMS blip must not fail the production build. The sitemap regenerates on
    // every deploy, so the posts return on the next successful one.
    console.warn(`[sitemap] could not fetch blog posts — skipping. ${error}`);
    return [];
  }
};

module.exports = {
  siteUrl: 'https://olas.network',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  exclude: EXCLUDED_PATHS,

  additionalPaths: async () => {
    const agentsPaths = agentsData
      .filter((agent) => !REDIRECTED_AGENT_SLUGS.has(agent.slug))
      .map((agent) => ({
        loc: `/agents/${agent.slug}`,
        changefreq: 'weekly',
      }));

    const blogPaths = await getBlogPaths();

    return [...agentsPaths, ...blogPaths];
  },
};
