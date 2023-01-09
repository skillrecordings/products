import {IoMdCash} from 'react-icons/io'

export default {
  name: 'product',
  type: 'object',
  title: 'Product',
  icon: IoMdCash,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.max(90),
    },
    {
      name: 'productId',
      title: 'Product ID',
      description: 'Reference to product in database',
      type: 'string',
    },
  ],
}
