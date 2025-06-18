const agentsData = require('./data/agents.json');

module.exports = {
  siteUrl: 'https://olas.network',
  generateRobotsTxt: true,
  sitemapSize: 5000,

  additionalPaths: () => {
    const agentsPaths = agentsData.map((agents) => ({
      loc: `/agents/${service.slug}`,
      changefreq: 'weekly',
    }));

    return agentsPaths;
  },
};
