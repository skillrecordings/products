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
      name: 'state',
      title: 'Current State',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'new',
      options: {
        list: [
          {title: 'new', value: 'new'},
          {title: 'processing', value: 'processing'},
          {title: 'reviewing', value: 'reviewing'},
          {title: 'published', value: 'published'},
          {title: 'retired', value: 'retired'},
        ],
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
      description: 'Body in MDX',
      title: 'Body',
      type: 'markdown',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'markdown',
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
