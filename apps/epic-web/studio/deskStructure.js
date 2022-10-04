import S from '@sanity/desk-tool/structure-builder'
import pages from './src/structure/pages'
import articles from './src/structure/articles'

const hiddenDocTypes = (listItem) =>
  !['article', 'page', 'skosConcept', 'skosConceptScheme'].includes(
    listItem.getId(),
  )

export default () =>
  S.list()
    .title('Epic Web')
    .items([
      articles,
      S.divider(),
      pages,
      S.divider(),
      S.documentTypeListItem('skosConcept').title('Concepts'),
      S.documentTypeListItem('skosConceptScheme').title('Taxonomy Schemes'),
      S.divider(),
      ...S.documentTypeListItems().filter(hiddenDocTypes),
    ])
