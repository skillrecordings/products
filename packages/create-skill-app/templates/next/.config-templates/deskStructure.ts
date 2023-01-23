import articles from './structure/articles'
import tips from './structure/tips'
import tutorials from './structure/tutorials'
import workshops from './structure/workshops'
import pricing from './structure/pricing'
import products from './structure/products'

const hiddenDocTypes = (listItem: any) =>
  !['module', 'tip', 'pricing', 'products', 'article'].includes(
    listItem.getId(),
  )

export default (S: any) =>
  S.list()
    .title('{{appName}}')
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
      ...S.documentTypeListItems().filter(hiddenDocTypes),
    ])
