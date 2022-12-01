import * as React from 'react'
import {capitalize} from 'lodash'
import {MdRadio} from 'react-icons/md'

export default {
  name: 'module',
  title: 'Module',
  type: 'document',
  icon: MdRadio,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'moduleType',
      title: 'Module Type',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          {title: 'Workshop', value: 'workshop'},
          {title: 'Tutorial', value: 'tutorial'},
        ],
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
      name: 'github',
      title: 'GitHub',
      type: 'github',
    },
    {
      name: 'resources',
      title: 'Resources',
      description: 'Exercises and Sections in the Module',
      type: 'array',
      of: [
        {
          title: 'Exercise and Sections',
          type: 'reference',
          to: [
            {title: 'Exercise', type: 'exercise'},
            {title: 'Section', type: 'section'},
            {type: 'linkResource'},
          ],
        },
      ],
    },
    {
      name: 'body',
      title: 'Body',
      type: 'body',
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
    {
      name: 'image',
      title: 'Image',
      type: 'image',
    },
    {
      name: 'ogImage',
      title: 'Share card URL',
      type: 'url',
    },
    {
      name: 'description',
      title: 'SEO Description',
      type: 'text',
      validation: (Rule) => Rule.max(160),
    },
  ],
  preview: {
    select: {
      type: 'moduleType',
      title: 'title',
      media: 'image.asset.url',
    },
    prepare(selection) {
      const {title, media, type} = selection
      return {
        title: `${title} ${capitalize(type)}`,
        media: media && <img src={media} alt={title} />,
      }
    },
  },
}
