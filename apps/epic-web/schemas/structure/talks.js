import {MdCoPresent} from 'react-icons/md'
import {defineType} from 'sanity'

const talks = (S) =>
  S.listItem()
    .title('Talks')
    .icon(MdCoPresent)
    .child(S.documentTypeList('talk').title('All Talks'))

export default talks
