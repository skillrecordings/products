import {MdRecordVoiceOver} from 'react-icons/md'
import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'explainer',
  type: 'document',
  title: 'Explainer',
  description:
    'A type of Lesson that works as intro or outro for a module or section.',
  icon: MdRecordVoiceOver,
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        media: MdRecordVoiceOver,
        title: `${title} (Explainer)`,
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
      name: 'explainerType',
      title: 'Explainer Type',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          {title: 'Module intro', value: 'moduleIntro'},
          {title: 'Module outro', value: 'moduleOutro'},
          {title: 'Section intro', value: 'sectionIntro'},
          {title: 'General (other)', value: 'general'},
        ],
      },
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
        defineArrayMember({type: 'stackblitz'}),
        defineArrayMember({type: 'testimonial'}),
        defineArrayMember({type: 'linkResource'}),
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
  ],
})
