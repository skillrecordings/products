import S from '@sanity/desk-tool/structure-builder'
import articles from './src/structure/articles'
import workshops from './src/structure/workshops'

const hiddenDocTypes = (listItem) =>
  !['module', 'article', 'skosConcept', 'skosConceptScheme'].includes(
    listItem.getId(),
  )

export default () =>
  S.list()
    .title('Escuela Frontend')
    .items([
      workshops,
      articles,
      S.divider(),
      ...S.documentTypeListItems().filter(hiddenDocTypes),
      S.divider(),
      S.documentTypeListItem('skosConcept').title('Concepts'),
      S.documentTypeListItem('skosConceptScheme').title('Taxonomy Schemes'),
    ])
