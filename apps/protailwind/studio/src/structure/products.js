import S from '@sanity/desk-tool/structure-builder'
import {IoMdCash} from 'react-icons/io'

const products = S.listItem()
  .title('Products')
  .icon(IoMdCash)
  .child(S.documentTypeList('product').title('All Products'))

export default products
