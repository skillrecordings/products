export default {
  name: 'question',
  title: 'Question',
  type: 'document',
  fields: [
    {
      name: 'label',
      title: 'Label',
      type: 'string',
    },
    {
      name: 'questionId',
      title: 'Question ID',
      type: 'string',
    },
    {
      name: 'type',
      title: 'Question type',
      type: 'string',
      options: {
        list: [
          {title: 'Essay', value: 'essay'},
          {title: 'Multiple Choice', value: 'multiple-choice'},
          {title: 'Multiple Image Choice', value: 'multiple-image-choice'},
          {title: 'Code', value: 'sandpack'},
        ],
      },
      validation: (Rule) => Rule.required(),
      //   initialValue: {title: 'Essay', value: 'essay'},
    },
    {name: 'tagId', title: 'ConvertKit Tag ID*', type: 'string'},
    {
      name: 'body',
      title: 'Body',
      type: 'body',
    },
    {
      name: 'choices',
      title: 'Choices',
      type: 'array',
      of: [{type: 'choice'}],
      hidden: ({document}) => {
        return document?.type === 'essay' || document?.type === 'sandpack'
      },
    },
    {
      name: 'answer',
      title: 'Answer',
      type: 'body',
    },
  ],
  preview: {
    select: {
      label: 'label',
      questionId: 'questionId',
    },
    prepare(selection) {
      const {label, questionId} = selection
      return {
        title: `[${questionId}] ${label}`,
      }
    },
  },
}
