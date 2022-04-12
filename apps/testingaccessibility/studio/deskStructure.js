import S from '@sanity/desk-tool/structure-builder'
import workshops from './src/structure/workshops'
import reviews from './src/structure/accessibility-reviews'
import sections from './src/structure/sections'
import lessons from './src/structure/lessons'
import modules from './src/structure/modules'
import packages from './src/structure/packages'

const hiddenDocTypes = (listItem) =>
  !['workshop', 'review', 'package', 'module', 'section', 'lesson'].includes(
    listItem.getId(),
  )

export default () =>
  S.list()
    .title('Testing Accessibility')
    .items([
      ...S.documentTypeListItems().filter(hiddenDocTypes),
      packages,
      modules,
      sections,
      lessons,
      workshops,
      reviews,
    ])
