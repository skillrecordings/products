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
      of: [{type: 'solution'}, {type: 'muxVideo'}, {type: 'stackblitz'}],
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
