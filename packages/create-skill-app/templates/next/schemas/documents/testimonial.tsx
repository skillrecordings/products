import * as React from 'react'
import {truncate} from 'lodash'
import {MdQuestionAnswer} from 'react-icons/md'
import {toPlainText} from '@portabletext/react'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: MdQuestionAnswer,
  fields: [
    defineField({
      name: 'body',
      title: 'Testimonial',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'object',
      fields: [
        defineField({
          name: 'name',
          title: 'Name',
          type: 'string',
        }),
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
        }),
      ],
    }),
    defineField({
      name: 'external_url',
      title: 'External URL',
      type: 'url',
    }),
  ],
  preview: {
    select: {
      title: 'body',
      media: 'author.image.asset.url',
    },
    prepare(selection) {
      const {title, media} = selection
      return {
        title: `${truncate(toPlainText(title), {
          length: 60,
        })}`,
        media: media && <img src={media} alt={title} />,
      }
    },
  },
})
