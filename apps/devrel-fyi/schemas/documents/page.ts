import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'page',
  title: 'Page',
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
      name: 'body',
      title: 'Body',
      type: 'markdown',
      description: 'Body in MDX',
    }),
    defineField({
      name: 'resources',
      title: 'Resources',
      description: 'Exercises, Sections, or Explainers in the Module',
      type: 'array',
      of: [
        defineArrayMember({
          title: 'Exercise, Sections and Explainers',
          type: 'reference',
          to: [
            {title: 'Lesson', type: 'lesson'},
            {title: 'Exercise', type: 'exercise'},
            {title: 'Explainer', type: 'explainer'},
            {title: 'Section', type: 'section'},
            {type: 'linkResource'},
          ],
        }),
      ],
    }),
    defineField({
      name: 'description',
      title: 'SEO Description',
      type: 'text',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      description:
        'Used as a preview image on Twitter cards etc. Size should be 1200×630.',
      type: 'cloudinary.asset',
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
