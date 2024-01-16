import {FiPackage} from 'react-icons/fi'

const liveProducts = (S) =>
  S.listItem()
    .title('Live Event Products')
    .icon(FiPackage)
    .child(
      S.documentTypeList('product')
        .filter('type == "live"')
        .title('Live Event Products'),
    )

export default liveProducts
