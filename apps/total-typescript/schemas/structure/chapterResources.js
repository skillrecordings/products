import {MdBook} from 'react-icons/md'

const chapterResource = (S) =>
  S.listItem()
    .title('Chapter Resources')
    .icon(MdBook)
    .child(S.documentTypeList('chapterResource').title('All chapter resources'))

export default chapterResource
