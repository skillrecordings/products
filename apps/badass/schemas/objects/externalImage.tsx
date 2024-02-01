import React from 'react'
import {defineType, defineField} from 'sanity'

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
    prepare(value) {
      const {url, alt} = value
      return {media: <img src={url} alt={alt} />}
    },
  },
})
