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
      name: 'author',
      title: 'Author',
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Name',
          type: 'string',
        },
        {
          name: 'title',
          title: 'Title',
          type: 'string',
        },
        {
          name: 'image',
          title: 'Image',
          type: 'image',
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'text',
      media: 'author.image.asset.url',
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
