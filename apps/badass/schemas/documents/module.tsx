import React from 'react'
import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'module',
  title: 'Module',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'section'}]})],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'markdown',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'body',
    }),
    defineField({name: 'image', title: 'Image', type: 'externalImage'}),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image.url',
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
