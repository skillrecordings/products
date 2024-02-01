import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'castingwordsTranscript',
  type: 'object',
  title: 'Castingwords Transcript',
  fields: [
    defineField({
      name: 'orderId',
      title: 'Order ID',
      description: 'Used to keep track of the order status on Castingwords',
      type: 'string',
    }),
    defineField({
      name: 'audioFileId',
      title: 'Castingwords Audio File ID',
      description:
        'This is used to keep track of the specific transcript in a Castingwords order.',
      type: 'string',
    }),
    defineField({
      name: 'transcript',
      title: 'Transcript',
      type: 'body',
    }),
    defineField({
      title: 'SRT',
      name: 'srt',
      type: 'text',
    }),
  ],
})
