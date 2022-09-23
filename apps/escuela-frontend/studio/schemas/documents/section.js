import React from 'react'
import {MdExtension} from 'react-icons/md'

export default {
  name: 'section',
  title: 'Section',
  type: 'document',
  icon: MdExtension,
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
      name: 'github',
      title: 'GitHub',
      type: 'github',
    },
    {
      name: 'lessons',
      title: 'Lessons',
      description: 'Lessons in the course',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'lesson'}],
        },
      ],
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
