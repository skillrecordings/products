import {MdMonitor} from 'react-icons/md'

export default {
  name: 'talk',
  type: 'object',
  title: 'Talk',
  icon: MdMonitor,
  fields: [
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
        source: 'label',
        maxLength: 96,
      },
    },
    {
      name: 'resources',
      title: 'Resources',
      type: 'array',
      of: [{type: 'muxVideo'}],
    },
    {
      name: 'body',
      title: 'Body',
      type: 'body',
    },
  ],
}
