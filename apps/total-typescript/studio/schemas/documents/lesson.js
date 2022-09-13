import {capitalize} from 'lodash'

export default {
  name: 'lesson',
  title: 'Lesson',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'lessonType',
      title: 'Lesson Type',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          {title: 'Exercise', value: 'exercise'},
          {title: 'Solution', value: 'solution'},
        ],
      },
    },
    {
      name: 'resources',
      title: 'Resources',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'exercise'}]}],
    },
    {
      name: 'isFree',
      title: 'Is Free?',
      type: 'boolean',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'video',
      title: 'Video',
      description: 'Mux PlaybackID',
      type: 'string',
    },
    {
      name: 'transcript',
      title: 'Transcript',
      type: 'body',
    },
    {
      name: 'body',
      title: 'Body',
      type: 'body',
    },
    {
      name: 'stackblitz',
      type: 'stackblitz',
    },
    {
      name: 'description',
      title: 'SEO Description',
      type: 'text',
      validation: (Rule) => Rule.max(160),
    },
  ],
  initialValue: {
    isFree: true,
  },
  preview: {
    select: {
      title: 'title',
      lessonType: 'lessonType',
    },
    prepare(selection) {
      const {title, lessonType} = selection
      return {
        title: `${title}: ${capitalize(lessonType)}`,
      }
    },
  },
}
