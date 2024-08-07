import {MdArchive} from 'react-icons/md'

const workshops = (S) =>
  S.listItem()
    .title('Workshops')
    .icon(MdArchive)
    .child(
      S.documentTypeList('module')
        .filter('moduleType == "workshop"')
        .title('All Workshops'),
    )

export default workshops
