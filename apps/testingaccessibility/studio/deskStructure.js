import S from '@sanity/desk-tool/structure-builder'
import workshops from './src/structure/workshops'
import articles from './src/structure/articles'
import reviews from './src/structure/accessibility-reviews'
import sections from './src/structure/sections'
import lessons from './src/structure/lessons'
import modules from './src/structure/modules'
import products from './src/structure/products'
import videoResources from './src/structure/videoResources'

const hiddenDocTypes = (listItem) =>
  ![
    'workshop',
    'review',
    'product',
    'module',
    'section',
    'lesson',
    'videoResource',
    'tag',
    'article',
  ].includes(listItem.getId())

export default () =>
  S.list()
    .title('Testing Accessibility')
    .items([
      ...S.documentTypeListItems().filter(hiddenDocTypes),
      products,
      S.divider(),
      modules,
      sections,
      lessons,
      videoResources,
      S.divider(),
      workshops,
      articles,
      reviews,
    ])
