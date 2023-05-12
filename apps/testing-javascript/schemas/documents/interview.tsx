import * as React from 'react'
import {MdPeople} from 'react-icons/md'

export default {
  name: 'interview',
  title: 'Interviews',
  type: 'document',
  icon: MdPeople,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'body',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'isMultiple',
      title: 'Is it multiple interview?',
      type: 'boolean',
      initialValue: false,
    },
    {
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
        {
          name: 'image2',
          title: 'Image 2',
          type: 'externalImage',
          hidden: ({document}) => {
            return !document.isMultiple
          },
        },
      ],
    },
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
}
