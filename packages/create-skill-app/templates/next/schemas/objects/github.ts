import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'github',
  type: 'object',
  title: 'GitHub',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'repo',
      title: 'Repository',
      type: 'string',
    }),
  ],
})
