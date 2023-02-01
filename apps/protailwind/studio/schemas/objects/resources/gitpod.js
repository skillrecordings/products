import * as React from 'react'
import {SiGitpod} from 'react-icons/si'

export default {
  name: 'gitpod',
  type: 'object',
  title: 'Gitpod',
  icon: SiGitpod,
  fields: [
    {
      name: 'url',
      title: 'Gitpod URL',
      type: 'url',
    },
  ],
}
