import {MdCode} from 'react-icons/md'
import * as React from 'react'

export default {
  name: 'codeFile',
  type: 'object',
  title: 'Code file',
  icon: MdCode,
  initialValue: {
    active: true,
  },
  fields: [
    {
      name: 'file',
      title: 'File path with extension',
      type: 'string',
      description: 'e.g. /src/lesson.html',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'code',
      title: 'Code',
      type: 'code',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'active',
      title: 'Visible in editor',
      descriptio: 'Whether to show this file in the editor.',
      type: 'boolean',
    },
  ],
  preview: {
    select: {
      file: 'file',
    },
    prepare(selection) {
      const {file} = selection
      return {
        title: file,
      }
    },
  },
}
