import React from 'react'

export default {
  name: 'module',
  title: 'Module',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'section',
      title: 'Sections',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'section'}]}],
    },
    {
      name: 'description',
      title: 'Description',
      type: 'markdown',
    },
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{type: 'block'}, {type: 'bodyImage'}, {type: 'bodyVideo'}],
    },
    {name: 'image', title: 'Image', type: 'externalImage'},
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image.url',
    },
    prepare(selection) {
      const {media, title} = selection
      return {
        title: title,
        media: media && <img src={media} alt={title} />,
      }
    },
  },
}
