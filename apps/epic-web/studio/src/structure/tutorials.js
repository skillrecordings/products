import S from '@sanity/desk-tool/structure-builder'
import {MdOutlineViewModule} from 'react-icons/md'

const tutorials = S.listItem()
  .title('Tutorials')
  .icon(MdOutlineViewModule)
  .child(
    S.documentTypeList('module')
      .filter('moduleType == "tutorial"')
      .title('All Tutorials'),
  )

export default tutorials
