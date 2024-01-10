import {HiOutlinePuzzle} from 'react-icons/hi'

const exercises = (S) =>
  S.listItem()
    .title('Exercises')
    .icon(HiOutlinePuzzle)
    .child(S.documentTypeList('exercise').title('All Exercises'))

export default exercises
