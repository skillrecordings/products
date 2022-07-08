import S from '@sanity/desk-tool/structure-builder'
import articles from './src/structure/articles'

const hiddenDocTypes = (listItem) =>
  !['tag', 'article', 'skosConcept', 'skosConceptScheme'].includes(
    listItem.getId(),
  )

export default () =>
  S.list()
    .title('TypeScript Course')
    .items([
      ...S.documentTypeListItems().filter(hiddenDocTypes),
      articles,
      S.divider(),
      S.documentTypeListItem('skosConcept').title('Concepts'),
      S.documentTypeListItem('skosConceptScheme').title('Taxonomy Schemes'),
    ])
