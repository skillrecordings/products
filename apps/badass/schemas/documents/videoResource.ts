import {defineType, defineField} from 'sanity'
import {MdVideocam} from 'react-icons/md'

export default defineType({
  name: 'videoResource',
  title: 'Video Resource',
  type: 'document',
  icon: MdVideocam,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'originalMediaUrl',
      title: 'AWS S3 Url',
      description: 'A URL to the source video in an S3 Bucket',
      type: 'url',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'muxAsset',
      title: 'Mux Asset',
      type: 'muxAsset',
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'number',
      readOnly: true,
    }),
    defineField({
      name: 'castingwords',
      title: 'Castingwords',
      type: 'castingwordsTranscript',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare(selection) {
      const {title} = selection
      return {
        title,
      }
    },
  },
})
