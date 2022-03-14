import S from '@sanity/desk-tool/structure-builder'
import workshops from './src/structure/workshops'
import reviews from './src/structure/accessibility-reviews'

const hiddenDocTypes = (listItem) =>
  !['workshop', 'review'].includes(listItem.getId())

export default () =>
  S.list()
    .title('Testing Accessibility')
    .items([
      ...S.documentTypeListItems().filter(hiddenDocTypes),
      workshops,
      reviews,
    ])
