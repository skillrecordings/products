import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'transcript',
  type: 'object',
  title: 'Transcript',
  fields: [
    defineField({
      name: 'text',
      title: 'Transcript Text',
      type: 'text',
    }),
    defineField({
      title: 'SRT',
      name: 'srt',
      type: 'text',
    }),
  ],
})
