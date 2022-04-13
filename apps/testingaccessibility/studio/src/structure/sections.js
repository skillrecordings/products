import S from '@sanity/desk-tool/structure-builder'
import {MdOutlineHorizontalSplit} from 'react-icons/md'

const sections = S.listItem()
  .title('Sections')
  .icon(MdOutlineHorizontalSplit)
  .child(S.documentTypeList('section').title('All Sections'))

export default sections
