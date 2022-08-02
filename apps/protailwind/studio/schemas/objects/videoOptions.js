export default {
  name: 'videoOptions',
  type: 'object',
  title: 'Video Options',
  fields: [
    {
      name: 'controls',
      title: 'Controls',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'autoPlay',
      title: 'Autoplay',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'loop',
      title: 'Loop',
      type: 'boolean',
      initialValue: true,
    },
  ],
}
