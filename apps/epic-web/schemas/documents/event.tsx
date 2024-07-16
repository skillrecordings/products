import {MdOutlineArticle} from 'react-icons/md'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'event',
  type: 'document',
  title: 'Event',
  icon: MdOutlineArticle,
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
      description:
        'Used to attach self-paced workshops (when available) or other resources',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'module'}],
        },
      ],
    }),
    defineField({
      name: 'contributors',
      type: 'contributors',
      title: 'Contributors',
    }),
    defineField({
      name: 'startsAt',
      title: 'Starts at (in UTC)',
      description: 'When does the event start?',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        timeStep: 15,
      },
      // validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endsAt',
      title: 'Ends at (in UTC)',
      description: 'When does the event end?',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        timeStep: 15,
      },
      // validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'events',
      title: 'Events',
      description:
        'If this is a series of events, add them here. Otherwise, leave this empty.',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Simple Event',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'startsAt',
              title: 'Starts at (in UTC)',
              description: 'When does the event start?',
              type: 'datetime',
              options: {
                dateFormat: 'YYYY-MM-DD',
                timeFormat: 'HH:mm',
                timeStep: 15,
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'endsAt',
              title: 'Ends at (in UTC)',
              description: 'When does the event end?',
              type: 'datetime',
              options: {
                dateFormat: 'YYYY-MM-DD',
                timeFormat: 'HH:mm',
                timeStep: 15,
              },
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
        {
          type: 'reference',
          to: {type: 'talk'},
        },
      ],
    }),
    defineField({
      name: 'state',
      title: 'Current State',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'draft',
      options: {
        list: [
          {title: 'draft', value: 'draft'},
          {title: 'published', value: 'published'},
        ],
      },
    }),
    defineField({
      name: 'timezone',
      title: 'Timezone Link',
      type: 'url',
      description: 'A link to everytimezone.com for the timezone of the event',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 15,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'cloudinary.asset',
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'cloudinary.asset',
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      description: 'Used as a short "SEO" summary on Twitter cards etc.',
      type: 'text',
      validation: (Rule) => Rule.max(160),
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare(selection) {
      const {title} = selection
      return {
        title,
      }
    },
  },
})
