import * as React from 'react'
import {FaGithubSquare} from 'react-icons/fa'

export default {
  name: 'github',
  type: 'object',
  title: 'GitHub',
  icon: FaGithubSquare,
  fields: [
    {
      name: 'url',
      title: 'GitHub URL',
      type: 'url',
      description: 'Full URL to repository or concrete file on GitHub',
    },
  ],
}
