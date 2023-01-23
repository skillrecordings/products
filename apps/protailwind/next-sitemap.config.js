require('dotenv-flow').config()
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: `https://www.protailwind.com`,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  generateRobotsTxt: true,
  exclude: [
    '/server-sitemap.xml',
    '/confirm',
    '/confirmed',
    '/excited',
    '/redirect',
    '/unsubscribed',
    '/answer',
    '/login',
    '/thanks/*',
    '/welcome',
    '/team',
    '/error',
    '/check-your-email',
    '_next/*',
  ],
  robotsTxtOptions: {
    additionalSitemaps: ['https://www.protailwind.com/server-sitemap.xml'],
  },
}
