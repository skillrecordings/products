import S from '@sanity/desk-tool/structure-builder'
import {FiPackage} from 'react-icons/fi'

const packages = S.listItem()
  .title('Packages')
  .icon(FiPackage)
  .child(
    S.list()
      .title('Packages')
      .items([
        S.documentTypeListItem('package').title('All Packages').icon(FiPackage),
      ]),
  )

export default packages
