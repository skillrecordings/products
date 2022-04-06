import {MdFormatIndentDecrease as icon} from 'react-icons/md'
import PathInput from '../components/path-input'

export default {
  name: 'course',
  title: 'Course',
  type: 'document',
  icon,
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
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'path',
      description: "Path on escuelafrontend.com. Don't forget the /",
      title: 'Path',
      type: 'string',
      inputComponent: PathInput,
      options: {
        basePath: 'escuelafrontend.com',
        formatSlug: false,
      },
    },
    {
      name: 'collaborators',
      description:
        'Humans that worked on this resource and get credit for the effort.',
      title: 'Collaborators',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'collaborator'}],
        },
      ],
    },
    {
      name: 'softwarelibraries',
      title: 'Software Libraries',
      type: 'array',
      of: [{type: 'reference', to: {type: 'software-library'}}],
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    },
    {
      name: 'body',
      type: 'markdown',
      title: 'Body',
    },
    {
      name: 'seo',
      type: 'seo',
      title: 'SEO',
    },
  ],
}
