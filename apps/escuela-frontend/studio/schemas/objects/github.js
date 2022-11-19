import * as React from 'react'
import {FiGithub} from 'react-icons/fi'

export default {
  name: 'github',
  type: 'object',
  title: 'GitHub',
  icon: FiGithub,
  fields: [
    {
      name: 'url',
      title: 'GitHub URL',
      type: 'url',
      description: 'Full URL to repository or concrete file on GitHub',
    },
  ],
}
