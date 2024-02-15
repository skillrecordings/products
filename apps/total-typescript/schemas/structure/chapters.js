import {MdMenuBook} from 'react-icons/md'

const chapters = (S) =>
  S.listItem()
    .title('Chapters')
    .icon(MdMenuBook)
    .child(
      S.documentTypeList('module')
        .filter('moduleType == "chapter"')
        .title('All chapters'),
    )

export default chapters
