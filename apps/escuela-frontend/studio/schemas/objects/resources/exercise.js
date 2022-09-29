import {MdSettingsSuggest} from 'react-icons/md'

export default {
  name: 'exercise',
  type: 'object',
  title: 'Exercise',
  icon: MdSettingsSuggest,
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
      of: [{type: 'muxVideo'}, {type: 'stackblitz'}],
    },
    {
      name: 'body',
      title: 'Body',
      type: 'body',
    },
  ],
}
