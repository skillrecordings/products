import {HiPlay} from 'react-icons/hi'

const exercises = (S) =>
  S.listItem()
    .title('Videos')
    .icon(HiPlay)
    .child(S.documentTypeList('videoResource').title('All Videos'))

export default exercises
