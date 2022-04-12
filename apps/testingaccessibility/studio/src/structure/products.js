import S from '@sanity/desk-tool/structure-builder'
import {FiPackage} from 'react-icons/fi'

const products = S.listItem()
  .title('Products')
  .icon(FiPackage)
  .child(
    S.list()
      .title('Products')
      .items([
        S.documentTypeListItem('product').title('All Products').icon(FiPackage),
      ]),
  )

export default products
