import S from '@sanity/desk-tool/structure-builder'
import articles from './src/structure/articles'
import tips from './src/structure/tips'
import tutorials from './src/structure/tutorials'
import workshops from './src/structure/workshops'
import bonuses from './src/structure/bonuses'
import pricing from './src/structure/pricing'
import products from './src/structure/products'

const hiddenDocTypes = (listItem) =>
  ![
    'module',
    'tip',
    'skosConcept',
    'skosConceptScheme',
    'pricing',
    'products',
    'article',
  ].includes(listItem.getId())

export default () =>
  S.list()
    .title('Total TypeScript')
    .items([
      pricing,
      products,
      S.divider(),
      workshops,
      tutorials,
      bonuses,
      S.divider(),
      tips,
      articles,
      S.divider(),
      S.documentTypeListItem('skosConcept').title('Concepts'),
      S.documentTypeListItem('skosConceptScheme').title('Taxonomy Schemes'),
      S.divider(),
      ...S.documentTypeListItems().filter(hiddenDocTypes),
    ])
