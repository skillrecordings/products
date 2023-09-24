import {MdOutlineExtension} from 'react-icons/md'

const lessons = (S) =>
  S.listItem()
    .title('Lessons')
    .icon(MdOutlineExtension)
    .child(S.documentTypeList('lesson').title('All Lessons'))

export default lessons
