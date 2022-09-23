import {MdOutlineWorkspaces} from 'react-icons/md'

export default {
  name: 'lesson',
  type: 'document',
  title: 'Lesson',
  description: 'This is a lesson that can contain multiple resources',
  icon: MdOutlineWorkspaces,
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
      of: [{type: 'exercise'}, {type: 'solution'}, {type: 'talk'}],
    },
  ],
}
