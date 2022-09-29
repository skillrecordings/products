import {MdLocalMovies} from 'react-icons/md'

export default {
  name: 'muxVideo',
  type: 'object',
  icon: MdLocalMovies,
  title: 'Mux Video',
  fields: [
    {
      name: 'title',
      title: 'Title',
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
