/* eslint-disable import/no-anonymous-default-export */
export default {
  name: 'castingwordsTranscript',
  type: 'object',
  title: 'Castingwords Transcript',
  fields: [
    {
      name: 'orderId',
      title: 'Order ID',
      description: 'Used to keep track of the order status on Castingwords',
      type: 'string',
    },
    {
      name: 'audioFileId',
      title: 'Castingwords Audio File ID',
      description:
        'This is used to keep track of the specific transcript in a Castingwords order.',
      type: 'string',
    },
    {
      name: 'transcript',
      title: 'Transcript',
      type: 'body',
    },
    {
      title: 'SRT',
      name: 'srt',
      type: 'text',
    },
  ],
}
