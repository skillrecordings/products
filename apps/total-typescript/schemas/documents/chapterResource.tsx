import * as React from 'react'
import {MdBook} from 'react-icons/md'

export default {
  name: 'chapterResource',
  type: 'document',
  title: 'Chapter Resource',
  icon: MdBook,
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
      name: 'resources',
      title: 'Resources',
      type: 'array',
      of: [{type: 'linkResource'}, {type: 'tweet'}],
    },
    {
      name: 'body',
      title: 'Body',
      type: 'markdown',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
    },
    {
      name: 'concepts',
      title: 'Concepts',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'concept'}],
        },
      ],
    },
    {
      name: 'description',
      title: 'Short Description',
      description: 'Used as a short "SEO" summary on Twitter cards etc.',
      type: 'text',
      validation: (Rule) => Rule.max(160),
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image.asset.url',
    },
    prepare(selection) {
      const {title, media} = selection
      console.log({selection})
      return {
        title,
        media: media && <img src={media} alt={title} />,
      }
    },
  },
}
