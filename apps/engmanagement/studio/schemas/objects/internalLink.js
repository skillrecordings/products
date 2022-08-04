export default {
  name: 'internalLink',
  type: 'object',
  title: 'Internal link',
  fields: [
    {name: 'label', title: 'Label', type: 'string'},
    {
      name: 'hash',
      type: 'slug',
      title: 'Hash link',
      description: 'Link to specific element on a page using an id.',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (typeof value === 'undefined') {
            return true // Allow undefined values
          }
          // This would crash if we didn't check
          // for undefined values first
          return value.current.startsWith('#')
            ? '# prefix is added automatically'
            : true
        }).error(),
    },
    {
      name: 'image',
      title: 'Image',
      type: 'externalImage',
    },
  ],
}
