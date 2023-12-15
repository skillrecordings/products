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
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'},
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
          {title: 'Bonus', value: 'bonus'},
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
      name: 'workshopApp',
      title: 'Workshop App',
      type: 'workshopApp',
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
            {title: 'Exercise', type: 'exercise'},
            {title: 'Section', type: 'section'},
            {title: 'Explainer', type: 'explainer'},
            {title: 'Lesson', type: 'lesson'},
            {title: 'Interview', type: 'interview'},
            {type: 'linkResource'},
          ],
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'markdown',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
    }),
    defineField({
      name: 'ogImage',
      title: 'Share card URL',
      type: 'url',
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
      media: 'image.asset.url',
    },
    prepare(selection) {
      const {title, media, type} = selection
      return {
        title: `${title} ${capitalize(type)}`,
        media: media && <img src={media} alt={title} />,
      }
    },
  },
})
