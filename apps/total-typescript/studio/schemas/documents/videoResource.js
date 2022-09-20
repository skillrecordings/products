/* eslint-disable import/no-anonymous-default-export */
import {MdVideocam} from 'react-icons/md'

export default {
  name: 'videoResource',
  title: 'Video Resource',
  type: 'document',
  icon: MdVideocam,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'originalMediaUrl',
      title: 'AWS S3 Url',
      validation: (Rule) => Rule.required(),
      description: 'A URL to the source video in an S3 Bucket',
      type: 'url',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'muxAsset',
      title: 'Mux Asset',
      type: 'muxAsset',
    },
    {
      name: 'castingwords',
      title: 'Castingwords',
      type: 'castingwordsTranscript',
    },
  ],
}
