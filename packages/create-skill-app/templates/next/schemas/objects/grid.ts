import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'grid',
  type: 'object',
  title: 'Grid',
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{type: 'gridItem'}],
    }),
  ],
})
