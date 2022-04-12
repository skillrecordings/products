import S from '@sanity/desk-tool/structure-builder'
import {MdOutlineHorizontalSplit} from 'react-icons/md'

const sections = S.listItem()
  .title('Sections')
  .icon(MdOutlineHorizontalSplit)
  .child(
    S.list()
      .title('Sections')
      .items([
        S.documentTypeListItem('section')
          .title('All Sections')
          .icon(MdOutlineHorizontalSplit),
      ]),
  )

export default sections
