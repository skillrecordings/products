export default {
  name: 'solution',
  type: 'object',
  title: 'Solution to Exercise',
  fields: [
    {
      name: 'label',
      title: 'Label',
      type: 'string',
    },
    {
      name: 'resources',
      title: 'Resources',
      type: 'array',
      of: [{type: 'muxVideo'}, {type: 'stackblitz'}],
    },
    {
      name: 'body',
      title: 'Body',
      type: 'body',
    },
  ],
}
