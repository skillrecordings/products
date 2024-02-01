import S from '@sanity/desk-tool/structure-builder'
import {HiOutlinePuzzle} from 'react-icons/hi'

const lessons = S.listItem()
  .title('Lessons')
  .icon(HiOutlinePuzzle)
  .child(S.documentTypeList('lesson').title('All Lessons'))

export default lessons
