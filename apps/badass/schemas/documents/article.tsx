import React from 'react'
import {MdOutlineArticle} from 'react-icons/md'
import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
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
      name: 'author',
      title: 'Author',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorAvatar',
      title: 'Author avatar',
      type: 'externalImage',
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
      name: 'card_color',
      title: 'Card color',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'red',
      options: {
        list: [
          {title: 'red', value: 'red'},
          {title: 'green', value: 'green'},
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
      title: 'Article Body',
      type: 'body',
      // validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
    }),
    defineField({
      name: 'externalImage',
      title: 'External Image',
      type: 'externalImage',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'body',
    }),
    defineField({
      name: 'shareCardDetails',
      title: 'Share Card details',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          description: 'max 30 chars',
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'string',
        },
        {
          name: 'image',
          title: 'Image',
          type: 'externalImage',
          description: 'Optional. Should have 1:1 aspect ratio',
        },
      ],
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
        {
          type: 'reference',
          to: [{type: 'skosConcept'}],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'externalImage.url',
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
