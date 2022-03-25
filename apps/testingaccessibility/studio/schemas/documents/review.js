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
      name: 'image',
      title: 'Icon',
      type: 'string',
      description: 'Square icon',
    },
    {
      name: 'hlsUrl',
      title: 'Video HLS URL',
      type: 'url',
      description: 'Video URL',
    },
    {
      name: 'subtitlesUrl',
      title: 'Subtitle track URL',
      type: 'url',
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
      title: 'Published',
      name: 'published',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'date',
      title: 'Date',
      type: 'date',
    },
    {
      name: 'description',
      type: 'markdown',
      title: 'Description',
    },
    {
      name: 'body',
      title: 'Transcript',
      type: 'markdown',
      description: 'Full body in MDX.',
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
