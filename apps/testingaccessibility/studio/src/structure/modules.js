import S from '@sanity/desk-tool/structure-builder'
import {MdOutlineViewModule} from 'react-icons/md'

const modules = S.listItem()
  .title('Modules')
  .icon(MdOutlineViewModule)
  .child(
    S.list()
      .title('Modules')
      .items([
        S.documentTypeListItem('module')
          .title('All Modules')
          .icon(MdOutlineViewModule),
      ]),
  )

export default modules
