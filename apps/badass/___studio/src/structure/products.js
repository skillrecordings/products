import S from '@sanity/desk-tool/structure-builder'
import {FiPackage} from 'react-icons/fi'

const products = S.listItem()
  .title('Products')
  .icon(FiPackage)
  .child(S.documentTypeList('product').title('All Products'))

export default products
