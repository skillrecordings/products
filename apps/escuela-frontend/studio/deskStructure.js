import S from '@sanity/desk-tool/structure-builder'
import articles from './src/structure/articles'
import tutorials from './src/structure/tutorials'
import collaborators from './src/structure/collaborator'

const hiddenDocTypes = (listItem) =>
  ![
    'module',
    'article',
    'skosConcept',
    'skosConceptScheme',
    'collaborator',
  ].includes(listItem.getId())

export default () =>
  S.list()
    .title('Escuela Frontend')
    .items([
      tutorials,
      S.divider(),
      ...S.documentTypeListItems().filter(hiddenDocTypes),
      S.divider(),
      articles,
      S.divider(),
      S.documentTypeListItem('skosConcept').title('Concepts'),
      S.documentTypeListItem('skosConceptScheme').title('Taxonomy Schemes'),
      S.divider(),
      collaborators,
    ])
