import {MdMenuBook} from 'react-icons/md'

const books = (S) =>
  S.listItem()
    .title('Books')
    .icon(MdMenuBook)
    .child(
      S.documentTypeList('module')
        .filter('moduleType == "book"')
        .title('All books'),
    )

export default books
