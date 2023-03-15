import {MdVideocam} from 'react-icons/md'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'videoResource',
  title: 'Video Resource',
  type: 'document',
  icon: MdVideocam,
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        media: MdVideocam,
        title: `${title} (Video)`,
      }
    },
  },
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
      name: 'castingwords',
      title: 'Castingwords',
      type: 'castingwordsTranscript',
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'number',
      readOnly: true,
    }),
  ],
})
