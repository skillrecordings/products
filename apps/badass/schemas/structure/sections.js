import {MdOutlineHorizontalSplit} from 'react-icons/md'

const sections = (S) =>
  S.listItem()
    .title('Sections')
    .icon(MdOutlineHorizontalSplit)
    .child(S.documentTypeList('section').title('All Sections'))

export default sections
