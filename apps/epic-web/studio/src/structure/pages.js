import S from '@sanity/desk-tool/structure-builder'
import {FcHome} from 'react-icons/fc'

const pages = S.listItem()
  .title('Pages')
  .icon(FcHome)
  .child(S.documentTypeList('page').title('All Pages'))

export default pages
