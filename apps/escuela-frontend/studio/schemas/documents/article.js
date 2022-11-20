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
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    },
    {
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Max 60 characters',
      validation: (Rule) => Rule.max(60),
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
      name: 'author',
      title: 'Author',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'collaborator'}]}],
    },
    {
      name: 'body',
      title: 'Body',
      type: 'body',
      validation: (Rule) => Rule.required(),
    },
    // {
    //   title: 'Call to Action',
    //   name: 'cta',
    //   type: 'object',
    //   description: 'Displayed at the bottom of the article. Not required.',
    //   fields: [
    //     {
    //       title: 'Text',
    //       type: 'body',
    //       name: 'body',
    //     },
    //     {
    //       title: 'Form',
    //       name: 'ckFormId',
    //       type: 'string',
    //       of: [{type: 'string'}],
    //       options: {
    //         list: [
    //           {
    //             title: 'Initial Landing Page: Escuela Frontend (3179174)',
    //             value: '3179174',
    //           },
    //         ],
    //         sortable: false,
    //       },
    //     },
    //     {
    //       title: 'Action Label',
    //       name: 'actionLabel',
    //       type: 'string',
    //       initialValue: 'Learn Escuela Frontend',
    //     },
    //   ],
    // },
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
      name: 'related',
      title: 'Related Resources',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'article'}]}],
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
