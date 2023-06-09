import {FiGithub} from 'react-icons/fi'
import {defineType} from 'sanity'

export default defineType({
  name: 'github',
  type: 'object',
  title: 'GitHub',
  icon: FiGithub,
  fields: [
    {
      name: 'url',
      title: 'Github URL',
      type: 'url',
      description: 'Full URL to file on GitHub',
    },
  ],
  preview: {
    select: {
      url: 'url',
    },
    prepare({url}) {
      return {
        media: FiGithub,
        title: url,
      }
    },
  },
})
