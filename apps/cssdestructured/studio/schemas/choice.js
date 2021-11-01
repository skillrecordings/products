export default {
  name: 'choice',
  title: 'Choice',
  type: 'object',
  description: 'A choice.',
  fields: [
    {
      name: 'value',
      title: 'Value',
      type: 'string',
    },
    {
      name: 'label',
      title: 'Label',
      type: 'string',
    },
    {
      name: 'correct',
      title: 'Correct',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
  preview: {
    select: {
      title: 'value',
    },
  },
}
