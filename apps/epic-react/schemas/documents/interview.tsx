import {MdPeopleOutline} from 'react-icons/md'
import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'interview',
  type: 'document',
  title: 'Interview',
  description: 'An interview with a subject-matter expert',
  icon: MdPeopleOutline,
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        media: MdPeopleOutline,
        title: `${title} (Interview)`,
      }
    },
  },
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.max(90),
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
        defineArrayMember({
          title: 'Video Resource',
          type: 'reference',
          to: [{type: 'videoResource'}],
        }),
        defineArrayMember({type: 'linkResource'}),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'body',
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
