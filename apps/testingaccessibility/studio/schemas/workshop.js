export default {
  name: 'workshop',
  title: 'Workshops',
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
      name: 'ckFormId',
      title: 'Convertkit Form ID',
      type: 'number',
      description:
        'Form ID to subscribe to. (Set up automation in ConvertKit to tag subscribers after submitting specific form)',
    },
    {
      name: 'url',
      title: 'External URL',
      type: 'url',
      description: 'ti.to URL.',
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
      type: 'string',
      description: 'e.g. October 20th, 2021, 9AM—2PM (Pacific)',
    },
    {
      name: 'description',
      type: 'markdown',
      title: 'Description',
    },
    {
      name: 'body',
      title: 'Body',
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
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
}
