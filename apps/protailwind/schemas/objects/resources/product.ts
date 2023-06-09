import {IoMdCash} from 'react-icons/io'

export default {
  name: 'product',
  type: 'object',
  title: 'Product',
  icon: IoMdCash,
  fields: [
    {
      name: 'productId',
      title: 'Product ID',
      description: 'Reference to a product in database',
      type: 'string',
    },
    {
      name: 'convertkitPurchasedTagId',
      title: 'ConvertKit Purchased Tag ID',
      type: 'string',
    },
    {
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{type: 'feature'}],
    },
  ],
}
