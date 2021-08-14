require('dotenv-flow').config()

module.exports = {
  siteUrl: `https://compilersforhumans.com`,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  generateRobotsTxt: true,
  exclude: [
    '/buy',
    '/answer',
    '/confirm',
    '/confirmed',
    '/excited',
    '/learn',
    '/login',
    '/thanks',
    '/invoice',
    '/article',
    '/redirect',
    '/assets',
    '/unsubscribed',
    '/video',
  ],
}
