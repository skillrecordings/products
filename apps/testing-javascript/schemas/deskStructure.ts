import articles from './structure/articles'
import tips from './structure/tips'
import tutorials from './structure/tutorials'
import workshops from './structure/workshops'
import pricing from './structure/pricing'
import products from './structure/products'
import testimonials from './structure/testimonials'
import faqs from './structure/faqs'

const hiddenDocTypes = (listItem: any) =>
  !['module', 'tip', 'pricing', 'products', 'article'].includes(
    listItem.getId(),
  )

export default (S: any) =>
  S.list()
    .title('Testing JavaScript')
    .items([
      pricing(S),
      products(S),
      S.divider(),
      workshops(S),
      tutorials(S),
      S.divider(),
      tips(S),
      articles(S),
      S.divider(),
      testimonials(S),
      faqs(S),
      S.divider(),
      ...S.documentTypeListItems().filter(hiddenDocTypes),
    ])
