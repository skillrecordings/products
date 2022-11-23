import {MdCode} from 'react-icons/md'
import * as React from 'react'

export default {
  name: 'sandpack',
  type: 'object',
  title: 'Sandpack',
  icon: MdCode,

  fields: [
    {
      name: 'files',
      title: 'Files',
      type: 'array',
      description: 'Code files to pass into the sandpack editor',
      of: [
        {
          type: 'codeFile',
        },
      ],
    },
  ],
  preview: {
    prepare(selection) {
      return {
        title: `Sandpack`,
      }
    },
  },
}
