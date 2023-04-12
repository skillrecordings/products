import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'githubRepo',
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
