import {MdLink} from 'react-icons/md'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'linkResource',
  title: 'Link Resource',
  type: 'document',
  icon: MdLink,
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        media: MdLink,
        title: `${title} (Link)`,
      }
    },
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'url',
      title: 'Url',
      description: 'A URL link to the source',
      type: 'url',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      description: 'Describe why the linked resource is useful.',
      type: 'text',
      validation: (Rule) => Rule.max(160).required(),
    }),
  ],
})
