import S from '@sanity/desk-tool/structure-builder'
import {HiOutlinePuzzle} from 'react-icons/hi'

const exercises = S.listItem()
  .title('Videos')
  .icon(HiOutlinePuzzle)
  .child(S.documentTypeList('videoResource').title('All Videos'))

export default exercises
