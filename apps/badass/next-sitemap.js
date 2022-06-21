require('dotenv-flow').config()
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: `https://badass.dev`,
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
  ],
  robotsTxtOptions: {
    additionalSitemaps: ['https://badass.dev/server-sitemap.xml'],
  },
}
