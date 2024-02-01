import React from 'react'
import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'bodyImageFloated',
  type: 'object',
  title: 'ImageFloated',
  fields: [
    defineField({
      type: 'externalImage',
      name: 'image',
      title: 'Image',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'width',
      title: 'Width',
      type: 'number',
    }),
    defineField({
      name: 'height',
      title: 'Height',
      type: 'number',
    }),
    defineField({
      name: 'floatSide',
      title: 'Float side',
      type: 'string',
      initialValue: 'left',
      options: {
        list: [
          {title: 'left', value: 'left'},
          {title: 'right', value: 'right'},
        ],
        layout: 'radio',
      },
    }),
  ],
  preview: {
    select: {image: 'image', alt: 'alt'},
  },
  components: {
    preview: (props: any) => {
      const {alt, image} = props
      return image ? (
        <>
          <div>
            <img width="100%" height="auto" src={image.url} alt={alt} />
          </div>
          {alt && <b>{alt}</b>}
        </>
      ) : (
        <div>⚠️ missing image</div>
      )
    },
  },
})
