import {MdRecordVoiceOver} from 'react-icons/md'

export default {
  name: 'explainer',
  type: 'document',
  title: 'Explainer',
  description:
    'A type of Lesson that works as intro or outro for a module or section.',
  icon: MdRecordVoiceOver,
  fields: [
    {
      name: 'label',
      title: 'Label',
      type: 'string',
      hidden: true,
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.max(90),
    },
    {
      name: 'explainerType',
      title: 'Explainer Type',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          {title: 'Module intro', value: 'moduleIntro'},
          {title: 'Module outro', value: 'moduleOutro'},
          {title: 'Section intro', value: 'sectionIntro'},
          {title: 'General (other)', value: 'general'},
        ],
      },
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
      name: 'resources',
      title: 'Resources',
      type: 'array',
      of: [
        {
          title: 'Video Resource',
          type: 'reference',
          to: [{type: 'videoResource'}],
        },
        {type: 'muxVideo'},
        {type: 'stackblitz'},
        {type: 'testimonial'},
        {type: 'linkResource'},
      ],
    },
    {
      name: 'body',
      title: 'Body',
      type: 'body',
    },
    {
      name: 'description',
      title: 'Short Description',
      description: 'Used as a short "SEO" summary on Twitter cards etc.',
      type: 'text',
      validation: (Rule) => Rule.max(160),
    },
  ],
}
