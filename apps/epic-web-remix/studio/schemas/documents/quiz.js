export default {
  name: 'quiz',
  title: 'Quiz',
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
      name: 'questions',
      title: 'Questions',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'question'}],
        },
      ],
      validation: (Rule) =>
        Rule.min(1)
          .error('A quiz must have at least one question')
          .unique('Must be unique'),
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
}
