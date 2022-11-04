import {MdOndemandVideo} from 'react-icons/md'

export default {
  name: 'explainer',
  type: 'object',
  title: 'Explainer',
  description:
    'A type of Lesson that can be a sectionIntro moduleIntro moduleOutro',
  icon: MdOndemandVideo,
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
      name: 'explainerType',
      title: 'Explainer Type',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          {title: 'Explainer to Section', value: 'sectionIntro'},
          {title: 'Explainer to Module', value: 'moduleIntro'},
        ],
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
      ],
    },
    {
      name: 'body',
      title: 'Body',
      type: 'body',
    },
    {
      name: 'description',
      title: 'Summary',
      description: 'Used as a short "SEO" summary on Twitter cards etc.',
      type: 'text',
      validation: (Rule) => Rule.max(160),
    },
  ],
}
