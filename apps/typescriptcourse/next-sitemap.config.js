require('dotenv-flow').config()

module.exports = {
  siteUrl: `https://typescriptcourse.com`,
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
}
