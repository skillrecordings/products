export default {
  name: 'grid',
  type: 'object',
  title: 'Grid',
  fields: [
    {
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{type: 'gridItem'}],
    },
  ],
}
