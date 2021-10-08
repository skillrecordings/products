export default {
  name: 'workshops',
  title: 'Workshops',
  type: 'document',
  fields: [
    {name: 'title', title: 'Title', type: 'string'},
    {
      name: 'workshops',
      title: 'Workshops',
      type: 'array',
      of: [
        {
          name: 'workshop',
          title: 'Workshop',
          type: 'reference',
          to: [{type: 'workshop'}],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
}
