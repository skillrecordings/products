import {FiPackage} from 'react-icons/fi'

const products = (S) =>
  S.listItem()
    .title('Products')
    .icon(FiPackage)
    .child(S.documentTypeList('product').title('All Products'))

export default products
