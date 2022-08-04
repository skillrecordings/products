import S from '@sanity/desk-tool/structure-builder'
import posts from './src/structure/posts'
import modules from './src/structure/modules'
import products from './src/structure/products'
import pricing from './src/structure/pricing'

const hiddenDocTypes = (listItem) =>
  !['product', 'pricing', 'module', 'post'].includes(listItem.getId())

export default () =>
  S.list()
    .title('Engineering Management')
    .items([
      ...S.documentTypeListItems().filter(hiddenDocTypes),
      pricing,
      products,
      S.divider(),
      modules,
      S.divider(),
      posts,
    ])
