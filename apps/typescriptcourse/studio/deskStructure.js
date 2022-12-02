import S from '@sanity/desk-tool/structure-builder'
import articles from './src/structure/articles'
import podcasts from './src/structure/podcasts'
import tutorials from './src/structure/tutorials'
import videoResources from './src/structure/videoResources'

const hiddenDocTypes = (listItem) =>
  ![
    'tag',
    'article',
    'skosConcept',
    'skosConceptScheme',
    'podcast',
    'podcastEpisode',
    'podcastSeason',
    'module',
    'explainer',
    'videoResource',
  ].includes(listItem.getId())

export default () =>
  S.list()
    .title('TypeScript Course')
    .items([
      tutorials,
      articles,
      S.divider(),
      podcasts,
      S.divider(),
      ...S.documentTypeListItems().filter(hiddenDocTypes),
      S.documentTypeListItem('skosConcept').title('Concepts'),
      S.documentTypeListItem('skosConceptScheme').title('Taxonomy Schemes'),
    ])
