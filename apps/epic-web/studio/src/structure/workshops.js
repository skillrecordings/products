import S from '@sanity/desk-tool/structure-builder'
import {MdOutlineRowing} from 'react-icons/md'

const workshops = S.listItem()
  .title('Workshops')
  .icon(MdOutlineRowing)
  .child(
    S.documentTypeList('module')
      .filter('moduleType == "workshop"')
      .title('All Workshops'),
  )

export default workshops
