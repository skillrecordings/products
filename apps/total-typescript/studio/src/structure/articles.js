import S from '@sanity/desk-tool/structure-builder'
import {MdArticle} from 'react-icons/md'

const articles = S.listItem()
  .title('Articles')
  .icon(MdArticle)
  .child(S.documentTypeList('article').title('All Articles'))

export default articles
