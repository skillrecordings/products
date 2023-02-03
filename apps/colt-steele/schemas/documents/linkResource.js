/* eslint-disable import/no-anonymous-default-export */
import {MdLink} from 'react-icons/md'

export default {
  name: 'linkResource',
  title: 'Link Resource',
  type: 'document',
  icon: MdLink,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'url',
      title: 'Url',
      description: 'A URL link to the source',
      type: 'url',
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
      name: 'description',
      title: 'Short Description',
      description: 'Describe why the linked resource is useful.',
      type: 'text',
      validation: (Rule) => Rule.max(160).required(),
    },
  ],
}
