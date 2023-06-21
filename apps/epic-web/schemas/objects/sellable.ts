import {MdMonetizationOn} from 'react-icons/md'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'sellable',
  type: 'object',
  icon: MdMonetizationOn,
  title: 'Sellable Product',
  fields: [
    defineField({
      name: 'productId',
      title: 'Product ID',
      description: 'Reference to a product in database',
      type: 'string',
    }),
  ],
})
