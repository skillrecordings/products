export default {
  title: 'Video Resource',
  name: 'videoResource',
  type: 'document',
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
    },
    {
      title: 'Description',
      name: 'description',
      type: 'body',
    },
    {
      title: 'MUX Media URL',
      name: 'muxMediaUrl',
      type: 'url',
    },
    {
      title: 'SRT File',
      name: 'srtFile',
      type: 'file',
    },
    {
      title: 'Transcript',
      name: 'transcript',
      type: 'mediaCaption',
    },
  ],
}
