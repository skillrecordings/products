import * as React from 'react'
import {FiGithub} from 'react-icons/fi'

export default {
  name: 'github',
  type: 'object',
  title: 'GitHub',
  icon: FiGithub,
  fields: [
    {
      name: 'repo',
      title: 'Repository',
      type: 'string',
      description: 'without https://github.com/pro-tailwind/',
    },
  ],
}
