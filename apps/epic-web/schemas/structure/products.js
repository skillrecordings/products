import {FiPackage} from 'react-icons/fi'

const products = (S) =>
  S.listItem()
    .title('Self-Paced Products')
    .icon(FiPackage)
    .child(
      S.documentTypeList('product')
        .filter('type == "self-paced"')
        .title('Self-Paced Products'),
    )

export default products
