import React from 'react'
import {MdOutlineLocalShipping} from 'react-icons/md'

export default {
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  icon: MdOutlineLocalShipping,
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
      name: 'partnerName',
      title: 'Partner name',
      type: 'string',
      validation: (Rule) => Rule.required(),
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
      title: 'Case Study Body - (outdated)',
      type: 'body',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'markdownBody',
      title: 'Case Study Body',
      type: 'markdown',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'heroImage',
      title: 'New external hero image',
      type: 'externalImage',
      description: 'Hero image',
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
      media: 'heroImage.url',
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
