import {MdCode} from 'react-icons/md'
import * as React from 'react'

export default {
  name: 'stackblitz',
  type: 'object',
  title: 'Stackblitz',
  icon: MdCode,
  fields: [
    {
      name: 'openFile',
      title: 'Open File',
      type: 'string',
    },
  ],
  preview: {
    select: {
      file: 'openFile',
    },
    prepare(selection) {
      const {file} = selection
      return {
        title: `StackBlitz ${file}`,
      }
    },
  },
}
