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
      name: 'byline',
      title: 'Byline',
      type: 'string',
      description:
        'Defaults to Marcy but is full text under title in share card (for example) so `by Author Name` to override',
      options: {
        maxLength: 64,
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
            list: [
              {title: 'Email Course (1863867)', value: '1863867'},
              {
                title: 'workshop-form-automated-testing (3122427)',
                value: '3122427',
              },
              {
                title: 'workshop-form-automated-testing (3120060)',
                value: '3120060',
              },
              {
                title: 'workshop-form-automated-testing (3122424)',
                value: '3122424',
              },
              {
                title: 'workshop-form-automated-testing (3122425)',
                value: '3122425',
              },
              {
                title: 'workshop-form-manually-a11y-testing (2662749)',
                value: '2662749',
              },
              {title: 'workshop-form-people (3122421)', value: '3122421'},
              {title: 'workshop-form-semantics (3122422)', value: '3122422'},
            ],
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
