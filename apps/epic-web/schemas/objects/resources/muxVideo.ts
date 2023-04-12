import {MdLocalMovies} from 'react-icons/md'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'muxVideo',
  type: 'object',
  icon: MdLocalMovies,
  title: 'Mux Video',
  preview: {
    select: {
      label: 'label',
    },
    prepare({label}) {
      return {
        media: MdLocalMovies,
        title: `${label} (Mux Video)`,
      }
    },
  },
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
    }),
    defineField({
      name: 'muxPlaybackId',
      title: 'Mux Playback ID',
      description: 'Hashed ID of a video on mux',
      validation: (Rule) => Rule.required(),
      type: 'string',
    }),
    defineField({
      name: 'transcript',
      title: 'Transcript',
      type: 'body',
    }),
  ],
})
