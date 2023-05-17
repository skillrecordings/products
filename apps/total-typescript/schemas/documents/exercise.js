import {MdOutlineWorkspaces} from 'react-icons/md'

export default {
  name: 'exercise',
  type: 'document',
  title: 'Exercise',
  description:
    'A type of Lesson that has 2-parts, a problem (the exercise) and a solution.',
  icon: MdOutlineWorkspaces,
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
      name: 'resources',
      title: 'Resources',
      type: 'array',
      of: [
        {
          title: 'Video Resource',
          type: 'reference',
          to: [{type: 'videoResource'}],
        },
        {type: 'solution'},
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
      name: 'concepts',
      title: 'Concepts',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'skosConcept'}],
        },
      ],
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
