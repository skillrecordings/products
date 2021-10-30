export default {
  name: 'essay',
  title: 'Essay',
  type: 'object',
  description: 'Essay question',
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
      initialValue: 'essay',
      readOnly: true,
    },
    {name: 'tagId', title: 'ConvertKit Tag ID', type: 'string'},
    {
      name: 'body',
      title: 'Body',
      type: 'markdown',
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
