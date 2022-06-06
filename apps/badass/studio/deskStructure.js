import S from '@sanity/desk-tool/structure-builder'
import workshops from './src/structure/workshops'
import articles from './src/structure/articles'
import sections from './src/structure/sections'
import lessons from './src/structure/lessons'
import modules from './src/structure/modules'
import products from './src/structure/products'

const hiddenDocTypes = (listItem) =>
  ![
    'workshop',
    'product',
    'module',
    'section',
    'lesson',
    'tag',
    'article',
  ].includes(listItem.getId())

export default () =>
  S.list()
    .title('Badass Courses')
    .items([
      ...S.documentTypeListItems().filter(hiddenDocTypes),
      products,
      S.divider(),
      modules,
      sections,
      lessons,
      S.divider(),
      workshops,
      articles,
    ])
