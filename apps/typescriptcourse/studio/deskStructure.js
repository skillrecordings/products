import S from '@sanity/desk-tool/structure-builder'
import articles from './src/structure/articles'
import podcasts from './src/structure/podcasts'

const hiddenDocTypes = (listItem) =>
  ![
    'tag',
    'article',
    'skosConcept',
    'skosConceptScheme',
    'skosConcept',
    'skosConceptScheme',
    'podcast',
    'podcastEpisode',
    'podcastSeason',
  ].includes(listItem.getId())

export default () =>
  S.list()
    .title('TypeScript Course')
    .items([
      ...S.documentTypeListItems().filter(hiddenDocTypes),
      articles,
      S.divider(),
      podcasts,
      S.divider(),
      S.documentTypeListItem('skosConcept').title('Concepts'),
      S.documentTypeListItem('skosConceptScheme').title('Taxonomy Schemes'),
    ])
