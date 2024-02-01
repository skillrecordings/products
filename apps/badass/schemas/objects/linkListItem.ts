import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'linkListItem',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'URL',
      type: 'url',
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
    }),
    defineField({
      name: 'timestamp',
      type: 'string',
    }),
  ],
})
