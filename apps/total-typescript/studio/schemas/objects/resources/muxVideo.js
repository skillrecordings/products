export default {
  name: 'muxVideo',
  type: 'object',
  title: 'Mux Video',
  fields: [
    {
      name: 'label',
      title: 'Label',
      type: 'string',
    },
    {
      name: 'muxPlaybackId',
      title: 'Mux Playback ID',
      description: 'Hashed ID of a video on mux',
      validation: (Rule) => Rule.required(),
      type: 'string',
    },
    {
      name: 'transcript',
      title: 'Transcript',
      type: 'body',
    },
  ],
}
