import * as React from 'react'
import {capitalize, truncate} from 'lodash'
import {MdQuestionAnswer} from 'react-icons/md'
import {toPlainText} from '@portabletext/react'

export default {
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: MdQuestionAnswer,
  fields: [
    {
      name: 'body',
      title: 'Testimonial',
      type: 'body',
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
          name: 'image',
          title: 'Image',
          type: 'image',
        },
      ],
    },
    {
      name: 'external_url',
      title: 'External URL',
      type: 'url',
    },
    {
      name: 'concepts',
      title: 'Concepts',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'skosConcept'}],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'body',
      media: 'author.image.asset.url',
    },
    prepare(selection) {
      const {title, media, type} = selection
      return {
        title: `${truncate(toPlainText(title), {
          length: 60,
        })} ${capitalize(type)}`,
        media: media && <img src={media} alt={title} />,
      }
    },
  },
}
