import S from '@sanity/desk-tool/structure-builder'
import pages from './src/structure/pages'
import articles from './src/structure/articles'
import tips from './src/structure/tips'
import videoResources from './src/structure/videoResources'
import tutorials from './src/structure/tutorials'
import workshops from './src/structure/workshops'

const hiddenDocTypes = (listItem) =>
  ![
    'article',
    'tip',
    'videoResource',
    'skosConcept',
    'skosConceptScheme',
    'module',
    'testimonial',
    'section',
    'explainer',
    'bundles',
  ].includes(listItem.getId())

export default () =>
  S.list()
    .title('Epic Web')
    .items([
      pages,
      articles,
      workshops,
      tutorials,
      tips,
      S.divider(),
      videoResources,
      S.divider(),
      ...S.documentTypeListItems().filter(hiddenDocTypes),
      S.documentTypeListItem('skosConcept').title('Concepts'),
      S.documentTypeListItem('skosConceptScheme').title('Taxonomy Schemes'),
    ])
