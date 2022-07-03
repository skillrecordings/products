import S from '@sanity/desk-tool/structure-builder'
import articles from './src/structure/articles'

const hiddenDocTypes = (listItem) =>
  !['tag', 'article'].includes(listItem.getId())

export default () =>
  S.list()
    .title('TypeScript Course')
    .items([...S.documentTypeListItems().filter(hiddenDocTypes), articles])
