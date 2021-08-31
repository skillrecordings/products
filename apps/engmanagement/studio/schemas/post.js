export default {
  name: 'post',
  title: 'Post',
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
      name: 'subscribersOnly',
      title: 'Subscribers Only',
      type: 'boolean',
      initialValue: false,
      description:
        'If true, all guests will see a preview with CTA to subscribe. Can be combined with "Convertkit Tag ID" below.',
    },
    {
      name: 'ckTagId',
      title: 'Convertkit Tag ID',
      type: 'string',
      description:
        'If "Subscribers Only" is true and this Tag ID is set, only tagged subscribers will see full article. Others will be asked to subscribe, which will tag them accordingly.',
    },
    {
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'description',
      type: 'markdown',
      title: 'Description',
      description:
        'This can be used to provide a short description of the article. Max 150 characters',
      validation: (Rule) => Rule.max(200),
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    },
    {
      name: 'body',
      title: 'Body',
      type: 'markdown',
      description: 'Full article in MDX.',
    },
    {
      name: 'preview',
      title: 'Preview',
      type: 'markdown',
      description:
        'Preview in MDX for non-subscribers. Will display if "Subscribers Only" is true. No limit.',
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
    {
      name: 'background',
      title: 'Background',
      type: 'markdown',
      description: 'Article background in MDX.',
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const {author} = selection
      return Object.assign({}, selection, {
        subtitle: author && `by ${author}`,
      })
    },
  },
}
