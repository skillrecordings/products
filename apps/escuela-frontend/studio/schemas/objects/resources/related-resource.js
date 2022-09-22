import {MdCardTravel} from 'react-icons/md'

export default {
  name: 'related-resource',
  type: 'object',
  title: 'Related Resource',
  icon: MdCardTravel,
  fields: [
    {
      name: 'label',
      title: 'Label',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'label',
        maxLength: 96,
      },
    },
    {
      name: 'resources',
      title: 'Resources',
      type: 'array',
      of: [
        {type: 'muxVideo'},
        {
          title: 'Article',
          name: 'article',
          type: 'reference',
          to: [{type: 'article'}],
        },
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
