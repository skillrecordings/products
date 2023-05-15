import * as React from 'react'
import {MdQuestionAnswer} from 'react-icons/md'

export default {
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: MdQuestionAnswer,
  fields: [
    {
      name: 'text',
      title: 'Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'name',
      title: 'Author name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Author title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Author portrait',
      type: 'externalImage',
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'text',
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
