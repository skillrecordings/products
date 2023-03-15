import React from 'react'
import {MdCode} from 'react-icons/md'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'stackblitz',
  type: 'object',
  title: 'Stackblitz',
  icon: MdCode,
  fields: [
    defineField({
      name: 'openFile',
      title: 'Open File',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      file: 'openFile',
    },
    prepare(selection) {
      const {file} = selection
      return {
        title: `StackBlitz: ${file}`,
      }
    },
  },
  components: {
    preview: (selection: any) => {
      const {file} = selection
      return <div>StackBlitz: {file}</div>
    },
  },
})
