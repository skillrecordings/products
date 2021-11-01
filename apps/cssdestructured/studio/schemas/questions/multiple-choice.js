export default {
  name: 'multipleChoice',
  title: 'Multiple choice',
  type: 'object',
  description: 'Question with multiple choices.',
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
      initialValue: 'multiple-choice',
      readOnly: true,
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
