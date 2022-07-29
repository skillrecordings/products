export default {
  name: 'externalImage',
  type: 'object',
  title: 'External Image',
  fields: [
    {
      name: 'url',
      type: 'url',
      title: 'Image URL',
    },
    {
      name: 'alt',
      type: 'string',
      title: 'Alternative text',
    },
  ],
  preview: {
    select: {url: 'url', alt: 'alt'},
    prepare(value) {
      const {url, alt} = value
      return {media: <img src={url} alt={alt} />}
    },
  },
}
