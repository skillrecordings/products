export default {
  name: 'externalLink',
  type: 'object',
  title: 'External Link',
  fields: [
    {
      name: 'label',
      title: 'Label',
      type: 'string',
    },
    {
      name: 'href',
      title: 'URL',
      type: 'url',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'externalImage',
    },
  ],
}
