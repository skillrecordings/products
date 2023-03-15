import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'cta',
  title: 'CTA',
  type: 'document',
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
      name: 'body',
      title: 'Body',
      type: 'body',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'SEO Description',
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
        title: title,
      }
    },
  },
})
