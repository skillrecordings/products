import React from 'react'

export default {
  name: 'externalImage',
  type: 'object',
  title: 'External Image',
  fields: [
    {
      name: 'url',
      type: 'url',
      title: 'Image URL',
    },
    {
      name: 'alt',
      type: 'string',
      title: 'Alternative text',
    },
  ],
  preview: {
    select: {url: 'url', alt: 'alt'},
    prepare(selection) {
      const {url, alt} = selection
      return {media: <img src={url} alt={alt} />}
    },
  },
}
