import React from 'react'

export default {
  name: 'review',
  title: 'Review',
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
      title: 'Published',
      name: 'published',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'image',
      title: 'Icon',
      type: 'string',
      description: 'Square icon',
    },
    {
      name: 'resources',
      title: 'Resources',
      type: 'array',
      of: [
        {
          title: 'Video resources',
          type: 'reference',
          to: [{title: 'Video resource', type: 'videoResource'}],
        },
      ],
    },
    {
      name: 'body',
      type: 'body',
      title: 'Page Body',
    },
    {
      name: 'date',
      title: 'Date',
      type: 'date',
    },
    {
      name: 'videoPoster',
      title: 'Video Poster',
      type: 'string',
      description: '1536x960 (8:5)',
    },
    {
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
    },
    {
      name: 'ogImage',
      title: 'Social card',
      type: 'object',
      fields: [
        {
          name: 'url',
          type: 'string',
        },
        {
          name: 'alt',
          type: 'string',
        },
      ],
    },
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
      image: 'image',
    },
    prepare(selection) {
      const {title, image} = selection

      return {
        title: title,
        media: <img src={image} alt={title} />,
      }
    },
  },
}
