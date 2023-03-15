import React from 'react'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'externalImage',
  type: 'object',
  title: 'External Image',
  fields: [
    defineField({
      name: 'url',
      type: 'url',
      title: 'Image URL',
    }),
    defineField({
      name: 'alt',
      type: 'string',
      title: 'Alternative text',
    }),
  ],
  preview: {
    select: {url: 'url', alt: 'alt'},
  },
  components: {
    preview: (value: any) => {
      const {url, alt} = value
      return <img src={url} alt={alt} />
    },
  },
})
