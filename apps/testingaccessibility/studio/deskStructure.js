import S from '@sanity/desk-tool/structure-builder'
import workshops from './src/structure/workshops'

const hiddenDocTypes = (listItem) => !['workshop'].includes(listItem.getId())

export default () =>
  S.list()
    .title('Testing Accessibility')
    .items([...S.documentTypeListItems().filter(hiddenDocTypes), workshops])
