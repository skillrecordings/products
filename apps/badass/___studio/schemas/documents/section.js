import React from 'react'

export default {
  name: 'section',
  title: 'Section',
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
      name: 'lessons',
      title: 'Lessons',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'lesson'}]}],
    },
    {
      name: 'description',
      title: 'Description',
      type: 'markdown',
    },
    {name: 'body', title: 'Body', type: 'body'},
    {name: 'image', title: 'Image', type: 'externalImage'},
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      hidden: true,
    },
  ],
  orderings: [
    {
      title: 'Manual order',
      name: 'manualOrder',
      by: [{field: 'order', direction: 'asc'}],
    },
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
