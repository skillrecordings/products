import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'gridItem',
  type: 'object',
  title: 'Grid Item',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'body',
    }),
  ],
})
