module.exports = {
  siteUrl: 'https://olas.network',
  generateRobotsTxt: true,
  exclude: ['/server-sitemap.xml'], 
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://olas.network/server-sitemap.xml', 
    ],
  },
}