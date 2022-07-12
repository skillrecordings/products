import React from 'react'

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
      title: 'Published',
      name: 'published',
      type: 'boolean',
      initialValue: true,
    },
    {
      title: 'Subscribers Only',
      name: 'subscribersOnly',
      type: 'boolean',
      readOnly: true,
      initialValue: false,
    },
    {
      name: 'preview',
      title: 'Preview',
      type: 'body',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'body',
      title: 'Full Article',
      type: 'body',
      validation: (Rule) => Rule.required(),
    },
    {
      title: 'Call to Action',
      name: 'cta',
      type: 'object',
      description: 'Displayed at the bottom of the article. Not required.',
      fields: [
        {
          title: 'Text',
          type: 'body',
          name: 'body',
        },
        {
          title: 'Form',
          name: 'ckFormId',
          type: 'string',
          of: [{type: 'string'}],
          options: {
            list: [{title: 'Email Course (3071922)', value: '3071922'}],
            sortable: false,
          },
        },
        {
          title: 'Action Label',
          name: 'actionLabel',
          type: 'string',
          initialValue: 'Start Testing Accessibility →',
        },
      ],
    },
    {name: 'image', title: 'Image', type: 'externalImage'},
    {
      name: 'ogImage',
      title: 'Share Card',
      type: 'externalImage',
      description: '1200x628',
    },
    {
      name: 'description',
      title: 'SEO Description',
      type: 'text',
      validation: (Rule) => Rule.max(160),
    },
    {
      name: 'date',
      title: 'Published Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'tag'}]}],
      options: {
        layout: 'tags',
      },
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
