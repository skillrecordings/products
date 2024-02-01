import React from 'react'
import {MdOutlineLocalShipping} from 'react-icons/md'
import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  icon: MdOutlineLocalShipping,
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
      name: 'partnerName',
      title: 'Partner name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedDate',
      title: 'Published at',
      type: 'string',
      validation: (Rule) => Rule.required(),
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
        defineArrayMember({
          type: 'reference',
          to: [{type: 'videoResource'}],
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Case Study Body - (outdated)',
      type: 'body',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'markdownBody',
      title: 'Case Study Body',
      type: 'markdown',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'externalImage',
    }),
    defineField({
      name: 'cardImage',
      title: 'Card image',
      type: 'externalImage',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'body',
    }),
    defineField({
      name: 'ogImage',
      title: 'Share Card',
      type: 'externalImage',
      description: '1200x628',
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
  preview: {
    select: {
      title: 'title',
      media: 'heroImage.url',
    },
    prepare(selection) {
      const {media, title} = selection
      return {
        title,
        media: media && <img src={media} alt={title} />,
      }
    },
  },
})
