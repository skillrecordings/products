import {MdOutlineGroupWork} from 'react-icons/md'
import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'section',
  type: 'document',
  title: 'Workshop Section',
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
      description: 'Lessons in the section',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [
            {type: 'exercise'},
            {type: 'explainer'},
            {type: 'lesson'},
            {type: 'linkResource'},
          ],
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      description: 'Body in MDX',
      type: 'text',
      rows: 20,
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      description: 'Used as a short "SEO" summary on Twitter cards etc.',
      type: 'text',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'concepts',
      title: 'Concepts',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'skosConcept'}],
        }),
      ],
    }),
  ],
})
