const servicesData = require('./data/services.json');

module.exports = {
  siteUrl: 'https://olas.network',
  generateRobotsTxt: true,
  sitemapSize: 5000,

  additionalPaths: async (config) => {
    const servicesPaths = servicesData.map((service) => ({
      loc: `/services/${service.slug}`,
      changefreq: 'weekly',
    }));

    return servicesPaths;
  },
};
