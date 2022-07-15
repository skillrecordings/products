require('dotenv-flow').config()

module.exports = {
  siteUrl: `https://engmanagement.dev`,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  generateRobotsTxt: true,
  exclude: [
    '/answer',
    '/confirm',
    '/confirmed',
    '/excited',
    '/redirect',
    '/thanks',
    '/unsubscribed',
    '/article',
    '/buy',
    '/learn',
    '/invoice',
    '/login',
  ],
}
