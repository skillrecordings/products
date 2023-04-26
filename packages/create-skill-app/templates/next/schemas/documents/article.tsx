import React from 'react'
import {MdOutlineArticle} from 'react-icons/md'
import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'article',
  type: 'document',
  title: 'Article',
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
      name: 'resources',
      title: 'Resources',
      type: 'array',
      of: [
        defineArrayMember({type: 'linkResource'}),
        defineArrayMember({type: 'tweet'}),
        defineArrayMember({type: 'reference', to: [{type: 'article'}]}),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 20,
      description: 'Body in MDX',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      description: 'Used in teaser card on Articles index page.',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Article Image',
      description:
        'Used as a header image and thumbnail. Aspect ratio should be 16:9.',
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
