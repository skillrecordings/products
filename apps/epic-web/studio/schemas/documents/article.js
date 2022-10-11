import React from 'react'
import {FcDocument} from 'react-icons/fc'

export default {
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'state',
      title: 'Current State',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'draft',
      options: {
        list: [
          {title: 'draft', value: 'draft'},
          {title: 'published', value: 'published'},
        ],
      },
    },
    {
      name: 'body',
      title: 'Article',
      type: 'body',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      description: 'SEO Description',
      type: 'text',
      validation: (Rule) => Rule.max(160),
    },
    {
      type: 'cloudinary.asset',
      name: 'image',
      title: 'Image',
      description: 'This asset is served from Cloudinary',
    },
    {
      type: 'cloudinary.asset',
      name: 'ogImage',
      title: 'OG Image',
    },
    {
      title: 'Related resources',
      name: 'resources',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'article'}],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare(selection) {
      const {title} = selection
      return {
        title: title,
        media: <FcDocument />,
      }
    },
  },
}
