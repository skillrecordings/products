import {MdOutlineWorkspaces} from 'react-icons/md'
import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'exercise',
  type: 'document',
  title: 'Exercise',
  description:
    'A type of Lesson that has 2-parts, a problem (the exercise) and a solution.',
  icon: MdOutlineWorkspaces,
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        media: MdOutlineWorkspaces,
        title: `${title} (Exercise)`,
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
      name: 'contributors',
      type: 'contributors',
      title: 'Contributors',
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
      name: 'visibility',
      title: 'Visibility State',
      type: 'string',
      options: {
        list: ['public', 'paid', 'subscribed'],
        layout: 'radio',
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
        defineArrayMember({type: 'solution'}),
        defineArrayMember({type: 'workshopApp'}),
        defineArrayMember({type: 'testimonial'}),
        defineArrayMember({type: 'linkResource'}),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
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
