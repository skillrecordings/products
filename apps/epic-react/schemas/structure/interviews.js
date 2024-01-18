import {MdPeople} from 'react-icons/md'

const interviews = (S) =>
  S.listItem()
    .title('Interviews')
    .icon(MdPeople)
    .child(S.documentTypeList('interview').title('All Interviews'))

export default interviews
