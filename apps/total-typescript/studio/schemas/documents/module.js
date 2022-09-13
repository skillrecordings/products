export default {
  name: 'module',
  title: 'Module',
  type: 'document',
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
          {title: 'Course', value: 'course'},
          {title: 'Tutorial', value: 'tutorial'},
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
      description: 'Exercises in the course',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'exercise'}],
        },
      ],
    },
    {
      name: 'body',
      title: 'Body',
      type: 'body',
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
      title: 'title',
    },
    prepare(selection) {
      const {title} = selection
      return {
        title: title,
      }
    },
  },
}
