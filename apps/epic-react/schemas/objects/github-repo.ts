import {defineField, defineType} from 'sanity'
import {FaGithub} from 'react-icons/fa'

export default defineType({
  name: 'githubRepo',
  type: 'object',
  title: 'GitHub',
  icon: FaGithub,
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
