import {MdLocalMovies} from 'react-icons/md'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'muxAsset',
  type: 'object',
  icon: MdLocalMovies,
  title: 'Mux Asset',
  fields: [
    defineField({
      name: 'muxPlaybackId',
      title: 'Mux Playback ID',
      description: 'Hashed ID of a video on mux',
      type: 'string',
    }),
    defineField({
      name: 'muxAssetId',
      title: 'Mux Asset ID',
      description: 'ID that references the asset in Mux.',
      type: 'string',
    }),
  ],
})
