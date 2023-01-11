import S from '@sanity/desk-tool/structure-builder'
import {FiPackage} from 'react-icons/fi'

const bundles = S.listItem()
  .title('Bundles')
  .icon(FiPackage)
  .child(S.documentTypeList('bundle').title('Configure Bundles'))

export default bundles
