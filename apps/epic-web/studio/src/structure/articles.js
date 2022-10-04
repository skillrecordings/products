import S from '@sanity/desk-tool/structure-builder'
import {FcDocument} from 'react-icons/fc'

const articles = S.listItem()
  .title('Articles')
  .icon(FcDocument)
  .child(S.documentTypeList('article').title('All Articles'))

export default articles
