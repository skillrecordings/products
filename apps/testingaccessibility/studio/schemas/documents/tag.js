import React from 'react'

export default {
  name: 'tag',
  title: 'Tag',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'capitalized',
      validation: (Rule) => Rule.regex(/^[A-Z][a-zA-Z0-9]*$/).required(),
    },
    {
      name: 'value',
      title: 'Value',
      type: 'string',
      description: 'in kebab-case',
      validation: (Rule) => Rule.regex(/^[a-z0-9-]+$/).required(),
    },
    {name: 'image', title: 'Image', type: 'externalImage'},
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
}
