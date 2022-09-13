import {MdPeople as icon} from 'react-icons/md'
import React from 'react'

export default {
  name: 'person',
  title: 'Person',
  type: 'document',
  icon,
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Please use "Firstname Lastname" format',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    },
    {
      name: 'image',
      description: 'An associated image URL. Probably a logo.',
      title: 'Image URL',
      type: 'image-url',
    },
    {
      name: 'website',
      title: 'Website',
      type: 'url',
      description: 'Full URL',
    },
    {
      name: 'twitter',
      title: 'Twitter',
      type: 'url',
      description: 'Full URL',
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description:
        'External title that instructors use, e.g, "Software Engineer"',
    },
    {
      name: 'bio',
      title: 'Instructor Bio',
      type: 'markdown',
      description: 'Max length 500 characters',
      options: {
        maxLength: 500,
      },
    },
    {
      name: 'featuredResource',
      description: 'Featured resource on instructor profiles',
      title: 'Featured Resource',
      type: 'array',
      of: [
        {
          type: 'reference',
          title: 'Resources Refs',
          to: [{type: 'post'}],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image.url',
    },
    prepare(selection) {
      const {title, name, media} = selection
      return {
        title: title,
        media: <img src={media} alt={`${name}`} />,
      }
    },
  },
}
