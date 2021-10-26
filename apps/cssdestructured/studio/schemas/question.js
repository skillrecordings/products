export default {
  name: 'question',
  title: 'Question',
  type: 'object',
  description: 'A question.',
  fields: [
    {
      name: 'id',
      title: 'Question ID',
      type: 'string',
    },
    {
      name: 'type',
      type: 'string',
      title: 'Question type',
      options: {
        list: [
          {title: 'Multiple Choice', value: 'multiple-choice'},
          {title: 'Multiple Image Choice', value: 'multiple-image-choice'},
          {title: 'Essay', value: 'essay'},
        ],
        layout: 'radio', // <-- defaults to 'dropdown'
      },
    },
    {name: 'tagId', title: 'ConvertKit Tag ID', type: 'string'},
    {
      name: 'body',
      title: 'Body',
      type: 'markdown',
    },
    {
      name: 'choices',
      title: 'Choices',
      type: 'array',
      of: [{type: 'choice'}],
    },
    {
      name: 'answer',
      title: 'Answer',
      type: 'markdown',
    },
  ],
  preview: {
    select: {
      title: 'id',
    },
  },
}
