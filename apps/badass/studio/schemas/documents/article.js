import React from 'react'
import {MdOutlineArticle} from 'react-icons/md'

export default {
  name: 'article',
  title: 'Article',
  type: 'document',
  icon: MdOutlineArticle,
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
      of: [
        {
          type: 'reference',
          to: [{type: 'videoResource'}],
        },
      ],
    },
    {
      name: 'body',
      title: 'Article Body',
      type: 'body',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
    },
    {
      name: 'summary',
      title: 'Summary',
      type: 'body',
    },
    {
      name: 'ogImage',
      title: 'Share Card',
      type: 'externalImage',
      description: '1200x630',
    },
    {
      name: 'ogImageData',
      title: 'Share Card data',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          description: 'max 30 chars',
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'string',
        },
        {
          name: 'ogImage',
          title: 'Image',
          type: 'externalImage',
          description: 'Optional. Should have 1:1 aspect ratio',
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
    {
      name: 'concepts',
      title: 'Concepts',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'skosConcept'}],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image.asset.url',
    },
    prepare(selection) {
      const {media, title} = selection
      return {
        title,
        media: media && <img src={media} alt={title} />,
      }
    },
  },
}
