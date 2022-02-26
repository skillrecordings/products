const bundles = require('./bundles.development.json')
const find = require('lodash/find')
const isEmpty = require('lodash/isEmpty')
const compact = require('lodash/compact')

require('dotenv').config({
  path: `.env.local`,
})

module.exports = [
  {
    index: 0,
    resource_id: process.env.NEXT_PUBLIC_PRO_SLUG,
    type: 'bundle',
  },
  {
    index: 1,
    resource_id: process.env.NEXT_PUBLIC_BOOK_SLUG,
    type: 'bundle',
  },
  ...compact(
    find(bundles, {slug: process.env.NEXT_PUBLIC_PRO_SLUG}).items.map(
      (module, i) => {
        if (isEmpty(module.slug)) {
          return
        }
        return {
          index: i,
          resource_id: module.slug,
          type: 'collection',
        }
      },
    ),
  ),
]
