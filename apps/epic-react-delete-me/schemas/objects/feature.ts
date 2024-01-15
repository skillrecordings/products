import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'feature',
  type: 'object',
  title: 'Feature',
  fields: [
    defineField({
      name: 'value',
      type: 'string',
      title: 'Value',
    }),
  ],
})
