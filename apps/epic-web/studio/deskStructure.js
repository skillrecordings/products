import S from '@sanity/desk-tool/structure-builder'
import pages from './src/structure/pages'
import articles from './src/structure/articles'
import tips from './src/structure/tips'
import videoResources from './src/structure/videoResources'

const hiddenDocTypes = (listItem) =>
  ![
    'article',
    'page',
    'tip',
    'videoResource',
    'skosConcept',
    'skosConceptScheme',
  ].includes(listItem.getId())

export default () =>
  S.list()
    .title('Epic Web')
    .items([
      pages,
      articles,
      tips,
      S.divider(),
      videoResources,
      S.divider(),
      ...S.documentTypeListItems().filter(hiddenDocTypes),
      S.documentTypeListItem('skosConcept').title('Concepts'),
      S.documentTypeListItem('skosConceptScheme').title('Taxonomy Schemes'),
    ])
