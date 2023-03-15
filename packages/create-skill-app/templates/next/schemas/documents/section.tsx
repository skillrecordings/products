import {MdOutlineGroupWork} from 'react-icons/md'
import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'section',
  type: 'document',
  title: 'Section',
  description: 'A named group of resources within a module.',
  icon: MdOutlineGroupWork,
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        media: MdOutlineGroupWork,
        title: `${title} (Section)`,
      }
    },
  },
  fields: [
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
      description: 'Exercises, Explainers, or Link Resources in the Section',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'exercise'}, {type: 'explainer'}, {type: 'linkResource'}],
        }),
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
