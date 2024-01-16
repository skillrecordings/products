import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'videoOptions',
  type: 'object',
  title: 'Video Options',
  fields: [
    defineField({
      name: 'controls',
      title: 'Controls',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'autoPlay',
      title: 'Autoplay',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'loop',
      title: 'Loop',
      type: 'boolean',
      initialValue: true,
    }),
  ],
})
