// @ts-expect-error TS(1208) FIXME: 'next-sitemap.config.ts' cannot be compiled under ... Remove this comment to see the full error message
const agentsData = require('./data/agents.json');

module.exports = {
  siteUrl: 'https://olas.network',
  generateRobotsTxt: true,
  sitemapSize: 5000,

  additionalPaths: () => {
    const agentsPaths = agentsData.map((agents) => ({
      loc: `/agents/${agents.slug}`,
      changefreq: 'weekly',
    }));

    return agentsPaths;
  },
};
