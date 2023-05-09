import {MdOutlineGroupWork} from 'react-icons/md'

const sections = (S) =>
  S.listItem()
    .title('Sections')
    .icon(MdOutlineGroupWork)
    .child(S.documentTypeList('section').title('All Sections'))

export default sections
