import articles from './structure/articles'
import tips from './structure/tips'
import tutorials from './structure/tutorials'
import workshops from './structure/workshops'
import pricing from './structure/pricing'
import products from './structure/products'
import pages from './structure/pages'
import lessons from './structure/lessons'
import exercises from './structure/exercises'
import explainers from './structure/explainers'
import videoResources from './structure/videoResources'
import sections from './structure/sections'
import links from './structure/links'

const hiddenDocTypes = (listItem: any) =>
  ![
    'module',
    'tip',
    'pricing',
    'product',
    'article',
    'page',
    'lesson',
    'exercise',
    'explainer',
    'videoResource',
    'section',
    'linkResource',
  ].includes(listItem.getId())

export default (S: any) =>
  S.list()
    .title('Studio')
    .items([
      pricing(S),
      products(S),
      S.divider(),
      workshops(S),
      tutorials(S),
      articles(S),
      pages(S),
      tips(S),
      S.divider(),
      lessons(S),
      exercises(S),
      explainers(S),
      videoResources(S),
      sections(S),
      links(S),
      S.divider(),
      ...S.documentTypeListItems().filter(hiddenDocTypes),
    ])
