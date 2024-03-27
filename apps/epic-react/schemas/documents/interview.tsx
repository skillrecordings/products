import * as React from 'react'
import {MdPeople} from 'react-icons/md'
import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'interview',
  title: 'Interview',
  type: 'document',
  icon: MdPeople,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'markdown',
      validation: (Rule) => Rule.max(160),
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
      description: 'Body in MDX',
      title: 'Body',
      type: 'markdown',
    }),
    defineField({
      name: 'portraits',
      title: 'Portraits',
      type: 'object',
      fields: [
        {
          name: 'image1',
          title: 'Image 1',
          type: 'externalImage',
          validation: (Rule) => Rule.required(),
        },
      ],
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
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'portraits.image1.url',
    },
    prepare(selection) {
      const {media, title} = selection
      return {
        title: title,
        media: media && <img src={media} alt={title} />,
      }
    },
  },
})
