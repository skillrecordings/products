import S from '@sanity/desk-tool/structure-builder'
import workshops from './src/structure/workshops'
import articles from './src/structure/articles'
import reviews from './src/structure/accessibility-reviews'
import sections from './src/structure/sections'
import lessons from './src/structure/lessons'
import modules from './src/structure/modules'
import products from './src/structure/products'
import pricing from './src/structure/pricing'

const hiddenDocTypes = (listItem) =>
  ![
    'workshop',
    'review',
    'product',
    'pricing',
    'module',
    'section',
    'lesson',
    'tag',
    'article',
  ].includes(listItem.getId())

export default () =>
  S.list()
    .title('Testing Accessibility')
    .items([
      ...S.documentTypeListItems().filter(hiddenDocTypes),
      pricing,
      products,
      S.divider(),
      modules,
      sections,
      lessons,
      S.divider(),
      workshops,
      articles,
      reviews,
    ])
