import {MdOutlineRowing} from 'react-icons/md'

const workshops = (S) =>
  S.listItem()
    .title('Workshops')
    .icon(MdOutlineRowing)
    .child(
      S.documentTypeList('module')
        .filter('moduleType == "workshop"')
        .title('All Workshops'),
    )

export default workshops
