import {MdPerson} from 'react-icons/md'
import {defineType} from 'sanity'

const contributors = (S) =>
  S.listItem()
    .title('Contributors')
    .icon(MdPerson)
    .child(S.documentTypeList('contributor').title('All Contributors'))

export default contributors
