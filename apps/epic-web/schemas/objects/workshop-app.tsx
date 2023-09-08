import React from 'react'
import {MdCode} from 'react-icons/md'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'workshopApp',
  type: 'object',
  title: 'Workshop App Link',
  icon: MdCode,
  fields: [
    defineField({
      name: 'path',
      type: 'string',
      title: 'Path',
      description: 'e.g. /02/04/problem',
    }),
    defineField({
      name: 'localhost',
      title: 'Localhost',
      type: 'object',
      fields: [
        defineField({
          name: 'port',
          type: 'string',
          title: 'Port',
        }),
      ],
    }),
    defineField({
      name: 'external',
      title: 'External Link',
      type: 'object',
      fields: [
        defineField({
          name: 'url',
          type: 'url',
          title: 'Base URL',
          description: 'e.g. https://foundations.epicweb.dev/',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      localhost: 'localhost',
    },
    prepare(selection) {
      const {localhost} = selection
      return {
        title: `Workshop App Link: ${localhost}`,
      }
    },
  },
  components: {
    preview: (selection: any) => {
      const {localhost} = selection
      return <div>Workshop App Link {localhost}</div>
    },
  },
})
