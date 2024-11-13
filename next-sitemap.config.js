module.exports = {
  siteUrl: 'https://olas.network',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  exclude: ['/server-sitemap.xml'],
  robotsTxtOptions: {
    additionalSitemaps: ['https://olas.network/server-sitemap.xml'],
  },
};
