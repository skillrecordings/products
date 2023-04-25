import * as React from 'react'
import {capitalize} from 'lodash'
import {MdRadio} from 'react-icons/md'
import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'module',
  title: 'Module',
  type: 'document',
  icon: MdRadio,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'moduleType',
      title: 'Module Type',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          {title: 'Workshop', value: 'workshop'},
          {title: 'Tutorial', value: 'tutorial'},
        ],
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
      name: 'github',
      title: 'GitHub',
      type: 'githubRepo',
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
      name: 'body',
      description: 'Body in MDX',
      title: 'Body',
      type: 'text',
      rows: 20,
    }),
    defineField({
      name: 'image',
      title: 'Module Image',
      description:
        'Used as a module illustration. Aspect ratio should be 1:1 (square).',
      type: 'cloudinary.asset',
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      description:
        'Used as a preview image on Twitter cards etc. Size should be 1200×630.',
      type: 'cloudinary.asset',
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
      type: 'moduleType',
      title: 'title',
      media: 'image',
    },
    prepare(selection) {
      const {title, media, type} = selection
      return {
        title: `${title} ${capitalize(type)}`,
        media: media && <img src={media.secure_url} alt={title} />,
      }
    },
  },
})
