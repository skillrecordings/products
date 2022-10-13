import {MdOutlineWorkspaces} from 'react-icons/md'

export default {
  name: 'resource',
  title: 'Resource',
  type: 'document',
  description: 'This is a lesson that can contain multiple resources',
  icon: MdOutlineWorkspaces,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'resourceType',
      title: 'Resource Type',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          {title: 'Lesson', value: 'lesson'},
          {title: 'Section', value: 'section'},
        ],
      },
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
        {
          type: 'reference',
          description: 'Most likely this will be a lesson',
          to: [{type: 'resource'}],
        },
        {type: 'exercise'},
        {type: 'solution'},
        {type: 'talk'},
      ],
    },
  ],
}
