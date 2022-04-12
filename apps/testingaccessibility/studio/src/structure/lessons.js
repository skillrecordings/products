import S from '@sanity/desk-tool/structure-builder'
import {HiOutlinePuzzle} from 'react-icons/hi'

const lessons = S.listItem()
  .title('Lessons')
  .icon(HiOutlinePuzzle)
  .child(
    S.list()
      .title('Lessons')
      .items([
        S.documentTypeListItem('lesson')
          .title('All Lessons')
          .icon(HiOutlinePuzzle),
      ]),
  )

export default lessons
