export default {
  name: 'exercise',
  type: 'document',
  title: 'Exercise',
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
      of: [{type: 'solution'}, {type: 'muxVideo'}, {type: 'stackblitz'}],
    },
    {
      name: 'body',
      title: 'Body',
      type: 'body',
    },
    {
      name: 'description',
      title: 'Short Description',
      description: 'Used as a short "SEO" summary on Twitter cards etc.',
      type: 'text',
      validation: (Rule) => Rule.max(160),
    },
  ],
}
