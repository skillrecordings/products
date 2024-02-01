import S from '@sanity/desk-tool/structure-builder'
import {MdOutlineViewModule} from 'react-icons/md'

const modules = S.listItem()
  .title('Modules')
  .icon(MdOutlineViewModule)
  .child(S.documentTypeList('module').title('All Modules'))

export default modules
