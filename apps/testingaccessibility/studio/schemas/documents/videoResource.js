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
      title: 'Media URL',
      name: 'mediaUrl',
      type: 'url',
    },
    {
      name: 'duration',
      title: 'Duration',
      type: 'number',
      readOnly: true,
    },
    {
      title: 'SRT',
      name: 'srt',
      type: 'text',
    },
    {
      title: 'Transcript',
      name: 'transcript',
      type: 'mediaCaption',
    },
  ],
}
