import S from '@sanity/desk-tool/structure-builder'
import execises from './src/structure/exercises'
import tips from './src/structure/tips'
import tutorials from './src/structure/tutorials'

const hiddenDocTypes = (listItem) =>
  !['module', 'tip', 'skosConcept', 'skosConceptScheme'].includes(
    listItem.getId(),
  )

export default () =>
  S.list()
    .title('Total TypeScript')
    .items([
      tutorials,
      S.divider(),
      tips,
      S.divider(),
      S.documentTypeListItem('skosConcept').title('Concepts'),
      S.documentTypeListItem('skosConceptScheme').title('Taxonomy Schemes'),
      S.divider(),
      ...S.documentTypeListItems().filter(hiddenDocTypes),
    ])
