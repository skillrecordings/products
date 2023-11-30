import {MdBook} from 'react-icons/md'

const chapters = (S) =>
  S.listItem()
    .title('Chapters')
    .icon(MdBook)
    .child(
      S.documentTypeList('module')
        .filter('moduleType == "chapter"')
        .title('All chapters'),
    )

export default chapters
