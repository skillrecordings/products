import {HiOutlinePlay} from 'react-icons/hi'

const exercises = (S) =>
  S.listItem()
    .title('Videos')
    .icon(HiOutlinePlay)
    .child(S.documentTypeList('videoResource').title('All Videos'))

export default exercises
