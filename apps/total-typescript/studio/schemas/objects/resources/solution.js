import {MdAutoFixHigh} from 'react-icons/md'

export default {
  name: 'solution',
  type: 'object',
  title: 'Solution to Exercise',
  icon: MdAutoFixHigh,
  fields: [
    {
      name: 'label',
      title: 'Label',
      type: 'string',
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
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
      ],
    },
    {
      name: 'body',
      title: 'Body',
      type: 'body',
    },
  ],
}
