import workshops from './structure/workshops'
import articles from './structure/articles'
import sections from './structure/sections'
import lessons from './structure/lessons'
import modules from './structure/modules'
import products from './structure/products'
import podcasts from './structure/podcasts'
import episodes from './structure/episodes'
import seasons from './structure/seasons'
import caseStudies from './structure/caseStudies'

const hiddenDocTypes = (listItem: any) =>
  ![
    'workshop',
    'product',
    'module',
    'section',
    'lesson',
    'tag',
    'article',
    'skosConcept',
    'skosConceptScheme',
    'podcast',
    'podcastEpisode',
    'podcastSeason',
    'caseStudies',
  ].includes(listItem.getId())

export default (S: any) =>
  S.list()
    .title('Badass Courses')
    .items([
      products(S),
      S.divider(),
      modules(S),
      sections(S),
      lessons(S),
      S.divider(),
      episodes(S),
      seasons(S),
      podcasts(S),
      S.divider(),
      workshops(S),
      articles(S),
      caseStudies(S),
      S.divider(),
      ...S.documentTypeListItems().filter(hiddenDocTypes),
      // S.documentTypeListItem('skosConcept').title('Concepts'),
      // S.documentTypeListItem('skosConceptScheme').title('Taxonomy Schemes'),
    ])
