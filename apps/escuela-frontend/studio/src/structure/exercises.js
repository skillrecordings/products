import S from '@sanity/desk-tool/structure-builder'
import {HiOutlinePuzzle} from 'react-icons/hi'

const exercises = S.listItem()
  .title('Exercises')
  .icon(HiOutlinePuzzle)
  .child(S.documentTypeList('exercise').title('All Exercises'))

export default exercises
