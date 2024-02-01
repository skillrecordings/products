import {HiOutlinePuzzle} from 'react-icons/hi'

const lessons = (S) =>
  S.listItem()
    .title('Lessons')
    .icon(HiOutlinePuzzle)
    .child(S.documentTypeList('lesson').title('All Lessons'))

export default lessons
