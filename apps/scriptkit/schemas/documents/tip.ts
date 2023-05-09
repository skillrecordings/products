import {MdOutlineLightbulb} from 'react-icons/md'
import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'tip',
  type: 'document',
  title: 'Tip',
  icon: MdOutlineLightbulb,
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        media: MdOutlineLightbulb,
        title: `${title} (Tip)`,
      }
    },
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'resources',
      title: 'Resources',
      type: 'array',
      of: [
        defineArrayMember({type: 'reference', to: [{type: 'videoResource'}]}),
        defineArrayMember({type: 'tweet'}),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 10,
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      description: 'Used as a short "SEO" summary on Twitter cards etc.',
      type: 'text',
      validation: (Rule) => Rule.max(160),
    }),
  ],
})
