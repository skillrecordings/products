import {defineField, defineType} from 'sanity'
import {FaGithub} from 'react-icons/fa'

export default defineType({
  name: 'githubRepo',
  type: 'object',
  title: 'GitHub',
  icon: FaGithub,
  fields: [
    defineField({
      name: 'repo',
      title: 'Repository link',
      type: 'url',
    }),
  ],
})
