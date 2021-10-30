export default {
  name: 'code',
  title: 'Code',
  type: 'object',
  description: 'Question with CodeSandbox.',
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
      initialValue: 'code',
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
    {
      name: 'template',
      title: 'Template',
      description:
        'CSB template to use for the editor: angular, react, vanilla, vue, vue3',
      type: 'string',
      initialValue: 'vanilla',
    },
    {
      name: 'code',
      title: 'Code files',
      type: 'array',
      of: [
        {
          type: 'codeFile',
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'id',
    },
  },
}
