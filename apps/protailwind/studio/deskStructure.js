import S from '@sanity/desk-tool/structure-builder'
import articles from './src/structure/articles'
import tips from './src/structure/tips'
import videoResources from './src/structure/videoResources'

const hiddenDocTypes = (listItem) =>
  ![
    'article',
    'tip',
    'videoResource',
    'skosConcept',
    'skosConceptScheme',
  ].includes(listItem.getId())

export default () =>
  S.list()
    .title('Pro Tailwind Content')
    .items([
      ...S.documentTypeListItems().filter(hiddenDocTypes),
      articles,
      tips,
      videoResources,
      S.divider(),
      S.documentTypeListItem('skosConcept').title('Concepts'),
      S.documentTypeListItem('skosConceptScheme').title('Taxonomy Schemes'),
    ])
