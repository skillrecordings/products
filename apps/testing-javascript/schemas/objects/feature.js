export default {
  name: 'feature',
  type: 'object',
  title: 'Feature',
  fields: [
    {
      name: 'value',
      title: 'Value',
      type: 'string',
    },
    {
      name: 'isEmphasized',
      title: 'Is feature emphasized?',
      type: 'boolean',
    },
  ],
  initialValue: {
    isEmphasized: false,
  },
}
